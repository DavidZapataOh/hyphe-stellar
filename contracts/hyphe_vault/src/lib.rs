#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, contracterror,
    Address, Env, symbol_short, token,
};

pub mod blend;

// ============================================================
// TYPES
// ============================================================

#[contracttype]
#[derive(Clone, Debug)]
pub struct YieldRatios {
    pub subsidy_bps: u32,   // 7000 = 70%
    pub user_bps: u32,      // 2000 = 20%
    pub protocol_bps: u32,  // 1000 = 10%
}

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    UsdcToken,
    BlendPool,
    LmsrAmm,
    Treasury,
    YieldRatios,
    BufferRatioBps,
    // Global accounting
    TotalDeposited,
    TotalYieldAccrued,
    TotalPrincipalInBlend,
    BlendBTokens,
    // Yield tracking (reward-per-token pattern)
    GlobalYieldPerDeposit,
    // Per-user
    UserDeposit(Address),
    UserYieldDebt(Address),
    // Yield distribution pools (cumulative tracking)
    SubsidyPool,
    UserYieldPool,
    ProtocolYieldPool,
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum Error {
    AlreadyInitialized = 1,
    NotAdmin = 2,
    InvalidAmount = 3,
    InsufficientBalance = 4,
    InsufficientBuffer = 5,
    NoYieldToClaim = 6,
    BlendWithdrawFailed = 7,
}

const BUMP_AMOUNT: u32 = 518_400;
const LIFETIME_THRESHOLD: u32 = 129_600;
const BPS_SCALE: i128 = 10_000;
const YIELD_PRECISION: i128 = 1_000_000_000_000_000_000; // 10^18

// Reserve index for USDC in Blend Pool (index 0 for our purposes)
const USDC_RESERVE_INDEX: u32 = 0;

// ============================================================
// CONTRACT
// ============================================================

#[contract]
pub struct HypheVault;

#[contractimpl]
impl HypheVault {
    /// Initialize the vault with Blend Pool integration.
    ///
    /// - `blend_pool`: Address of the Blend lending pool
    /// - `buffer_ratio_bps`: % of deposits kept liquid (1500 = 15%)
    pub fn initialize(
        env: Env,
        admin: Address,
        usdc_token: Address,
        blend_pool: Address,
        lmsr_amm: Address,
        treasury: Address,
        buffer_ratio_bps: u32,
        subsidy_bps: u32,
        user_bps: u32,
        protocol_bps: u32,
    ) -> Result<(), Error> {
        if env.storage().instance().has(&DataKey::Admin) {
            return Err(Error::AlreadyInitialized);
        }

        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::UsdcToken, &usdc_token);
        env.storage().instance().set(&DataKey::BlendPool, &blend_pool);
        env.storage().instance().set(&DataKey::LmsrAmm, &lmsr_amm);
        env.storage().instance().set(&DataKey::Treasury, &treasury);
        env.storage().instance().set(&DataKey::BufferRatioBps, &buffer_ratio_bps);
        env.storage().instance().set(&DataKey::YieldRatios, &YieldRatios {
            subsidy_bps,
            user_bps,
            protocol_bps,
        });
        env.storage().instance().set(&DataKey::TotalDeposited, &0i128);
        env.storage().instance().set(&DataKey::TotalYieldAccrued, &0i128);
        env.storage().instance().set(&DataKey::TotalPrincipalInBlend, &0i128);
        env.storage().instance().set(&DataKey::BlendBTokens, &0i128);
        env.storage().instance().set(&DataKey::GlobalYieldPerDeposit, &0i128);
        env.storage().instance().set(&DataKey::SubsidyPool, &0i128);
        env.storage().instance().set(&DataKey::UserYieldPool, &0i128);
        env.storage().instance().set(&DataKey::ProtocolYieldPool, &0i128);

        Ok(())
    }

    /// Deposit USDC into the vault.
    /// Splits between local buffer and Blend Pool based on buffer_ratio.
    pub fn deposit(env: Env, user: Address, amount: i128) -> Result<(), Error> {
        user.require_auth();
        if amount <= 0 {
            return Err(Error::InvalidAmount);
        }

        // Transfer USDC from user to vault
        let usdc = Self::usdc_client(&env);
        let vault_addr = env.current_contract_address();
        usdc.transfer(&user, &vault_addr, &amount);

        // Calculate buffer/blend split
        let buffer_bps: u32 = env.storage().instance()
            .get(&DataKey::BufferRatioBps).unwrap_or(1500);
        let buffer_amount = amount * buffer_bps as i128 / BPS_SCALE;
        let blend_amount = amount - buffer_amount;

        // Deposit to Blend Pool
        if blend_amount > 0 {
            let pool: Address = env.storage().instance().get(&DataKey::BlendPool).unwrap();
            let usdc_addr: Address = env.storage().instance().get(&DataKey::UsdcToken).unwrap();

            let positions = blend::supply(&env, &pool, &usdc_addr, &vault_addr, blend_amount);

            // Track bTokens from Blend
            let b_tokens = positions.supply.get(USDC_RESERVE_INDEX).unwrap_or(0);
            env.storage().instance().set(&DataKey::BlendBTokens, &b_tokens);

            let current_principal: i128 = Self::get_stored(&env, &DataKey::TotalPrincipalInBlend);
            env.storage().instance().set(
                &DataKey::TotalPrincipalInBlend,
                &(current_principal + blend_amount),
            );
        }

        // Update user deposit tracking
        let total: i128 = Self::get_stored(&env, &DataKey::TotalDeposited);
        let user_dep: i128 = Self::get_user_deposit(&env, &user);

        if user_dep == 0 {
            let gypd: i128 = Self::get_stored(&env, &DataKey::GlobalYieldPerDeposit);
            env.storage().persistent().set(&DataKey::UserYieldDebt(user.clone()), &gypd);
            Self::bump_persistent(&env, &DataKey::UserYieldDebt(user.clone()));
        }

        env.storage().instance().set(&DataKey::TotalDeposited, &(total + amount));
        env.storage().persistent().set(&DataKey::UserDeposit(user.clone()), &(user_dep + amount));
        Self::bump_persistent(&env, &DataKey::UserDeposit(user.clone()));

        env.events().publish(
            (symbol_short!("deposit"),),
            (user, amount),
        );
        Ok(())
    }

    /// Withdraw USDC from the vault.
    /// Uses local buffer first; pulls from Blend if buffer is insufficient.
    pub fn withdraw(env: Env, user: Address, amount: i128) -> Result<(), Error> {
        user.require_auth();
        if amount <= 0 {
            return Err(Error::InvalidAmount);
        }

        let user_dep: i128 = Self::get_user_deposit(&env, &user);
        if user_dep < amount {
            return Err(Error::InsufficientBalance);
        }

        let vault_addr = env.current_contract_address();
        let usdc = Self::usdc_client(&env);
        let buffer = usdc.balance(&vault_addr);

        // Pull from Blend if buffer is insufficient
        if buffer < amount {
            let needed = amount - buffer;
            let pool: Address = env.storage().instance().get(&DataKey::BlendPool).unwrap();
            let usdc_addr: Address = env.storage().instance().get(&DataKey::UsdcToken).unwrap();

            let positions = blend::withdraw(&env, &pool, &usdc_addr, &vault_addr, needed);

            // Update bToken tracking
            let b_tokens = positions.supply.get(USDC_RESERVE_INDEX).unwrap_or(0);
            env.storage().instance().set(&DataKey::BlendBTokens, &b_tokens);

            // Reduce principal tracking
            let current_principal: i128 = Self::get_stored(&env, &DataKey::TotalPrincipalInBlend);
            let new_principal = if needed > current_principal { 0 } else { current_principal - needed };
            env.storage().instance().set(&DataKey::TotalPrincipalInBlend, &new_principal);
        }

        // Transfer USDC to user
        usdc.transfer(&vault_addr, &user, &amount);

        let total: i128 = Self::get_stored(&env, &DataKey::TotalDeposited);
        env.storage().instance().set(&DataKey::TotalDeposited, &(total - amount));
        env.storage().persistent().set(&DataKey::UserDeposit(user.clone()), &(user_dep - amount));
        Self::bump_persistent(&env, &DataKey::UserDeposit(user.clone()));

        env.events().publish(
            (symbol_short!("withdraw"),),
            (user, amount),
        );
        Ok(())
    }

    /// Accrue yield from Blend Protocol.
    ///
    /// Anyone can call this (it's a public good).
    /// Withdraws all from Blend, computes yield, distributes 70/20/10,
    /// then re-deposits principal back to Blend.
    pub fn accrue_yield(env: Env) -> Result<i128, Error> {
        let principal: i128 = Self::get_stored(&env, &DataKey::TotalPrincipalInBlend);
        if principal == 0 {
            return Ok(0);
        }

        let vault_addr = env.current_contract_address();
        let pool: Address = env.storage().instance().get(&DataKey::BlendPool).unwrap();
        let usdc_addr: Address = env.storage().instance().get(&DataKey::UsdcToken).unwrap();
        let usdc = Self::usdc_client(&env);

        let balance_before = usdc.balance(&vault_addr);

        // Withdraw ALL from Blend (use 2x principal as upper bound; Blend caps to available)
        let withdraw_amount = principal * 2;
        blend::withdraw(&env, &pool, &usdc_addr, &vault_addr, withdraw_amount);

        let balance_after = usdc.balance(&vault_addr);
        let total_received = balance_after - balance_before;

        // Calculate yield
        let yield_amount = total_received - principal;

        if yield_amount <= 0 {
            // No yield — re-deposit principal to Blend
            let positions = blend::supply(&env, &pool, &usdc_addr, &vault_addr, principal);
            let b_tokens = positions.supply.get(USDC_RESERVE_INDEX).unwrap_or(0);
            env.storage().instance().set(&DataKey::BlendBTokens, &b_tokens);
            return Ok(0);
        }

        // Distribute yield (70/20/10)
        let ratios: YieldRatios = env.storage().instance().get(&DataKey::YieldRatios).unwrap();
        let subsidy = yield_amount * ratios.subsidy_bps as i128 / BPS_SCALE;
        let user_share = yield_amount * ratios.user_bps as i128 / BPS_SCALE;
        let protocol_share = yield_amount - subsidy - user_share;

        let amm: Address = env.storage().instance().get(&DataKey::LmsrAmm).unwrap();
        let treasury: Address = env.storage().instance().get(&DataKey::Treasury).unwrap();

        if subsidy > 0 {
            usdc.transfer(&vault_addr, &amm, &subsidy);
        }
        if protocol_share > 0 {
            usdc.transfer(&vault_addr, &treasury, &protocol_share);
        }
        // user_share stays in vault for user claims

        // Re-deposit principal to Blend
        let positions = blend::supply(&env, &pool, &usdc_addr, &vault_addr, principal);
        let b_tokens = positions.supply.get(USDC_RESERVE_INDEX).unwrap_or(0);
        env.storage().instance().set(&DataKey::BlendBTokens, &b_tokens);

        // Update cumulative pools
        let sub_pool: i128 = Self::get_stored(&env, &DataKey::SubsidyPool);
        let user_pool: i128 = Self::get_stored(&env, &DataKey::UserYieldPool);
        let proto_pool: i128 = Self::get_stored(&env, &DataKey::ProtocolYieldPool);

        env.storage().instance().set(&DataKey::SubsidyPool, &(sub_pool + subsidy));
        env.storage().instance().set(&DataKey::UserYieldPool, &(user_pool + user_share));
        env.storage().instance().set(&DataKey::ProtocolYieldPool, &(proto_pool + protocol_share));

        // Update global yield per deposit for proportional user distribution
        let total_dep: i128 = Self::get_stored(&env, &DataKey::TotalDeposited);
        if total_dep > 0 {
            let current_gypd: i128 = Self::get_stored(&env, &DataKey::GlobalYieldPerDeposit);
            let yield_per_unit = user_share * YIELD_PRECISION / total_dep;
            env.storage().instance().set(
                &DataKey::GlobalYieldPerDeposit,
                &(current_gypd + yield_per_unit),
            );
        }

        let total_yield: i128 = Self::get_stored(&env, &DataKey::TotalYieldAccrued);
        env.storage().instance().set(&DataKey::TotalYieldAccrued, &(total_yield + yield_amount));

        env.events().publish(
            (symbol_short!("accrue"),),
            (yield_amount, subsidy, user_share, protocol_share),
        );
        Ok(yield_amount)
    }

    /// Claim pending yield for a user.
    pub fn claim_yield(env: Env, user: Address) -> Result<i128, Error> {
        user.require_auth();

        let pending = Self::get_pending_yield(&env, &user);
        if pending <= 0 {
            return Err(Error::NoYieldToClaim);
        }

        let gypd: i128 = Self::get_stored(&env, &DataKey::GlobalYieldPerDeposit);
        env.storage().persistent().set(&DataKey::UserYieldDebt(user.clone()), &gypd);
        Self::bump_persistent(&env, &DataKey::UserYieldDebt(user.clone()));

        let user_pool: i128 = Self::get_stored(&env, &DataKey::UserYieldPool);
        env.storage().instance().set(&DataKey::UserYieldPool, &(user_pool - pending));

        let usdc = Self::usdc_client(&env);
        usdc.transfer(&env.current_contract_address(), &user, &pending);

        env.events().publish(
            (symbol_short!("claim"),),
            (user, pending),
        );
        Ok(pending)
    }

    /// Rebalance buffer: ensure buffer ratio is maintained.
    /// If buffer is too low, pull from Blend. If too high, push to Blend.
    pub fn rebalance(env: Env, admin: Address) -> Result<(), Error> {
        admin.require_auth();
        Self::require_admin(&env, &admin)?;

        let vault_addr = env.current_contract_address();
        let usdc = Self::usdc_client(&env);
        let buffer = usdc.balance(&vault_addr);

        let total_dep: i128 = Self::get_stored(&env, &DataKey::TotalDeposited);
        if total_dep == 0 {
            return Ok(());
        }

        let buffer_bps: u32 = env.storage().instance()
            .get(&DataKey::BufferRatioBps).unwrap_or(1500);
        let target_buffer = total_dep * buffer_bps as i128 / BPS_SCALE;

        let pool: Address = env.storage().instance().get(&DataKey::BlendPool).unwrap();
        let usdc_addr: Address = env.storage().instance().get(&DataKey::UsdcToken).unwrap();

        if buffer < target_buffer {
            // Pull from Blend to fill buffer
            let needed = target_buffer - buffer;
            let positions = blend::withdraw(&env, &pool, &usdc_addr, &vault_addr, needed);
            let b_tokens = positions.supply.get(USDC_RESERVE_INDEX).unwrap_or(0);
            env.storage().instance().set(&DataKey::BlendBTokens, &b_tokens);

            let current_principal: i128 = Self::get_stored(&env, &DataKey::TotalPrincipalInBlend);
            let new_principal = if needed > current_principal { 0 } else { current_principal - needed };
            env.storage().instance().set(&DataKey::TotalPrincipalInBlend, &new_principal);
        } else if buffer > target_buffer {
            // Push excess to Blend
            let excess = buffer - target_buffer;
            let positions = blend::supply(&env, &pool, &usdc_addr, &vault_addr, excess);
            let b_tokens = positions.supply.get(USDC_RESERVE_INDEX).unwrap_or(0);
            env.storage().instance().set(&DataKey::BlendBTokens, &b_tokens);

            let current_principal: i128 = Self::get_stored(&env, &DataKey::TotalPrincipalInBlend);
            env.storage().instance().set(
                &DataKey::TotalPrincipalInBlend,
                &(current_principal + excess),
            );
        }

        Ok(())
    }

    // ============================================================
    // QUERIES
    // ============================================================

    pub fn get_user_yield(env: Env, user: Address) -> i128 {
        Self::get_pending_yield(&env, &user)
    }

    pub fn get_deposit(env: Env, user: Address) -> i128 {
        Self::get_user_deposit(&env, &user)
    }

    pub fn get_tvl(env: Env) -> i128 {
        Self::get_stored(&env, &DataKey::TotalDeposited)
    }

    /// USDC held locally by the vault (buffer).
    pub fn get_balance(env: Env) -> i128 {
        let usdc = Self::usdc_client(&env);
        usdc.balance(&env.current_contract_address())
    }

    /// How much USDC principal is deposited in Blend + bToken count.
    pub fn get_blend_position(env: Env) -> (i128, i128) {
        let principal = Self::get_stored(&env, &DataKey::TotalPrincipalInBlend);
        let b_tokens = Self::get_stored(&env, &DataKey::BlendBTokens);
        (principal, b_tokens)
    }

    pub fn get_yield_pools(env: Env) -> (i128, i128, i128) {
        let subsidy = Self::get_stored(&env, &DataKey::SubsidyPool);
        let user = Self::get_stored(&env, &DataKey::UserYieldPool);
        let protocol = Self::get_stored(&env, &DataKey::ProtocolYieldPool);
        (subsidy, user, protocol)
    }

    pub fn get_total_yield(env: Env) -> i128 {
        Self::get_stored(&env, &DataKey::TotalYieldAccrued)
    }

    // ============================================================
    // INTERNAL
    // ============================================================

    fn require_admin(env: &Env, addr: &Address) -> Result<(), Error> {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        if *addr != admin {
            return Err(Error::NotAdmin);
        }
        Ok(())
    }

    fn get_stored(env: &Env, key: &DataKey) -> i128 {
        env.storage().instance().get(key).unwrap_or(0)
    }

    fn get_user_deposit(env: &Env, user: &Address) -> i128 {
        env.storage()
            .persistent()
            .get(&DataKey::UserDeposit(user.clone()))
            .unwrap_or(0)
    }

    fn get_pending_yield(env: &Env, user: &Address) -> i128 {
        let user_dep = Self::get_user_deposit(env, user);
        if user_dep == 0 {
            return 0;
        }
        let gypd: i128 = Self::get_stored(env, &DataKey::GlobalYieldPerDeposit);
        let user_debt: i128 = env
            .storage()
            .persistent()
            .get(&DataKey::UserYieldDebt(user.clone()))
            .unwrap_or(0);
        let diff = gypd - user_debt;
        if diff <= 0 {
            return 0;
        }
        user_dep * diff / YIELD_PRECISION
    }

    fn usdc_client(env: &Env) -> token::Client<'_> {
        let addr: Address = env.storage().instance().get(&DataKey::UsdcToken).unwrap();
        token::Client::new(env, &addr)
    }

    fn bump_persistent(env: &Env, key: &DataKey) {
        env.storage()
            .persistent()
            .extend_ttl(key, LIFETIME_THRESHOLD, BUMP_AMOUNT);
    }
}

// ============================================================
// TESTS
// ============================================================

#[cfg(test)]
mod test {
    use super::*;
    use super::blend::{Positions, Request, SCALAR_9};
    use soroban_sdk::testutils::Address as _;
    use soroban_sdk::token::{Client as TokenClient, StellarAssetClient};
    use soroban_sdk::{contract, contractimpl, Env, Map};

    // ============================================================
    // MOCK BLEND POOL
    // ============================================================

    #[contracttype]
    #[derive(Clone)]
    pub enum MockKey {
        BRate,
        UsdcToken,
        UserBTokens(Address),
    }

    #[contract]
    pub struct MockBlendPool;

    #[contractimpl]
    impl MockBlendPool {
        pub fn initialize(env: Env, usdc_token: Address) {
            env.storage().instance().set(&MockKey::UsdcToken, &usdc_token);
            env.storage().instance().set(&MockKey::BRate, &SCALAR_9); // 1.0
        }

        pub fn submit(
            env: Env,
            from: Address,
            _spender: Address,
            to: Address,
            requests: soroban_sdk::Vec<Request>,
        ) -> Positions {
            let usdc_addr: Address = env.storage().instance().get(&MockKey::UsdcToken).unwrap();
            let usdc = token::Client::new(&env, &usdc_addr);
            let b_rate: i128 = env.storage().instance().get(&MockKey::BRate).unwrap_or(SCALAR_9);
            let pool_addr = env.current_contract_address();

            let mut user_b_tokens: i128 = env
                .storage()
                .persistent()
                .get(&MockKey::UserBTokens(from.clone()))
                .unwrap_or(0);

            for i in 0..requests.len() {
                let req = requests.get(i).unwrap();
                if req.request_type == 0 {
                    // Supply: transfer USDC from caller (vault) to pool
                    usdc.transfer(&from, &pool_addr, &req.amount);
                    let new_b_tokens = req.amount * SCALAR_9 / b_rate;
                    user_b_tokens += new_b_tokens;
                } else if req.request_type == 1 {
                    // Withdraw: compute max, transfer USDC from pool to recipient
                    let max_underlying = user_b_tokens * b_rate / SCALAR_9;
                    let actual = if req.amount > max_underlying {
                        max_underlying
                    } else {
                        req.amount
                    };
                    if actual > 0 {
                        let b_burned = actual * SCALAR_9 / b_rate;
                        user_b_tokens -= b_burned;
                        usdc.transfer(&pool_addr, &to, &actual);
                    }
                }
            }

            env.storage()
                .persistent()
                .set(&MockKey::UserBTokens(from), &user_b_tokens);

            let mut supply_map = Map::new(&env);
            supply_map.set(0u32, user_b_tokens);

            Positions {
                liabilities: Map::new(&env),
                collateral: Map::new(&env),
                supply: supply_map,
            }
        }

        pub fn get_positions(env: Env, user: Address) -> Positions {
            let user_b_tokens: i128 = env
                .storage()
                .persistent()
                .get(&MockKey::UserBTokens(user))
                .unwrap_or(0);

            let mut supply_map = Map::new(&env);
            supply_map.set(0u32, user_b_tokens);

            Positions {
                liabilities: Map::new(&env),
                collateral: Map::new(&env),
                supply: supply_map,
            }
        }

        /// Test helper: set b_rate to simulate yield accrual.
        /// e.g. set_b_rate(1_100_000_000) = 10% yield.
        pub fn set_b_rate(env: Env, rate: i128) {
            env.storage().instance().set(&MockKey::BRate, &rate);
        }
    }

    // ============================================================
    // TEST SETUP
    // ============================================================

    struct TestSetup {
        env: Env,
        admin: Address,
        usdc_id: Address,
        pool_id: Address,
        amm: Address,
        treasury: Address,
        client: HypheVaultClient<'static>,
    }

    fn setup() -> TestSetup {
        let env = Env::default();
        env.mock_all_auths_allowing_non_root_auth();

        // Create USDC SAC token
        let token_admin = Address::generate(&env);
        let usdc_id = env.register_stellar_asset_contract_v2(token_admin.clone()).address();

        // Deploy Mock Blend Pool
        let pool_id = env.register(MockBlendPool, ());
        let mock_client = MockBlendPoolClient::new(&env, &pool_id);
        mock_client.initialize(&usdc_id);

        // Fund mock pool with USDC for yield payouts
        let sac = StellarAssetClient::new(&env, &usdc_id);
        sac.mint(&pool_id, &1_000_000);

        let admin = Address::generate(&env);
        let amm = Address::generate(&env);
        let treasury = Address::generate(&env);

        let contract_id = env.register(HypheVault, ());
        let client = HypheVaultClient::new(&env, &contract_id);

        // buffer_ratio = 15%, yield split = 70/20/10
        client.initialize(
            &admin, &usdc_id, &pool_id,
            &amm, &treasury,
            &1500,
            &7000, &2000, &1000,
        );

        TestSetup { env, admin, usdc_id, pool_id, amm, treasury, client }
    }

    fn mint_usdc(env: &Env, usdc_id: &Address, to: &Address, amount: i128) {
        let sac = StellarAssetClient::new(env, usdc_id);
        sac.mint(to, &amount);
    }

    // ============================================================
    // DEPOSIT / WITHDRAW TESTS
    // ============================================================

    #[test]
    fn test_deposit_splits_buffer_and_blend() {
        let t = setup();
        let user = Address::generate(&t.env);
        mint_usdc(&t.env, &t.usdc_id, &user, 100_000);

        t.client.deposit(&user, &10_000);

        assert_eq!(t.client.get_tvl(), 10_000);
        assert_eq!(t.client.get_deposit(&user), 10_000);

        // 15% buffer = 1500, 85% to Blend = 8500
        assert_eq!(t.client.get_balance(), 1_500);

        let (principal, b_tokens) = t.client.get_blend_position();
        assert_eq!(principal, 8_500);
        assert_eq!(b_tokens, 8_500); // at b_rate=1.0, bTokens == USDC amount
    }

    #[test]
    fn test_withdraw_from_buffer_only() {
        let t = setup();
        let user = Address::generate(&t.env);
        mint_usdc(&t.env, &t.usdc_id, &user, 100_000);

        t.client.deposit(&user, &10_000);
        // Buffer = 1500. Withdraw 1000 from buffer.
        t.client.withdraw(&user, &1_000);

        assert_eq!(t.client.get_tvl(), 9_000);
        assert_eq!(t.client.get_balance(), 500); // 1500 - 1000

        // Blend position unchanged
        let (principal, _) = t.client.get_blend_position();
        assert_eq!(principal, 8_500);
    }

    #[test]
    fn test_withdraw_pulls_from_blend_when_buffer_insufficient() {
        let t = setup();
        let user = Address::generate(&t.env);
        mint_usdc(&t.env, &t.usdc_id, &user, 100_000);

        t.client.deposit(&user, &10_000);
        // Buffer = 1500. Withdraw 5000 → needs 3500 from Blend.
        t.client.withdraw(&user, &5_000);

        assert_eq!(t.client.get_tvl(), 5_000);

        let usdc = TokenClient::new(&t.env, &t.usdc_id);
        assert_eq!(usdc.balance(&user), 95_000); // 100k - 10k + 5k

        // Blend principal reduced by 3500
        let (principal, _) = t.client.get_blend_position();
        assert_eq!(principal, 5_000); // 8500 - 3500
    }

    #[test]
    fn test_withdraw_more_than_deposited_fails() {
        let t = setup();
        let user = Address::generate(&t.env);
        mint_usdc(&t.env, &t.usdc_id, &user, 100_000);

        t.client.deposit(&user, &1_000);
        let result = t.client.try_withdraw(&user, &2_000);
        assert!(result.is_err());
    }

    // ============================================================
    // YIELD TESTS (Blend integration)
    // ============================================================

    #[test]
    fn test_accrue_yield_from_blend() {
        let t = setup();
        let user = Address::generate(&t.env);
        mint_usdc(&t.env, &t.usdc_id, &user, 100_000);

        t.client.deposit(&user, &10_000);
        // principal in Blend = 8500

        // Simulate 10% yield: b_rate 1.0 → 1.1
        let mock = MockBlendPoolClient::new(&t.env, &t.pool_id);
        mock.set_b_rate(&1_100_000_000);

        // Accrue yield
        let yield_amount = t.client.accrue_yield();

        // Yield = 8500 * 10% = 850
        assert_eq!(yield_amount, 850);
        assert_eq!(t.client.get_total_yield(), 850);

        let (subsidy, user_yield, protocol) = t.client.get_yield_pools();
        // 70% of 850 = 595
        assert_eq!(subsidy, 595);
        // 20% of 850 = 170
        assert_eq!(user_yield, 170);
        // 10% of 850 = 85
        assert_eq!(protocol, 85);
    }

    #[test]
    fn test_yield_distributed_to_amm_and_treasury() {
        let t = setup();
        let user = Address::generate(&t.env);
        mint_usdc(&t.env, &t.usdc_id, &user, 100_000);

        t.client.deposit(&user, &10_000);

        let mock = MockBlendPoolClient::new(&t.env, &t.pool_id);
        mock.set_b_rate(&1_100_000_000);
        t.client.accrue_yield();

        let usdc = TokenClient::new(&t.env, &t.usdc_id);
        assert_eq!(usdc.balance(&t.amm), 595);     // 70% subsidy
        assert_eq!(usdc.balance(&t.treasury), 85);  // 10% protocol
    }

    #[test]
    fn test_user_can_claim_yield_from_blend() {
        let t = setup();
        let user = Address::generate(&t.env);
        mint_usdc(&t.env, &t.usdc_id, &user, 100_000);

        t.client.deposit(&user, &10_000);

        let mock = MockBlendPoolClient::new(&t.env, &t.pool_id);
        mock.set_b_rate(&1_100_000_000);
        t.client.accrue_yield();

        // User share = 170 (20% of 850)
        let pending = t.client.get_user_yield(&user);
        assert_eq!(pending, 170);

        let claimed = t.client.claim_yield(&user);
        assert_eq!(claimed, 170);

        let usdc = TokenClient::new(&t.env, &t.usdc_id);
        // User had 90k (after deposit), now 90k + 170
        assert_eq!(usdc.balance(&user), 90_170);
    }

    #[test]
    fn test_multiple_users_proportional_blend_yield() {
        let t = setup();
        let alice = Address::generate(&t.env);
        let bob = Address::generate(&t.env);
        mint_usdc(&t.env, &t.usdc_id, &alice, 75_000);
        mint_usdc(&t.env, &t.usdc_id, &bob, 25_000);

        // Alice 75%, Bob 25%
        t.client.deposit(&alice, &75_000);
        t.client.deposit(&bob, &25_000);

        let mock = MockBlendPoolClient::new(&t.env, &t.pool_id);
        mock.set_b_rate(&1_100_000_000);

        let yield_amount = t.client.accrue_yield();
        // Total principal in Blend: 63750 (75k*85%) + 21250 (25k*85%) = 85000
        // Yield = 85000 * 10% = 8500
        assert_eq!(yield_amount, 8_500);

        // User share = 20% of 8500 = 1700
        // Alice gets 75% of 1700 = 1275
        // Bob gets 25% of 1700 = 425
        let alice_yield = t.client.get_user_yield(&alice);
        let bob_yield = t.client.get_user_yield(&bob);
        assert_eq!(alice_yield, 1_275);
        assert_eq!(bob_yield, 425);
    }

    #[test]
    fn test_no_yield_when_b_rate_unchanged() {
        let t = setup();
        let user = Address::generate(&t.env);
        mint_usdc(&t.env, &t.usdc_id, &user, 100_000);

        t.client.deposit(&user, &10_000);

        // b_rate stays at 1.0 → no yield
        let yield_amount = t.client.accrue_yield();
        assert_eq!(yield_amount, 0);
    }

    #[test]
    fn test_multiple_accruals() {
        let t = setup();
        let user = Address::generate(&t.env);
        mint_usdc(&t.env, &t.usdc_id, &user, 100_000);

        t.client.deposit(&user, &10_000);

        let mock = MockBlendPoolClient::new(&t.env, &t.pool_id);

        // First accrual: 5% yield (b_rate goes from 1.0 to 1.05)
        mock.set_b_rate(&1_050_000_000);
        let y1 = t.client.accrue_yield();
        assert_eq!(y1, 425); // 8500 * 5%

        // Second accrual: compound 5% more (b_rate = 1.05 * 1.05 = 1.1025)
        // After re-deposit at 1.05, bTokens = 8500 * 1e9 / 1.05e9 ≈ 8095
        // At 1.1025: underlying = 8095 * 1.1025 ≈ 8924, yield ≈ 424
        mock.set_b_rate(&1_102_500_000);
        let y2 = t.client.accrue_yield();
        assert!(y2 >= 423 && y2 <= 425, "second accrual yield ~424, got {}", y2);

        let total = t.client.get_total_yield();
        assert!(total >= 848 && total <= 850, "total yield ~849, got {}", total);
    }

    // ============================================================
    // REBALANCE TEST
    // ============================================================

    #[test]
    fn test_rebalance_pushes_excess_to_blend() {
        let t = setup();
        let user = Address::generate(&t.env);
        mint_usdc(&t.env, &t.usdc_id, &user, 100_000);

        t.client.deposit(&user, &10_000);
        // Buffer = 1500, target = 15% of 10000 = 1500 → already balanced

        t.client.rebalance(&t.admin);

        // Nothing should change since it's already balanced
        assert_eq!(t.client.get_balance(), 1_500);

        // Now simulate excess buffer: mint extra USDC directly to vault
        let vault_addr = t.client.address.clone();
        let sac = StellarAssetClient::new(&t.env, &t.usdc_id);
        sac.mint(&vault_addr, &3_500); // vault now has 1500 + 3500 = 5000 buffer

        // Rebalance should push excess (5000 - 1500 = 3500) to Blend
        t.client.rebalance(&t.admin);
        assert_eq!(t.client.get_balance(), 1_500);

        // Blend principal should have increased by 3500
        let (principal, _) = t.client.get_blend_position();
        assert_eq!(principal, 8_500 + 3_500); // 12000
    }

    // ============================================================
    // EDGE CASES
    // ============================================================

    #[test]
    fn test_deposit_zero_fails() {
        let t = setup();
        let user = Address::generate(&t.env);
        let result = t.client.try_deposit(&user, &0);
        assert!(result.is_err());
    }

    #[test]
    fn test_claim_with_no_yield_fails() {
        let t = setup();
        let user = Address::generate(&t.env);
        mint_usdc(&t.env, &t.usdc_id, &user, 100_000);

        t.client.deposit(&user, &10_000);
        let result = t.client.try_claim_yield(&user);
        assert!(result.is_err());
    }

    #[test]
    fn test_double_init_fails() {
        let t = setup();
        let other = Address::generate(&t.env);
        let result = t.client.try_initialize(
            &other,
            &Address::generate(&t.env),
            &Address::generate(&t.env),
            &Address::generate(&t.env),
            &Address::generate(&t.env),
            &1500, &7000, &2000, &1000,
        );
        assert!(result.is_err());
    }

    #[test]
    fn test_accrue_with_no_deposits_returns_zero() {
        let t = setup();
        let yield_amount = t.client.accrue_yield();
        assert_eq!(yield_amount, 0);
    }
}
