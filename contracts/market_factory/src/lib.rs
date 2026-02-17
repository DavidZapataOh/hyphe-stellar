#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, contracterror,
    Address, Env, IntoVal, String, symbol_short, token,
};

// ============================================================
// TYPES
// ============================================================

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub enum MarketStatus {
    Open,
    Closed,
    Resolved,
    Disputed,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct MarketInfo {
    pub id: u64,
    pub question: String,
    pub num_outcomes: u32,
    pub end_time: u64,
    pub oracle_id: Address,
    pub status: MarketStatus,
    pub total_collateral: i128,
    pub winning_outcome: u32,   // u32::MAX means not set
}

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    OutcomeToken,
    Vault,
    Amm,
    UsdcToken,
    MarketCount,
    Market(u64),
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum Error {
    AlreadyInitialized = 1,
    NotAdmin = 2,
    MarketNotFound = 3,
    MarketNotOpen = 4,
    MarketNotClosed = 5,
    MarketNotResolved = 6,
    MarketExpired = 7,
    NotOracle = 8,
    InvalidOutcome = 9,
    InsufficientBalance = 10,
    InvalidAmount = 11,
    NoWinningTokens = 12,
}

const BUMP_AMOUNT: u32 = 518_400;
const LIFETIME_THRESHOLD: u32 = 129_600;
const NO_WINNER: u32 = u32::MAX;

// ============================================================
// CONTRACT
// ============================================================

#[contract]
pub struct MarketFactory;

#[contractimpl]
impl MarketFactory {
    // ============================================================
    // INITIALIZATION
    // ============================================================

    pub fn initialize(
        env: Env,
        admin: Address,
        outcome_token: Address,
        vault: Address,
        amm: Address,
        usdc_token: Address,
    ) -> Result<(), Error> {
        if env.storage().instance().has(&DataKey::Admin) {
            return Err(Error::AlreadyInitialized);
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::OutcomeToken, &outcome_token);
        env.storage().instance().set(&DataKey::Vault, &vault);
        env.storage().instance().set(&DataKey::Amm, &amm);
        env.storage().instance().set(&DataKey::UsdcToken, &usdc_token);
        env.storage().instance().set(&DataKey::MarketCount, &0u64);
        Ok(())
    }

    // ============================================================
    // MARKET CREATION
    // ============================================================

    pub fn create_market(
        env: Env,
        admin: Address,
        question: String,
        num_outcomes: u32,
        end_time: u64,
        oracle_id: Address,
    ) -> Result<u64, Error> {
        admin.require_auth();
        Self::require_admin(&env, &admin)?;

        let count: u64 = env.storage().instance().get(&DataKey::MarketCount).unwrap_or(0);
        let market_id = count + 1;

        let market = MarketInfo {
            id: market_id,
            question,
            num_outcomes,
            end_time,
            oracle_id,
            status: MarketStatus::Open,
            total_collateral: 0,
            winning_outcome: NO_WINNER,
        };

        env.storage().persistent().set(&DataKey::Market(market_id), &market);
        Self::bump_key(&env, &DataKey::Market(market_id));
        env.storage().instance().set(&DataKey::MarketCount, &market_id);

        env.events().publish(
            (symbol_short!("mkt_new"), market_id),
            (market.num_outcomes, market.end_time),
        );

        Ok(market_id)
    }

    // ============================================================
    // MARKET QUERIES
    // ============================================================

    pub fn get_market(env: Env, market_id: u64) -> Result<MarketInfo, Error> {
        env.storage()
            .persistent()
            .get(&DataKey::Market(market_id))
            .ok_or(Error::MarketNotFound)
    }

    pub fn market_count(env: Env) -> u64 {
        env.storage().instance().get(&DataKey::MarketCount).unwrap_or(0)
    }

    // ============================================================
    // SPLIT: USDC → YES + NO tokens
    // ============================================================

    /// User deposits USDC and receives equal amounts of all outcome tokens.
    /// usdc_amount is in USDC units (7 decimals on Stellar).
    pub fn split(
        env: Env,
        user: Address,
        market_id: u64,
        usdc_amount: i128,
    ) -> Result<(), Error> {
        user.require_auth();
        if usdc_amount <= 0 {
            return Err(Error::InvalidAmount);
        }

        let mut market = Self::get_market_internal(&env, market_id)?;

        if market.status != MarketStatus::Open {
            return Err(Error::MarketNotOpen);
        }
        if env.ledger().timestamp() >= market.end_time {
            return Err(Error::MarketExpired);
        }

        // Transfer USDC from user to this contract
        let usdc = Self::usdc_client(&env);
        usdc.transfer(&user, &env.current_contract_address(), &usdc_amount);

        // Mint outcome tokens to user
        let ot_addr: Address = env.storage().instance().get(&DataKey::OutcomeToken).unwrap();
        let factory_addr = env.current_contract_address();

        for outcome in 0..market.num_outcomes {
            Self::mint_tokens(&env, &ot_addr, &factory_addr, market_id, outcome, &user, usdc_amount);
        }

        market.total_collateral += usdc_amount;
        env.storage().persistent().set(&DataKey::Market(market_id), &market);
        Self::bump_key(&env, &DataKey::Market(market_id));

        env.events().publish(
            (symbol_short!("split"), market_id),
            (user, usdc_amount),
        );

        Ok(())
    }

    // ============================================================
    // MERGE: YES + NO tokens → USDC
    // ============================================================

    /// User returns equal amounts of all outcome tokens and receives USDC back.
    pub fn merge(
        env: Env,
        user: Address,
        market_id: u64,
        amount: i128,
    ) -> Result<(), Error> {
        user.require_auth();
        if amount <= 0 {
            return Err(Error::InvalidAmount);
        }

        let mut market = Self::get_market_internal(&env, market_id)?;
        let ot_addr: Address = env.storage().instance().get(&DataKey::OutcomeToken).unwrap();
        let factory_addr = env.current_contract_address();

        // Burn all outcome tokens
        for outcome in 0..market.num_outcomes {
            Self::burn_tokens(&env, &ot_addr, &factory_addr, market_id, outcome, &user, amount);
        }

        // Transfer USDC back to user
        let usdc = Self::usdc_client(&env);
        usdc.transfer(&env.current_contract_address(), &user, &amount);

        market.total_collateral -= amount;
        env.storage().persistent().set(&DataKey::Market(market_id), &market);
        Self::bump_key(&env, &DataKey::Market(market_id));

        env.events().publish(
            (symbol_short!("merge"), market_id),
            (user, amount),
        );

        Ok(())
    }

    // ============================================================
    // RESOLVE: Oracle sets winning outcome
    // ============================================================

    pub fn resolve(
        env: Env,
        oracle: Address,
        market_id: u64,
        winning_outcome: u32,
    ) -> Result<(), Error> {
        oracle.require_auth();

        let mut market = Self::get_market_internal(&env, market_id)?;

        if market.oracle_id != oracle {
            return Err(Error::NotOracle);
        }
        if market.status == MarketStatus::Resolved {
            return Err(Error::MarketNotClosed);
        }
        if winning_outcome >= market.num_outcomes {
            return Err(Error::InvalidOutcome);
        }

        market.status = MarketStatus::Resolved;
        market.winning_outcome = winning_outcome;
        env.storage().persistent().set(&DataKey::Market(market_id), &market);
        Self::bump_key(&env, &DataKey::Market(market_id));

        env.events().publish(
            (symbol_short!("resolve"), market_id),
            winning_outcome,
        );

        Ok(())
    }

    // ============================================================
    // REDEEM: Winner burns tokens, receives USDC
    // ============================================================

    pub fn redeem(
        env: Env,
        user: Address,
        market_id: u64,
    ) -> Result<i128, Error> {
        user.require_auth();

        let market = Self::get_market_internal(&env, market_id)?;
        if market.status != MarketStatus::Resolved {
            return Err(Error::MarketNotResolved);
        }

        let ot_addr: Address = env.storage().instance().get(&DataKey::OutcomeToken).unwrap();
        let factory_addr = env.current_contract_address();

        let winning_balance = Self::get_token_balance(
            &env, &ot_addr, market_id, market.winning_outcome, &user,
        );
        if winning_balance <= 0 {
            return Err(Error::NoWinningTokens);
        }

        // Burn winning tokens
        Self::burn_tokens(
            &env, &ot_addr, &factory_addr,
            market_id, market.winning_outcome, &user, winning_balance,
        );

        // Burn any losing tokens (worth 0)
        for outcome in 0..market.num_outcomes {
            if outcome != market.winning_outcome {
                let bal = Self::get_token_balance(&env, &ot_addr, market_id, outcome, &user);
                if bal > 0 {
                    Self::burn_tokens(
                        &env, &ot_addr, &factory_addr,
                        market_id, outcome, &user, bal,
                    );
                }
            }
        }

        // Transfer USDC payout to user
        let payout = winning_balance;
        let usdc = Self::usdc_client(&env);
        usdc.transfer(&env.current_contract_address(), &user, &payout);

        env.events().publish(
            (symbol_short!("redeem"), market_id),
            (user, payout),
        );

        Ok(payout)
    }

    // ============================================================
    // ADMIN: Sweep collateral to vault for Blend yield
    // ============================================================

    /// Move USDC from factory to vault so it earns yield in Blend.
    /// Admin calls this periodically. The vault deposits to Blend Pool.
    pub fn sweep_to_vault(env: Env, admin: Address, amount: i128) -> Result<(), Error> {
        admin.require_auth();
        Self::require_admin(&env, &admin)?;
        if amount <= 0 {
            return Err(Error::InvalidAmount);
        }

        let vault: Address = env.storage().instance().get(&DataKey::Vault).unwrap();
        let usdc = Self::usdc_client(&env);
        usdc.transfer(&env.current_contract_address(), &vault, &amount);

        env.events().publish(
            (symbol_short!("sweep"),),
            (vault, amount),
        );
        Ok(())
    }

    // ============================================================
    // ADMIN: Close market
    // ============================================================

    pub fn close_market(env: Env, market_id: u64) -> Result<(), Error> {
        let mut market = Self::get_market_internal(&env, market_id)?;
        if market.status != MarketStatus::Open {
            return Err(Error::MarketNotOpen);
        }
        if env.ledger().timestamp() < market.end_time {
            return Err(Error::MarketNotOpen);
        }
        market.status = MarketStatus::Closed;
        env.storage().persistent().set(&DataKey::Market(market_id), &market);
        Self::bump_key(&env, &DataKey::Market(market_id));
        Ok(())
    }

    // ============================================================
    // INTERNAL HELPERS
    // ============================================================

    fn require_admin(env: &Env, addr: &Address) -> Result<(), Error> {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        if *addr != admin {
            return Err(Error::NotAdmin);
        }
        Ok(())
    }

    fn get_market_internal(env: &Env, market_id: u64) -> Result<MarketInfo, Error> {
        env.storage()
            .persistent()
            .get(&DataKey::Market(market_id))
            .ok_or(Error::MarketNotFound)
    }

    fn bump_key(env: &Env, key: &DataKey) {
        env.storage()
            .persistent()
            .extend_ttl(key, LIFETIME_THRESHOLD, BUMP_AMOUNT);
    }

    fn usdc_client(env: &Env) -> token::Client<'_> {
        let addr: Address = env.storage().instance().get(&DataKey::UsdcToken).unwrap();
        token::Client::new(env, &addr)
    }

    // Cross-contract calls to OutcomeToken

    fn mint_tokens(
        env: &Env,
        ot_addr: &Address,
        minter: &Address,
        market_id: u64,
        outcome: u32,
        to: &Address,
        amount: i128,
    ) {
        env.invoke_contract::<()>(
            ot_addr,
            &soroban_sdk::Symbol::new(env, "mint"),
            soroban_sdk::vec![env, minter.into_val(env), market_id.into_val(env), outcome.into_val(env), to.into_val(env), amount.into_val(env)],
        );
    }

    fn burn_tokens(
        env: &Env,
        ot_addr: &Address,
        minter: &Address,
        market_id: u64,
        outcome: u32,
        from: &Address,
        amount: i128,
    ) {
        env.invoke_contract::<()>(
            ot_addr,
            &soroban_sdk::Symbol::new(env, "burn"),
            soroban_sdk::vec![env, minter.into_val(env), market_id.into_val(env), outcome.into_val(env), from.into_val(env), amount.into_val(env)],
        );
    }

    fn get_token_balance(
        env: &Env,
        ot_addr: &Address,
        market_id: u64,
        outcome: u32,
        user: &Address,
    ) -> i128 {
        env.invoke_contract::<i128>(
            ot_addr,
            &soroban_sdk::Symbol::new(env, "balance"),
            soroban_sdk::vec![env, market_id.into_val(env), outcome.into_val(env), user.into_val(env)],
        )
    }
}

// ============================================================
// TESTS
// ============================================================

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::testutils::{Address as _, Ledger};
    use soroban_sdk::token::{Client as TokenClient, StellarAssetClient};
    use soroban_sdk::{Env, IntoVal};

    // Include the OutcomeToken WASM for testing
    mod outcome_token_contract {
        soroban_sdk::contractimport!(
            file = "../target/wasm32v1-none/release/hyphe_outcome_token.wasm"
        );
    }

    fn setup() -> (Env, Address, Address, Address, MarketFactoryClient<'static>, Address) {
        let env = Env::default();
        env.mock_all_auths();

        // Deploy USDC SAC token
        let token_admin = Address::generate(&env);
        let usdc_id = env.register_stellar_asset_contract_v2(token_admin.clone()).address();

        // Deploy OutcomeToken
        let ot_id = env.register(
            crate::test::outcome_token_contract::WASM,
            (),
        );

        // Initialize OutcomeToken
        let admin = Address::generate(&env);
        env.invoke_contract::<()>(
            &ot_id,
            &soroban_sdk::Symbol::new(&env, "initialize"),
            soroban_sdk::vec![&env, admin.into_val(&env)],
        );

        // Deploy MarketFactory
        let factory_id = env.register(MarketFactory, ());
        let client = MarketFactoryClient::new(&env, &factory_id);

        let vault = Address::generate(&env);
        let amm = Address::generate(&env);
        client.initialize(&admin, &ot_id, &vault, &amm, &usdc_id);

        // Register factory as minter on OutcomeToken
        env.invoke_contract::<()>(
            &ot_id,
            &soroban_sdk::Symbol::new(&env, "add_minter"),
            soroban_sdk::vec![&env, admin.into_val(&env), factory_id.into_val(&env)],
        );

        (env, admin, ot_id, usdc_id, client, factory_id)
    }

    fn mint_usdc(env: &Env, usdc_id: &Address, to: &Address, amount: i128) {
        let sac = StellarAssetClient::new(env, usdc_id);
        sac.mint(to, &amount);
    }

    fn create_test_market(env: &Env, client: &MarketFactoryClient, admin: &Address) -> (u64, Address) {
        let oracle = Address::generate(env);
        env.ledger().set_timestamp(1000);
        let market_id = client.create_market(
            admin,
            &String::from_str(env, "Will Brazil win?"),
            &2,
            &2000,
            &oracle,
        );
        (market_id, oracle)
    }

    #[test]
    fn test_create_market() {
        let (env, admin, _ot, _usdc, client, _) = setup();
        let (market_id, _oracle) = create_test_market(&env, &client, &admin);

        assert_eq!(market_id, 1);
        assert_eq!(client.market_count(), 1);

        let market = client.get_market(&market_id);
        assert_eq!(market.num_outcomes, 2);
        assert_eq!(market.status, MarketStatus::Open);
        assert_eq!(market.total_collateral, 0);
    }

    #[test]
    fn test_split_mints_tokens_and_transfers_usdc() {
        let (env, admin, ot, usdc_id, client, factory_id) = setup();
        let (market_id, _oracle) = create_test_market(&env, &client, &admin);
        let user = Address::generate(&env);

        // Mint USDC to user
        mint_usdc(&env, &usdc_id, &user, 10_000);

        let usdc = TokenClient::new(&env, &usdc_id);
        assert_eq!(usdc.balance(&user), 10_000);

        client.split(&user, &market_id, &1000);

        // Check USDC transferred
        assert_eq!(usdc.balance(&user), 9_000);
        assert_eq!(usdc.balance(&factory_id), 1_000);

        // Check outcome tokens minted
        let yes_bal: i128 = env.invoke_contract(
            &ot,
            &soroban_sdk::Symbol::new(&env, "balance"),
            soroban_sdk::vec![&env, market_id.into_val(&env), 0u32.into_val(&env), user.into_val(&env)],
        );
        let no_bal: i128 = env.invoke_contract(
            &ot,
            &soroban_sdk::Symbol::new(&env, "balance"),
            soroban_sdk::vec![&env, market_id.into_val(&env), 1u32.into_val(&env), user.into_val(&env)],
        );

        assert_eq!(yes_bal, 1000);
        assert_eq!(no_bal, 1000);

        let market = client.get_market(&market_id);
        assert_eq!(market.total_collateral, 1000);
    }

    #[test]
    fn test_merge_burns_tokens_and_returns_usdc() {
        let (env, admin, _ot, usdc_id, client, _factory_id) = setup();
        let (market_id, _oracle) = create_test_market(&env, &client, &admin);
        let user = Address::generate(&env);

        mint_usdc(&env, &usdc_id, &user, 10_000);
        client.split(&user, &market_id, &1000);
        client.merge(&user, &market_id, &400);

        let usdc = TokenClient::new(&env, &usdc_id);
        // User: 10000 - 1000 (split) + 400 (merge) = 9400
        assert_eq!(usdc.balance(&user), 9_400);

        let market = client.get_market(&market_id);
        assert_eq!(market.total_collateral, 600);
    }

    #[test]
    fn test_split_merge_neutral() {
        let (env, admin, _ot, usdc_id, client, _) = setup();
        let (market_id, _oracle) = create_test_market(&env, &client, &admin);
        let user = Address::generate(&env);

        mint_usdc(&env, &usdc_id, &user, 10_000);
        client.split(&user, &market_id, &1000);
        client.merge(&user, &market_id, &1000);

        let usdc = TokenClient::new(&env, &usdc_id);
        assert_eq!(usdc.balance(&user), 10_000); // back to original

        let market = client.get_market(&market_id);
        assert_eq!(market.total_collateral, 0);
    }

    #[test]
    fn test_resolve_and_redeem_pays_usdc() {
        let (env, admin, _ot, usdc_id, client, _) = setup();
        let (market_id, oracle) = create_test_market(&env, &client, &admin);
        let user = Address::generate(&env);

        mint_usdc(&env, &usdc_id, &user, 10_000);
        client.split(&user, &market_id, &1000);

        // Resolve: YES (0) wins
        client.resolve(&oracle, &market_id, &0);

        let market = client.get_market(&market_id);
        assert_eq!(market.status, MarketStatus::Resolved);

        // Redeem
        let payout = client.redeem(&user, &market_id);
        assert_eq!(payout, 1000);

        let usdc = TokenClient::new(&env, &usdc_id);
        // User: 10000 - 1000 (split) + 1000 (redeem) = 10000
        assert_eq!(usdc.balance(&user), 10_000);
    }

    #[test]
    fn test_resolve_by_non_oracle_fails() {
        let (env, admin, _ot, _usdc, client, _) = setup();
        let (market_id, _oracle) = create_test_market(&env, &client, &admin);
        let fake = Address::generate(&env);

        let result = client.try_resolve(&fake, &market_id, &0);
        assert!(result.is_err());
    }

    #[test]
    fn test_split_after_expiry_fails() {
        let (env, admin, _ot, usdc_id, client, _) = setup();
        let (market_id, _oracle) = create_test_market(&env, &client, &admin);
        let user = Address::generate(&env);
        mint_usdc(&env, &usdc_id, &user, 10_000);

        env.ledger().set_timestamp(3000);

        let result = client.try_split(&user, &market_id, &1000);
        assert!(result.is_err());
    }

    #[test]
    fn test_redeem_before_resolve_fails() {
        let (env, admin, _ot, usdc_id, client, _) = setup();
        let (market_id, _oracle) = create_test_market(&env, &client, &admin);
        let user = Address::generate(&env);

        mint_usdc(&env, &usdc_id, &user, 10_000);
        client.split(&user, &market_id, &1000);

        let result = client.try_redeem(&user, &market_id);
        assert!(result.is_err());
    }

    #[test]
    fn test_multiple_markets() {
        let (env, admin, _ot, usdc_id, client, _) = setup();
        let oracle = Address::generate(&env);
        env.ledger().set_timestamp(1000);

        let m1 = client.create_market(
            &admin,
            &String::from_str(&env, "Will Brazil win?"),
            &2, &2000, &oracle,
        );
        let m2 = client.create_market(
            &admin,
            &String::from_str(&env, "Will France win?"),
            &2, &3000, &oracle,
        );

        assert_eq!(m1, 1);
        assert_eq!(m2, 2);

        let user = Address::generate(&env);
        mint_usdc(&env, &usdc_id, &user, 10_000);
        client.split(&user, &m1, &500);
        client.split(&user, &m2, &300);

        let market1 = client.get_market(&m1);
        let market2 = client.get_market(&m2);
        assert_eq!(market1.total_collateral, 500);
        assert_eq!(market2.total_collateral, 300);

        let usdc = TokenClient::new(&env, &usdc_id);
        assert_eq!(usdc.balance(&user), 9_200); // 10000 - 500 - 300
    }

    #[test]
    fn test_sweep_to_vault() {
        let (env, admin, _ot, usdc_id, client, factory_id) = setup();
        let (market_id, _oracle) = create_test_market(&env, &client, &admin);
        let user = Address::generate(&env);

        mint_usdc(&env, &usdc_id, &user, 10_000);
        client.split(&user, &market_id, &1000);

        let usdc = TokenClient::new(&env, &usdc_id);
        assert_eq!(usdc.balance(&factory_id), 1_000);

        // Get vault address from setup
        // The vault was set as a random address in setup()
        // Sweep 500 to vault
        client.sweep_to_vault(&admin, &500);

        assert_eq!(usdc.balance(&factory_id), 500);
    }
}
