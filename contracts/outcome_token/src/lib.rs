#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, symbol_short};

// ============================================================
// STORAGE KEYS
// ============================================================

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    // (market_id, outcome, user) → balance
    Balance(u64, u32, Address),
    // (market_id, outcome) → total supply
    Supply(u64, u32),
    // Authorized minter address → bool
    Minter(Address),
}

const BUMP_AMOUNT: u32 = 518_400; // ~60 days
const LIFETIME_THRESHOLD: u32 = 129_600; // ~15 days

// ============================================================
// CONTRACT
// ============================================================

#[contract]
pub struct OutcomeToken;

#[contractimpl]
impl OutcomeToken {
    /// Initialize the contract with an admin address.
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
    }

    /// Register a contract address as an authorized minter (e.g. market_factory).
    pub fn add_minter(env: Env, admin: Address, minter: Address) {
        admin.require_auth();
        Self::require_admin(&env, &admin);
        env.storage().persistent().set(&DataKey::Minter(minter.clone()), &true);
        env.storage().persistent().extend_ttl(
            &DataKey::Minter(minter),
            LIFETIME_THRESHOLD,
            BUMP_AMOUNT,
        );
    }

    /// Remove a minter.
    pub fn remove_minter(env: Env, admin: Address, minter: Address) {
        admin.require_auth();
        Self::require_admin(&env, &admin);
        env.storage().persistent().remove(&DataKey::Minter(minter));
    }

    /// Mint outcome tokens. Only callable by authorized minters.
    pub fn mint(
        env: Env,
        minter: Address,
        market_id: u64,
        outcome: u32,
        to: Address,
        amount: i128,
    ) {
        minter.require_auth();
        Self::require_minter(&env, &minter);
        assert!(amount > 0, "amount must be positive");

        let bal_key = DataKey::Balance(market_id, outcome, to.clone());
        let sup_key = DataKey::Supply(market_id, outcome);

        let balance: i128 = env.storage().persistent().get(&bal_key).unwrap_or(0);
        let supply: i128 = env.storage().persistent().get(&sup_key).unwrap_or(0);

        env.storage().persistent().set(&bal_key, &(balance + amount));
        env.storage().persistent().set(&sup_key, &(supply + amount));

        Self::bump_persistent(&env, &bal_key);
        Self::bump_persistent(&env, &sup_key);

        env.events().publish(
            (symbol_short!("mint"), market_id, outcome),
            (to, amount),
        );
    }

    /// Burn outcome tokens. Only callable by authorized minters.
    pub fn burn(
        env: Env,
        minter: Address,
        market_id: u64,
        outcome: u32,
        from: Address,
        amount: i128,
    ) {
        minter.require_auth();
        Self::require_minter(&env, &minter);
        assert!(amount > 0, "amount must be positive");

        let bal_key = DataKey::Balance(market_id, outcome, from.clone());
        let sup_key = DataKey::Supply(market_id, outcome);

        let balance: i128 = env.storage().persistent().get(&bal_key).unwrap_or(0);
        assert!(balance >= amount, "insufficient balance to burn");

        let supply: i128 = env.storage().persistent().get(&sup_key).unwrap_or(0);

        env.storage().persistent().set(&bal_key, &(balance - amount));
        env.storage().persistent().set(&sup_key, &(supply - amount));

        Self::bump_persistent(&env, &bal_key);
        Self::bump_persistent(&env, &sup_key);

        env.events().publish(
            (symbol_short!("burn"), market_id, outcome),
            (from, amount),
        );
    }

    /// Transfer outcome tokens between users. Requires auth from `from`.
    pub fn transfer(
        env: Env,
        market_id: u64,
        outcome: u32,
        from: Address,
        to: Address,
        amount: i128,
    ) {
        from.require_auth();
        assert!(amount > 0, "amount must be positive");

        let from_key = DataKey::Balance(market_id, outcome, from.clone());
        let to_key = DataKey::Balance(market_id, outcome, to.clone());

        let from_bal: i128 = env.storage().persistent().get(&from_key).unwrap_or(0);
        assert!(from_bal >= amount, "insufficient balance to transfer");

        let to_bal: i128 = env.storage().persistent().get(&to_key).unwrap_or(0);

        env.storage().persistent().set(&from_key, &(from_bal - amount));
        env.storage().persistent().set(&to_key, &(to_bal + amount));

        Self::bump_persistent(&env, &from_key);
        Self::bump_persistent(&env, &to_key);

        env.events().publish(
            (symbol_short!("xfer"), market_id, outcome),
            (from, to, amount),
        );
    }

    /// Query balance of a user for a specific (market, outcome).
    pub fn balance(env: Env, market_id: u64, outcome: u32, user: Address) -> i128 {
        let key = DataKey::Balance(market_id, outcome, user);
        env.storage().persistent().get(&key).unwrap_or(0)
    }

    /// Query total supply of a specific (market, outcome).
    pub fn total_supply(env: Env, market_id: u64, outcome: u32) -> i128 {
        let key = DataKey::Supply(market_id, outcome);
        env.storage().persistent().get(&key).unwrap_or(0)
    }

    /// Check if an address is an authorized minter.
    pub fn is_minter(env: Env, addr: Address) -> bool {
        env.storage()
            .persistent()
            .get(&DataKey::Minter(addr))
            .unwrap_or(false)
    }

    // ============================================================
    // INTERNAL HELPERS
    // ============================================================

    fn require_admin(env: &Env, addr: &Address) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        assert!(*addr == admin, "not admin");
    }

    fn require_minter(env: &Env, addr: &Address) {
        let is_minter: bool = env
            .storage()
            .persistent()
            .get(&DataKey::Minter(addr.clone()))
            .unwrap_or(false);
        assert!(is_minter, "not authorized minter");
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
    use soroban_sdk::testutils::Address as _;
    use soroban_sdk::Env;

    fn setup() -> (Env, Address, OutcomeTokenClient<'static>) {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register(OutcomeToken, ());
        let client = OutcomeTokenClient::new(&env, &contract_id);
        let admin = Address::generate(&env);
        client.initialize(&admin);
        (env, admin, client)
    }

    #[test]
    fn test_mint_and_balance() {
        let (env, admin, client) = setup();
        let minter = Address::generate(&env);
        let user = Address::generate(&env);

        client.add_minter(&admin, &minter);
        client.mint(&minter, &1, &0, &user, &1000);

        assert_eq!(client.balance(&1, &0, &user), 1000);
        assert_eq!(client.total_supply(&1, &0), 1000);
    }

    #[test]
    fn test_burn_reduces_balance() {
        let (env, admin, client) = setup();
        let minter = Address::generate(&env);
        let user = Address::generate(&env);

        client.add_minter(&admin, &minter);
        client.mint(&minter, &1, &0, &user, &1000);
        client.burn(&minter, &1, &0, &user, &400);

        assert_eq!(client.balance(&1, &0, &user), 600);
        assert_eq!(client.total_supply(&1, &0), 600);
    }

    #[test]
    fn test_transfer_between_users() {
        let (env, admin, client) = setup();
        let minter = Address::generate(&env);
        let alice = Address::generate(&env);
        let bob = Address::generate(&env);

        client.add_minter(&admin, &minter);
        client.mint(&minter, &1, &0, &alice, &1000);
        client.transfer(&1, &0, &alice, &bob, &300);

        assert_eq!(client.balance(&1, &0, &alice), 700);
        assert_eq!(client.balance(&1, &0, &bob), 300);
        // total supply unchanged
        assert_eq!(client.total_supply(&1, &0), 1000);
    }

    #[test]
    #[should_panic(expected = "not authorized minter")]
    fn test_mint_by_non_minter_fails() {
        let (env, _admin, client) = setup();
        let fake = Address::generate(&env);
        let user = Address::generate(&env);
        client.mint(&fake, &1, &0, &user, &100);
    }

    #[test]
    #[should_panic(expected = "insufficient balance to burn")]
    fn test_burn_more_than_balance_fails() {
        let (env, admin, client) = setup();
        let minter = Address::generate(&env);
        let user = Address::generate(&env);

        client.add_minter(&admin, &minter);
        client.mint(&minter, &1, &0, &user, &100);
        client.burn(&minter, &1, &0, &user, &200);
    }

    #[test]
    #[should_panic(expected = "insufficient balance to transfer")]
    fn test_transfer_more_than_balance_fails() {
        let (env, admin, client) = setup();
        let minter = Address::generate(&env);
        let alice = Address::generate(&env);
        let bob = Address::generate(&env);

        client.add_minter(&admin, &minter);
        client.mint(&minter, &1, &0, &alice, &100);
        client.transfer(&1, &0, &alice, &bob, &200);
    }

    #[test]
    fn test_multiple_markets_independent() {
        let (env, admin, client) = setup();
        let minter = Address::generate(&env);
        let user = Address::generate(&env);

        client.add_minter(&admin, &minter);
        // Market 1, outcome YES(0)
        client.mint(&minter, &1, &0, &user, &500);
        // Market 2, outcome YES(0)
        client.mint(&minter, &2, &0, &user, &300);
        // Market 1, outcome NO(1)
        client.mint(&minter, &1, &1, &user, &200);

        assert_eq!(client.balance(&1, &0, &user), 500);
        assert_eq!(client.balance(&2, &0, &user), 300);
        assert_eq!(client.balance(&1, &1, &user), 200);
        assert_eq!(client.total_supply(&1, &0), 500);
        assert_eq!(client.total_supply(&2, &0), 300);
    }

    #[test]
    fn test_remove_minter() {
        let (env, admin, client) = setup();
        let minter = Address::generate(&env);

        client.add_minter(&admin, &minter);
        assert!(client.is_minter(&minter));

        client.remove_minter(&admin, &minter);
        assert!(!client.is_minter(&minter));
    }

    #[test]
    #[should_panic(expected = "already initialized")]
    fn test_double_initialize_fails() {
        let (env, admin, client) = setup();
        let other = Address::generate(&env);
        client.initialize(&other);
    }
}
