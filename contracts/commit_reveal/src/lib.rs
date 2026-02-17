#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, contracterror,
    Address, BytesN, Env, symbol_short, token,
};

// ============================================================
// TYPES
// ============================================================

#[contracttype]
#[derive(Clone, Debug)]
pub struct Commitment {
    pub user: Address,
    pub hash: BytesN<32>,
    pub usdc_locked: i128,
    pub committed_at: u64,
    pub revealed: bool,
}

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    UsdcToken,
    LmsrAmm,
    RevealDeadlineOffset,
    // Per-commitment: (market_id, user) → Commitment
    Commit(u64, Address),
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum Error {
    AlreadyInitialized = 1,
    NotAdmin = 2,
    InvalidAmount = 3,
    CommitmentExists = 4,
    NoCommitment = 5,
    AlreadyRevealed = 6,
    HashMismatch = 7,
    RevealDeadlineExpired = 8,
    RevealTooEarly = 9,
    AmountExceedsLocked = 10,
}

const BUMP_AMOUNT: u32 = 518_400;
const LIFETIME_THRESHOLD: u32 = 129_600;

// ============================================================
// CONTRACT
// ============================================================

#[contract]
pub struct CommitReveal;

#[contractimpl]
impl CommitReveal {
    pub fn initialize(
        env: Env,
        admin: Address,
        usdc_token: Address,
        lmsr_amm: Address,
        reveal_deadline_offset: u64,
    ) -> Result<(), Error> {
        if env.storage().instance().has(&DataKey::Admin) {
            return Err(Error::AlreadyInitialized);
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::UsdcToken, &usdc_token);
        env.storage().instance().set(&DataKey::LmsrAmm, &lmsr_amm);
        env.storage().instance().set(&DataKey::RevealDeadlineOffset, &reveal_deadline_offset);
        Ok(())
    }

    /// Phase 1: Commit a hashed bet.
    /// hash = SHA256(market_id || outcome || amount || salt)
    /// Transfers usdc_amount from user to this contract as locked collateral.
    pub fn commit(
        env: Env,
        user: Address,
        market_id: u64,
        commitment_hash: BytesN<32>,
        usdc_amount: i128,
    ) -> Result<(), Error> {
        user.require_auth();
        if usdc_amount <= 0 {
            return Err(Error::InvalidAmount);
        }

        let key = DataKey::Commit(market_id, user.clone());
        if env.storage().persistent().has(&key) {
            return Err(Error::CommitmentExists);
        }

        // Transfer USDC from user to contract
        let usdc = Self::usdc_client(&env);
        usdc.transfer(&user, &env.current_contract_address(), &usdc_amount);

        let commitment = Commitment {
            user: user.clone(),
            hash: commitment_hash,
            usdc_locked: usdc_amount,
            committed_at: env.ledger().timestamp(),
            revealed: false,
        };

        env.storage().persistent().set(&key, &commitment);
        Self::bump_key(&env, &key);

        env.events().publish(
            (symbol_short!("commit"), market_id),
            (user, usdc_amount),
        );
        Ok(())
    }

    /// Phase 2: Reveal the bet.
    /// Verifies hash matches, marks revealed, and returns locked USDC to user.
    /// The user then executes the trade via LMSR AMM in a separate call.
    pub fn reveal(
        env: Env,
        user: Address,
        market_id: u64,
        outcome: u32,
        amount: i128,
        salt: BytesN<32>,
    ) -> Result<i128, Error> {
        user.require_auth();

        let key = DataKey::Commit(market_id, user.clone());
        let mut commitment: Commitment = env.storage()
            .persistent()
            .get(&key)
            .ok_or(Error::NoCommitment)?;

        if commitment.revealed {
            return Err(Error::AlreadyRevealed);
        }

        if amount > commitment.usdc_locked {
            return Err(Error::AmountExceedsLocked);
        }

        // Check reveal deadline
        let offset: u64 = env.storage().instance().get(&DataKey::RevealDeadlineOffset).unwrap();
        let now = env.ledger().timestamp();
        if now > commitment.committed_at + offset {
            return Err(Error::RevealDeadlineExpired);
        }

        // Reconstruct hash: SHA256(market_id || outcome || amount || salt)
        let mut data = soroban_sdk::Bytes::new(&env);
        data.extend_from_array(&market_id.to_be_bytes());
        data.extend_from_array(&outcome.to_be_bytes());
        data.extend_from_array(&amount.to_be_bytes());
        data.extend_from_slice(&salt.to_array());

        let computed_hash = env.crypto().sha256(&data);
        let computed_bytes: BytesN<32> = computed_hash.into();

        if computed_bytes != commitment.hash {
            return Err(Error::HashMismatch);
        }

        commitment.revealed = true;
        env.storage().persistent().set(&key, &commitment);
        Self::bump_key(&env, &key);

        // Return all locked USDC to user.
        // User then calls lmsr_amm.buy() separately with the revealed params.
        let usdc = Self::usdc_client(&env);
        let contract_addr = env.current_contract_address();
        usdc.transfer(&contract_addr, &user, &commitment.usdc_locked);

        let usdc_change = commitment.usdc_locked - amount;

        env.events().publish(
            (symbol_short!("reveal"), market_id),
            (user, outcome, amount, usdc_change),
        );
        Ok(usdc_change)
    }

    /// Reclaim locked USDC if reveal deadline passed without reveal.
    /// Transfers locked USDC back to user.
    pub fn reclaim(
        env: Env,
        user: Address,
        market_id: u64,
    ) -> Result<i128, Error> {
        user.require_auth();

        let key = DataKey::Commit(market_id, user.clone());
        let commitment: Commitment = env.storage()
            .persistent()
            .get(&key)
            .ok_or(Error::NoCommitment)?;

        if commitment.revealed {
            return Err(Error::AlreadyRevealed);
        }

        let offset: u64 = env.storage().instance().get(&DataKey::RevealDeadlineOffset).unwrap();
        let now = env.ledger().timestamp();
        if now <= commitment.committed_at + offset {
            return Err(Error::RevealTooEarly);
        }

        let refund = commitment.usdc_locked;

        // Transfer USDC back to user
        let usdc = Self::usdc_client(&env);
        usdc.transfer(&env.current_contract_address(), &user, &refund);

        // Remove commitment
        env.storage().persistent().remove(&key);

        env.events().publish(
            (symbol_short!("reclaim"), market_id),
            (user, refund),
        );
        Ok(refund)
    }

    /// Get commitment details.
    pub fn get_commitment(env: Env, market_id: u64, user: Address) -> Result<Commitment, Error> {
        let key = DataKey::Commit(market_id, user);
        env.storage()
            .persistent()
            .get(&key)
            .ok_or(Error::NoCommitment)
    }

    // ============================================================
    // INTERNAL
    // ============================================================

    fn usdc_client(env: &Env) -> token::Client<'_> {
        let addr: Address = env.storage().instance().get(&DataKey::UsdcToken).unwrap();
        token::Client::new(env, &addr)
    }

    fn bump_key(env: &Env, key: &DataKey) {
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
    use soroban_sdk::testutils::{Address as _, Ledger};
    use soroban_sdk::token::{Client as TokenClient, StellarAssetClient};
    use soroban_sdk::Env;

    struct TestSetup {
        env: Env,
        usdc_id: Address,
        client: CommitRevealClient<'static>,
    }

    fn setup() -> TestSetup {
        let env = Env::default();
        env.mock_all_auths();

        // Create USDC SAC token
        let token_admin = Address::generate(&env);
        let usdc_id = env.register_stellar_asset_contract_v2(token_admin.clone()).address();

        let contract_id = env.register(CommitReveal, ());
        let client = CommitRevealClient::new(&env, &contract_id);
        let admin = Address::generate(&env);
        let amm = Address::generate(&env);

        // 1 hour reveal deadline
        client.initialize(&admin, &usdc_id, &amm, &3600);
        TestSetup { env, usdc_id, client }
    }

    fn mint_usdc(env: &Env, usdc_id: &Address, to: &Address, amount: i128) {
        let sac = StellarAssetClient::new(env, usdc_id);
        sac.mint(to, &amount);
    }

    fn make_hash(env: &Env, market_id: u64, outcome: u32, amount: i128, salt: &BytesN<32>) -> BytesN<32> {
        let mut data = soroban_sdk::Bytes::new(env);
        data.extend_from_array(&market_id.to_be_bytes());
        data.extend_from_array(&outcome.to_be_bytes());
        data.extend_from_array(&amount.to_be_bytes());
        data.extend_from_slice(&salt.to_array());
        env.crypto().sha256(&data).into()
    }

    #[test]
    fn test_commit_and_reveal() {
        let t = setup();
        let user = Address::generate(&t.env);
        mint_usdc(&t.env, &t.usdc_id, &user, 10_000);

        let salt = BytesN::from_array(&t.env, &[1u8; 32]);
        let market_id: u64 = 1;
        let outcome: u32 = 0;
        let amount: i128 = 500;
        let locked: i128 = 1000;

        let hash = make_hash(&t.env, market_id, outcome, amount, &salt);

        t.env.ledger().with_mut(|li| li.timestamp = 1000);
        t.client.commit(&user, &market_id, &hash, &locked);

        // Verify USDC transferred to contract
        let usdc = TokenClient::new(&t.env, &t.usdc_id);
        assert_eq!(usdc.balance(&user), 9_000); // 10000 - 1000
        assert_eq!(usdc.balance(&t.client.address), 1_000);

        let commitment = t.client.get_commitment(&market_id, &user);
        assert_eq!(commitment.usdc_locked, 1000);
        assert!(!commitment.revealed);

        // Reveal within deadline
        t.env.ledger().with_mut(|li| li.timestamp = 2000);
        let change = t.client.reveal(&user, &market_id, &outcome, &amount, &salt);
        assert_eq!(change, 500); // 1000 locked - 500 used = 500 change

        // USDC returned to user
        assert_eq!(usdc.balance(&user), 10_000); // all returned
        assert_eq!(usdc.balance(&t.client.address), 0);

        let commitment = t.client.get_commitment(&market_id, &user);
        assert!(commitment.revealed);
    }

    #[test]
    fn test_wrong_hash_fails() {
        let t = setup();
        let user = Address::generate(&t.env);
        mint_usdc(&t.env, &t.usdc_id, &user, 10_000);

        let salt = BytesN::from_array(&t.env, &[1u8; 32]);
        let wrong_salt = BytesN::from_array(&t.env, &[2u8; 32]);

        let hash = make_hash(&t.env, 1, 0, 500, &salt);

        t.env.ledger().with_mut(|li| li.timestamp = 1000);
        t.client.commit(&user, &1, &hash, &1000);

        t.env.ledger().with_mut(|li| li.timestamp = 2000);
        let result = t.client.try_reveal(&user, &1, &0, &500, &wrong_salt);
        assert!(result.is_err());

        // USDC still locked in contract
        let usdc = TokenClient::new(&t.env, &t.usdc_id);
        assert_eq!(usdc.balance(&t.client.address), 1_000);
    }

    #[test]
    fn test_reveal_after_deadline_fails() {
        let t = setup();
        let user = Address::generate(&t.env);
        mint_usdc(&t.env, &t.usdc_id, &user, 10_000);

        let salt = BytesN::from_array(&t.env, &[1u8; 32]);
        let hash = make_hash(&t.env, 1, 0, 500, &salt);

        t.env.ledger().with_mut(|li| li.timestamp = 1000);
        t.client.commit(&user, &1, &hash, &1000);

        // Try reveal after deadline (1000 + 3600 + 1)
        t.env.ledger().with_mut(|li| li.timestamp = 4601);
        let result = t.client.try_reveal(&user, &1, &0, &500, &salt);
        assert!(result.is_err());
    }

    #[test]
    fn test_reclaim_after_deadline() {
        let t = setup();
        let user = Address::generate(&t.env);
        mint_usdc(&t.env, &t.usdc_id, &user, 10_000);

        let salt = BytesN::from_array(&t.env, &[1u8; 32]);
        let hash = make_hash(&t.env, 1, 0, 500, &salt);

        t.env.ledger().with_mut(|li| li.timestamp = 1000);
        t.client.commit(&user, &1, &hash, &1000);

        let usdc = TokenClient::new(&t.env, &t.usdc_id);
        assert_eq!(usdc.balance(&user), 9_000);

        // Reclaim after deadline
        t.env.ledger().with_mut(|li| li.timestamp = 4601);
        let refund = t.client.reclaim(&user, &1);
        assert_eq!(refund, 1000);

        // USDC returned
        assert_eq!(usdc.balance(&user), 10_000);
        assert_eq!(usdc.balance(&t.client.address), 0);

        // Commitment removed
        let result = t.client.try_get_commitment(&1, &user);
        assert!(result.is_err());
    }

    #[test]
    fn test_reclaim_before_deadline_fails() {
        let t = setup();
        let user = Address::generate(&t.env);
        mint_usdc(&t.env, &t.usdc_id, &user, 10_000);

        let salt = BytesN::from_array(&t.env, &[1u8; 32]);
        let hash = make_hash(&t.env, 1, 0, 500, &salt);

        t.env.ledger().with_mut(|li| li.timestamp = 1000);
        t.client.commit(&user, &1, &hash, &1000);

        // Try reclaim before deadline
        t.env.ledger().with_mut(|li| li.timestamp = 2000);
        let result = t.client.try_reclaim(&user, &1);
        assert!(result.is_err());
    }

    #[test]
    fn test_double_commit_fails() {
        let t = setup();
        let user = Address::generate(&t.env);
        mint_usdc(&t.env, &t.usdc_id, &user, 10_000);

        let hash = BytesN::from_array(&t.env, &[1u8; 32]);

        t.client.commit(&user, &1, &hash, &1000);
        let result = t.client.try_commit(&user, &1, &hash, &500);
        assert!(result.is_err());
    }

    #[test]
    fn test_double_reveal_fails() {
        let t = setup();
        let user = Address::generate(&t.env);
        mint_usdc(&t.env, &t.usdc_id, &user, 10_000);

        let salt = BytesN::from_array(&t.env, &[1u8; 32]);
        let hash = make_hash(&t.env, 1, 0, 500, &salt);

        t.env.ledger().with_mut(|li| li.timestamp = 1000);
        t.client.commit(&user, &1, &hash, &1000);

        t.env.ledger().with_mut(|li| li.timestamp = 2000);
        t.client.reveal(&user, &1, &0, &500, &salt);

        // Second reveal fails
        let result = t.client.try_reveal(&user, &1, &0, &500, &salt);
        assert!(result.is_err());
    }

    #[test]
    fn test_amount_exceeds_locked_fails() {
        let t = setup();
        let user = Address::generate(&t.env);
        mint_usdc(&t.env, &t.usdc_id, &user, 10_000);

        let salt = BytesN::from_array(&t.env, &[1u8; 32]);
        let hash = make_hash(&t.env, 1, 0, 2000, &salt);

        t.env.ledger().with_mut(|li| li.timestamp = 1000);
        t.client.commit(&user, &1, &hash, &1000);

        t.env.ledger().with_mut(|li| li.timestamp = 2000);
        // Try reveal with amount > locked
        let result = t.client.try_reveal(&user, &1, &0, &2000, &salt);
        assert!(result.is_err());
    }

    #[test]
    fn test_commit_insufficient_usdc_fails() {
        let t = setup();
        let user = Address::generate(&t.env);
        mint_usdc(&t.env, &t.usdc_id, &user, 500);

        let hash = BytesN::from_array(&t.env, &[1u8; 32]);

        // Try to commit 1000 with only 500 USDC
        let result = t.client.try_commit(&user, &1, &hash, &1000);
        assert!(result.is_err());
    }
}
