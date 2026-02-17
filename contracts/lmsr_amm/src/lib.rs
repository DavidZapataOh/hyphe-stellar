#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, contracterror,
    Address, Env, IntoVal, Vec, symbol_short, token,
};

mod math;
use math::{SCALE, exp_fixed, ln_fixed, mul_fixed, div_fixed, to_usdc_ceil, to_usdc_floor};

// ============================================================
// TYPES
// ============================================================

#[contracttype]
#[derive(Clone, Debug)]
pub struct LmsrState {
    pub b: i128,              // liquidity parameter (fixed-point 18 decimals)
    pub quantities: Vec<i128>, // outstanding shares per outcome (fixed-point)
}

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    OutcomeToken,
    MarketFactory,
    UsdcToken,
    // Per-market LMSR state
    Market(u64),
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum Error {
    AlreadyInitialized = 1,
    NotAdmin = 2,
    MarketNotFound = 3,
    InvalidOutcome = 4,
    InvalidAmount = 5,
    InsufficientLiquidity = 6,
    MathOverflow = 7,
    ZeroCost = 8,
}

const BUMP_AMOUNT: u32 = 518_400;
const LIFETIME_THRESHOLD: u32 = 129_600;

// ============================================================
// CONTRACT
// ============================================================

#[contract]
pub struct LmsrAmm;

#[contractimpl]
impl LmsrAmm {
    pub fn initialize(
        env: Env,
        admin: Address,
        outcome_token: Address,
        market_factory: Address,
        usdc_token: Address,
    ) -> Result<(), Error> {
        if env.storage().instance().has(&DataKey::Admin) {
            return Err(Error::AlreadyInitialized);
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::OutcomeToken, &outcome_token);
        env.storage().instance().set(&DataKey::MarketFactory, &market_factory);
        env.storage().instance().set(&DataKey::UsdcToken, &usdc_token);
        Ok(())
    }

    /// Receive USDC as liquidity subsidy (from yield_splitter or anyone).
    /// Transfers real USDC from caller to this contract.
    pub fn fund(env: Env, caller: Address, amount: i128) -> Result<(), Error> {
        caller.require_auth();
        if amount <= 0 {
            return Err(Error::InvalidAmount);
        }

        let usdc = Self::usdc_client(&env);
        usdc.transfer(&caller, &env.current_contract_address(), &amount);

        env.events().publish(
            (symbol_short!("fund"),),
            (caller, amount),
        );
        Ok(())
    }

    /// Initialize LMSR state for a new market.
    pub fn init_market(
        env: Env,
        admin: Address,
        market_id: u64,
        num_outcomes: u32,
        b: i128,
    ) -> Result<(), Error> {
        admin.require_auth();

        let mut quantities = Vec::new(&env);
        for _ in 0..num_outcomes {
            quantities.push_back(0i128);
        }

        let state = LmsrState {
            b,
            quantities,
        };

        env.storage().persistent().set(&DataKey::Market(market_id), &state);
        Self::bump_key(&env, &DataKey::Market(market_id));
        Ok(())
    }

    /// Buy shares of a specific outcome.
    /// Transfers USDC from user to AMM. Mints outcome tokens to user.
    /// Returns USDC cost (7 decimals).
    pub fn buy(
        env: Env,
        user: Address,
        market_id: u64,
        outcome: u32,
        shares: i128,
    ) -> Result<i128, Error> {
        user.require_auth();
        if shares <= 0 {
            return Err(Error::InvalidAmount);
        }

        let mut state = Self::get_state(&env, market_id)?;
        if outcome as u32 >= state.quantities.len() {
            return Err(Error::InvalidOutcome);
        }

        let cost_before = Self::cost_function(&state)?;

        let current = state.quantities.get(outcome).unwrap();
        state.quantities.set(outcome, current + shares);

        let cost_after = Self::cost_function(&state)?;
        let cost_fixed = cost_after - cost_before;

        if cost_fixed <= 0 {
            return Err(Error::MathOverflow);
        }

        // Convert to USDC (round up so AMM never loses)
        let usdc_cost = to_usdc_ceil(cost_fixed);
        if usdc_cost <= 0 {
            return Err(Error::ZeroCost);
        }

        // Transfer USDC from user to AMM
        let usdc = Self::usdc_client(&env);
        usdc.transfer(&user, &env.current_contract_address(), &usdc_cost);

        // Mint outcome tokens to user
        let ot_addr: Address = env.storage().instance().get(&DataKey::OutcomeToken).unwrap();
        let amm_addr = env.current_contract_address();
        Self::mint_tokens(&env, &ot_addr, &amm_addr, market_id, outcome, &user, shares);

        // Save updated state
        env.storage().persistent().set(&DataKey::Market(market_id), &state);
        Self::bump_key(&env, &DataKey::Market(market_id));

        env.events().publish(
            (symbol_short!("buy"), market_id, outcome),
            (user, shares, usdc_cost),
        );

        Ok(usdc_cost)
    }

    /// Sell shares of a specific outcome.
    /// Burns outcome tokens from user. Transfers USDC from AMM to user.
    /// Returns USDC refund (7 decimals).
    pub fn sell(
        env: Env,
        user: Address,
        market_id: u64,
        outcome: u32,
        shares: i128,
    ) -> Result<i128, Error> {
        user.require_auth();
        if shares <= 0 {
            return Err(Error::InvalidAmount);
        }

        let mut state = Self::get_state(&env, market_id)?;
        if outcome as u32 >= state.quantities.len() {
            return Err(Error::InvalidOutcome);
        }

        let current = state.quantities.get(outcome).unwrap();
        if current < shares {
            return Err(Error::InsufficientLiquidity);
        }

        let cost_before = Self::cost_function(&state)?;

        state.quantities.set(outcome, current - shares);

        let cost_after = Self::cost_function(&state)?;
        let refund_fixed = cost_before - cost_after;

        // Burn outcome tokens from user
        let ot_addr: Address = env.storage().instance().get(&DataKey::OutcomeToken).unwrap();
        let amm_addr = env.current_contract_address();
        Self::burn_tokens(&env, &ot_addr, &amm_addr, market_id, outcome, &user, shares);

        // Convert to USDC (round down so AMM never overpays)
        let usdc_refund = to_usdc_floor(refund_fixed);

        if usdc_refund > 0 {
            // Transfer USDC from AMM to user
            let usdc = Self::usdc_client(&env);
            usdc.transfer(&env.current_contract_address(), &user, &usdc_refund);
        }

        env.storage().persistent().set(&DataKey::Market(market_id), &state);
        Self::bump_key(&env, &DataKey::Market(market_id));

        env.events().publish(
            (symbol_short!("sell"), market_id, outcome),
            (user, shares, usdc_refund),
        );

        Ok(usdc_refund)
    }

    /// Get current price of an outcome (0 to SCALE).
    pub fn get_price(env: Env, market_id: u64, outcome: u32) -> Result<i128, Error> {
        let state = Self::get_state(&env, market_id)?;
        if outcome as u32 >= state.quantities.len() {
            return Err(Error::InvalidOutcome);
        }
        Self::price_of(&state, outcome)
    }

    /// Get prices for all outcomes.
    pub fn get_prices(env: Env, market_id: u64) -> Result<Vec<i128>, Error> {
        let state = Self::get_state(&env, market_id)?;
        let mut prices = Vec::new(&env);
        for i in 0..state.quantities.len() {
            let p = Self::price_of(&state, i)?;
            prices.push_back(p);
        }
        Ok(prices)
    }

    /// Quote the cost of buying N shares in USDC (7 decimals) without executing.
    pub fn quote_buy(
        env: Env,
        market_id: u64,
        outcome: u32,
        shares: i128,
    ) -> Result<i128, Error> {
        let mut state = Self::get_state(&env, market_id)?;
        if outcome as u32 >= state.quantities.len() {
            return Err(Error::InvalidOutcome);
        }

        let cost_before = Self::cost_function(&state)?;
        let current = state.quantities.get(outcome).unwrap();
        state.quantities.set(outcome, current + shares);
        let cost_after = Self::cost_function(&state)?;

        Ok(to_usdc_ceil(cost_after - cost_before))
    }

    /// Get full LMSR state for a market.
    pub fn get_state_view(env: Env, market_id: u64) -> Result<LmsrState, Error> {
        Self::get_state(&env, market_id)
    }

    /// Get AMM's USDC balance (actual token balance).
    pub fn get_balance(env: Env) -> i128 {
        let usdc = Self::usdc_client(&env);
        usdc.balance(&env.current_contract_address())
    }

    // ============================================================
    // INTERNAL: LMSR MATH
    // ============================================================

    fn cost_function(state: &LmsrState) -> Result<i128, Error> {
        let b = state.b;
        if b <= 0 {
            return Err(Error::MathOverflow);
        }

        let mut sum_exp = 0i128;
        for i in 0..state.quantities.len() {
            let q_i = state.quantities.get(i).unwrap();
            let ratio = div_fixed(q_i, b);
            let exp_val = exp_fixed(ratio);
            sum_exp += exp_val;
        }

        if sum_exp <= 0 {
            return Err(Error::MathOverflow);
        }

        let ln_sum = ln_fixed(sum_exp);
        Ok(mul_fixed(b, ln_sum))
    }

    fn price_of(state: &LmsrState, outcome: u32) -> Result<i128, Error> {
        let b = state.b;
        if b <= 0 {
            return Err(Error::MathOverflow);
        }

        let mut sum_exp = 0i128;
        let mut exp_i = 0i128;

        for j in 0..state.quantities.len() {
            let q_j = state.quantities.get(j).unwrap();
            let ratio = div_fixed(q_j, b);
            let e = exp_fixed(ratio);
            sum_exp += e;
            if j == outcome {
                exp_i = e;
            }
        }

        if sum_exp <= 0 {
            return Err(Error::MathOverflow);
        }

        Ok(div_fixed(exp_i, sum_exp))
    }

    fn get_state(env: &Env, market_id: u64) -> Result<LmsrState, Error> {
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
            soroban_sdk::vec![
                env,
                minter.into_val(env),
                market_id.into_val(env),
                outcome.into_val(env),
                to.into_val(env),
                amount.into_val(env),
            ],
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
            soroban_sdk::vec![
                env,
                minter.into_val(env),
                market_id.into_val(env),
                outcome.into_val(env),
                from.into_val(env),
                amount.into_val(env),
            ],
        );
    }
}

// ============================================================
// TESTS
// ============================================================

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::testutils::Address as _;
    use soroban_sdk::token::{Client as TokenClient, StellarAssetClient};
    use soroban_sdk::Env;

    // Import OutcomeToken WASM for cross-contract tests
    mod outcome_token_contract {
        soroban_sdk::contractimport!(
            file = "../target/wasm32v1-none/release/hyphe_outcome_token.wasm"
        );
    }

    struct TestSetup {
        env: Env,
        admin: Address,
        usdc_id: Address,
        ot_id: Address,
        client: LmsrAmmClient<'static>,
    }

    fn setup() -> TestSetup {
        let env = Env::default();
        env.mock_all_auths_allowing_non_root_auth();

        // Create USDC SAC token
        let token_admin = Address::generate(&env);
        let usdc_id = env.register_stellar_asset_contract_v2(token_admin.clone()).address();

        // Deploy OutcomeToken
        let ot_id = env.register(outcome_token_contract::WASM, ());

        // Initialize OutcomeToken
        let admin = Address::generate(&env);
        env.invoke_contract::<()>(
            &ot_id,
            &soroban_sdk::Symbol::new(&env, "initialize"),
            soroban_sdk::vec![&env, admin.into_val(&env)],
        );

        // Deploy AMM
        let contract_id = env.register(LmsrAmm, ());
        let client = LmsrAmmClient::new(&env, &contract_id);
        let factory = Address::generate(&env);
        client.initialize(&admin, &ot_id, &factory, &usdc_id);

        // Register AMM as minter on OutcomeToken
        env.invoke_contract::<()>(
            &ot_id,
            &soroban_sdk::Symbol::new(&env, "add_minter"),
            soroban_sdk::vec![&env, admin.into_val(&env), contract_id.into_val(&env)],
        );

        // Fund AMM with USDC for sell payouts
        let sac = StellarAssetClient::new(&env, &usdc_id);
        sac.mint(&contract_id, &10_000_000_000_000i128); // 1M USDC

        TestSetup { env, admin, usdc_id, ot_id, client }
    }

    fn mint_usdc(env: &Env, usdc_id: &Address, to: &Address, amount: i128) {
        let sac = StellarAssetClient::new(env, usdc_id);
        sac.mint(to, &amount);
    }

    fn init_binary_market(_env: &Env, client: &LmsrAmmClient, admin: &Address, market_id: u64, b: i128) {
        client.init_market(admin, &market_id, &2, &b);
    }

    fn get_ot_balance(env: &Env, ot_id: &Address, market_id: u64, outcome: u32, user: &Address) -> i128 {
        env.invoke_contract::<i128>(
            ot_id,
            &soroban_sdk::Symbol::new(env, "balance"),
            soroban_sdk::vec![env, market_id.into_val(env), outcome.into_val(env), user.into_val(env)],
        )
    }

    #[test]
    fn test_initial_prices_50_50() {
        let t = setup();
        let b = 1000 * SCALE;
        init_binary_market(&t.env, &t.client, &t.admin, 1, b);

        let p_yes = t.client.get_price(&1, &0);
        let p_no = t.client.get_price(&1, &1);

        let half = SCALE / 2;
        let tolerance = SCALE / 100;
        assert!((p_yes - half).abs() < tolerance, "YES price not ~50%: {}", p_yes);
        assert!((p_no - half).abs() < tolerance, "NO price not ~50%: {}", p_no);

        let sum = p_yes + p_no;
        assert!((sum - SCALE).abs() < tolerance, "prices don't sum to 1: {}", sum);
    }

    #[test]
    fn test_buy_increases_price() {
        let t = setup();
        let b = 1000 * SCALE;
        init_binary_market(&t.env, &t.client, &t.admin, 1, b);

        let user = Address::generate(&t.env);
        mint_usdc(&t.env, &t.usdc_id, &user, 10_000_000_000_000);

        let p_before = t.client.get_price(&1, &0);

        let usdc_cost = t.client.buy(&user, &1, &0, &(100 * SCALE));
        assert!(usdc_cost > 0, "cost should be positive");

        let p_after = t.client.get_price(&1, &0);
        assert!(p_after > p_before, "YES price should increase after buying YES");

        let p_no = t.client.get_price(&1, &1);
        assert!(p_no < SCALE / 2, "NO price should be below 50%");

        let sum = p_after + p_no;
        let tolerance = SCALE / 100;
        assert!((sum - SCALE).abs() < tolerance, "prices don't sum to 1: {}", sum);
    }

    #[test]
    fn test_sell_decreases_price() {
        let t = setup();
        let b = 1000 * SCALE;
        init_binary_market(&t.env, &t.client, &t.admin, 1, b);

        let user = Address::generate(&t.env);
        mint_usdc(&t.env, &t.usdc_id, &user, 10_000_000_000_000);

        t.client.buy(&user, &1, &0, &(200 * SCALE));
        let p_after_buy = t.client.get_price(&1, &0);

        let refund = t.client.sell(&user, &1, &0, &(100 * SCALE));
        assert!(refund > 0, "refund should be positive");

        let p_after_sell = t.client.get_price(&1, &0);
        assert!(p_after_sell < p_after_buy, "price should decrease after sell");
    }

    #[test]
    fn test_quote_matches_buy() {
        let t = setup();
        let b = 1000 * SCALE;
        init_binary_market(&t.env, &t.client, &t.admin, 1, b);

        let quoted = t.client.quote_buy(&1, &0, &(50 * SCALE));

        let user = Address::generate(&t.env);
        mint_usdc(&t.env, &t.usdc_id, &user, 10_000_000_000_000);
        let actual = t.client.buy(&user, &1, &0, &(50 * SCALE));

        assert_eq!(quoted, actual, "quote should match actual cost");
    }

    #[test]
    fn test_fund() {
        let t = setup();

        let funder = Address::generate(&t.env);
        mint_usdc(&t.env, &t.usdc_id, &funder, 10_000_000_000);
        let balance_before = t.client.get_balance();

        t.client.fund(&funder, &10_000_000_000);

        let balance_after = t.client.get_balance();
        assert_eq!(balance_after - balance_before, 10_000_000_000);
    }

    #[test]
    fn test_large_b_small_price_impact() {
        let t = setup();
        let b = 100_000 * SCALE;
        init_binary_market(&t.env, &t.client, &t.admin, 1, b);

        let user = Address::generate(&t.env);
        mint_usdc(&t.env, &t.usdc_id, &user, 10_000_000_000_000);
        t.client.buy(&user, &1, &0, &(10 * SCALE));

        let p = t.client.get_price(&1, &0);
        let half = SCALE / 2;
        let diff = (p - half).abs();
        assert!(diff < SCALE / 100, "large b should mean small price impact: diff={}", diff);
    }

    #[test]
    fn test_small_b_large_price_impact() {
        let t = setup();
        let b = 10 * SCALE;
        init_binary_market(&t.env, &t.client, &t.admin, 1, b);

        let user = Address::generate(&t.env);
        mint_usdc(&t.env, &t.usdc_id, &user, 10_000_000_000_000);
        t.client.buy(&user, &1, &0, &(10 * SCALE));

        let p = t.client.get_price(&1, &0);
        let half = SCALE / 2;
        let diff = (p - half).abs();
        assert!(diff > SCALE / 20, "small b should mean large price impact: diff={}", diff);
    }

    #[test]
    fn test_three_outcome_market() {
        let t = setup();
        let b = 1000 * SCALE;
        t.client.init_market(&t.admin, &1, &3, &b);

        let prices = t.client.get_prices(&1);
        assert_eq!(prices.len(), 3);

        let third = SCALE / 3;
        let tolerance = SCALE / 50;
        for i in 0..3 {
            let p = prices.get(i).unwrap();
            assert!((p - third).abs() < tolerance, "outcome {} price not ~33%: {}", i, p);
        }
    }

    #[test]
    fn test_buy_transfers_usdc() {
        let t = setup();
        let b = 1000 * SCALE;
        init_binary_market(&t.env, &t.client, &t.admin, 1, b);

        let user = Address::generate(&t.env);
        let initial_usdc = 10_000_000_000_000i128;
        mint_usdc(&t.env, &t.usdc_id, &user, initial_usdc);

        let usdc = TokenClient::new(&t.env, &t.usdc_id);
        let user_before = usdc.balance(&user);

        let cost = t.client.buy(&user, &1, &0, &(100 * SCALE));

        let user_after = usdc.balance(&user);
        assert_eq!(user_before - user_after, cost, "user should pay exact USDC cost");
        assert!(cost > 0);
    }

    #[test]
    fn test_sell_transfers_usdc() {
        let t = setup();
        let b = 1000 * SCALE;
        init_binary_market(&t.env, &t.client, &t.admin, 1, b);

        let user = Address::generate(&t.env);
        mint_usdc(&t.env, &t.usdc_id, &user, 10_000_000_000_000);

        t.client.buy(&user, &1, &0, &(100 * SCALE));

        let usdc = TokenClient::new(&t.env, &t.usdc_id);
        let user_before = usdc.balance(&user);

        let refund = t.client.sell(&user, &1, &0, &(50 * SCALE));

        let user_after = usdc.balance(&user);
        assert_eq!(user_after - user_before, refund, "user should receive exact USDC refund");
        assert!(refund > 0);
    }

    // ============================================================
    // NEW: Outcome token mint/burn tests
    // ============================================================

    #[test]
    fn test_buy_mints_outcome_tokens() {
        let t = setup();
        let b = 1000 * SCALE;
        init_binary_market(&t.env, &t.client, &t.admin, 1, b);

        let user = Address::generate(&t.env);
        mint_usdc(&t.env, &t.usdc_id, &user, 10_000_000_000_000);

        let shares = 100 * SCALE;
        t.client.buy(&user, &1, &0, &shares);

        // User should have outcome tokens
        let balance = get_ot_balance(&t.env, &t.ot_id, 1, 0, &user);
        assert_eq!(balance, shares);

        // No tokens for the other outcome
        let balance_no = get_ot_balance(&t.env, &t.ot_id, 1, 1, &user);
        assert_eq!(balance_no, 0);
    }

    #[test]
    fn test_sell_burns_outcome_tokens() {
        let t = setup();
        let b = 1000 * SCALE;
        init_binary_market(&t.env, &t.client, &t.admin, 1, b);

        let user = Address::generate(&t.env);
        mint_usdc(&t.env, &t.usdc_id, &user, 10_000_000_000_000);

        let shares = 100 * SCALE;
        t.client.buy(&user, &1, &0, &shares);

        // Sell half
        let half_shares = 50 * SCALE;
        t.client.sell(&user, &1, &0, &half_shares);

        let balance = get_ot_balance(&t.env, &t.ot_id, 1, 0, &user);
        assert_eq!(balance, shares - half_shares);
    }

    #[test]
    fn test_multiple_buys_accumulate_tokens() {
        let t = setup();
        let b = 1000 * SCALE;
        init_binary_market(&t.env, &t.client, &t.admin, 1, b);

        let user = Address::generate(&t.env);
        mint_usdc(&t.env, &t.usdc_id, &user, 10_000_000_000_000);

        t.client.buy(&user, &1, &0, &(50 * SCALE));
        t.client.buy(&user, &1, &0, &(30 * SCALE));

        let balance = get_ot_balance(&t.env, &t.ot_id, 1, 0, &user);
        assert_eq!(balance, 80 * SCALE);
    }
}
