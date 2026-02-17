#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, contracterror,
    Address, Env, symbol_short, token,
};

// ============================================================
// TYPES
// ============================================================

#[contracttype]
#[derive(Clone, Debug)]
pub struct Submission {
    pub market_id: u64,
    pub outcome: u32,
    pub submitted_by: Address,
    pub submitted_at: u64,
    pub dispute_deadline: u64,
    pub disputed: bool,
    pub finalized: bool,
}

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    UsdcToken,
    Treasury,
    MarketFactory,
    DisputePeriod,
    DisputeBond,
    // Authorized oracle addresses
    Oracle(Address),
    // Per-market submission
    Submission(u64),
    // Dispute bond held (market_id) → (disputer, amount)
    DisputeDeposit(u64),
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum Error {
    AlreadyInitialized = 1,
    NotAdmin = 2,
    NotOracle = 3,
    MarketNotFound = 4,
    SubmissionExists = 5,
    NoSubmission = 6,
    DisputePeriodActive = 7,
    DisputePeriodExpired = 8,
    AlreadyDisputed = 9,
    AlreadyFinalized = 10,
    NotDisputed = 11,
    InvalidBond = 12,
}

const BUMP_AMOUNT: u32 = 518_400;
const LIFETIME_THRESHOLD: u32 = 129_600;

// ============================================================
// CONTRACT
// ============================================================

#[contract]
pub struct Oracle;

#[contractimpl]
impl Oracle {
    pub fn initialize(
        env: Env,
        admin: Address,
        usdc_token: Address,
        treasury: Address,
        market_factory: Address,
        dispute_period: u64,
        dispute_bond: i128,
    ) -> Result<(), Error> {
        if env.storage().instance().has(&DataKey::Admin) {
            return Err(Error::AlreadyInitialized);
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::UsdcToken, &usdc_token);
        env.storage().instance().set(&DataKey::Treasury, &treasury);
        env.storage().instance().set(&DataKey::MarketFactory, &market_factory);
        env.storage().instance().set(&DataKey::DisputePeriod, &dispute_period);
        env.storage().instance().set(&DataKey::DisputeBond, &dispute_bond);
        Ok(())
    }

    /// Add an authorized oracle.
    pub fn add_oracle(env: Env, admin: Address, oracle: Address) -> Result<(), Error> {
        admin.require_auth();
        Self::require_admin(&env, &admin)?;
        env.storage().persistent().set(&DataKey::Oracle(oracle.clone()), &true);
        Self::bump_key(&env, &DataKey::Oracle(oracle));
        Ok(())
    }

    /// Remove an oracle.
    pub fn remove_oracle(env: Env, admin: Address, oracle: Address) -> Result<(), Error> {
        admin.require_auth();
        Self::require_admin(&env, &admin)?;
        env.storage().persistent().remove(&DataKey::Oracle(oracle));
        Ok(())
    }

    /// Check if an address is an authorized oracle.
    pub fn is_oracle(env: Env, addr: Address) -> bool {
        env.storage()
            .persistent()
            .get(&DataKey::Oracle(addr))
            .unwrap_or(false)
    }

    /// Submit a result for a market. Only authorized oracles.
    pub fn submit_result(
        env: Env,
        oracle: Address,
        market_id: u64,
        outcome: u32,
    ) -> Result<(), Error> {
        oracle.require_auth();
        Self::require_oracle(&env, &oracle)?;

        // Check no existing submission for this market
        if env.storage().persistent().has(&DataKey::Submission(market_id)) {
            return Err(Error::SubmissionExists);
        }

        let now = env.ledger().timestamp();
        let dispute_period: u64 = env.storage().instance().get(&DataKey::DisputePeriod).unwrap();

        let submission = Submission {
            market_id,
            outcome,
            submitted_by: oracle.clone(),
            submitted_at: now,
            dispute_deadline: now + dispute_period,
            disputed: false,
            finalized: false,
        };

        env.storage().persistent().set(&DataKey::Submission(market_id), &submission);
        Self::bump_key(&env, &DataKey::Submission(market_id));

        env.events().publish(
            (symbol_short!("submit"), market_id),
            (oracle, outcome),
        );
        Ok(())
    }

    /// Dispute a submitted result. Transfers dispute bond USDC from disputer to contract.
    pub fn dispute(
        env: Env,
        disputer: Address,
        market_id: u64,
    ) -> Result<(), Error> {
        disputer.require_auth();

        let mut submission: Submission = env.storage()
            .persistent()
            .get(&DataKey::Submission(market_id))
            .ok_or(Error::NoSubmission)?;

        if submission.finalized {
            return Err(Error::AlreadyFinalized);
        }
        if submission.disputed {
            return Err(Error::AlreadyDisputed);
        }

        let now = env.ledger().timestamp();
        if now > submission.dispute_deadline {
            return Err(Error::DisputePeriodExpired);
        }

        let bond: i128 = env.storage().instance().get(&DataKey::DisputeBond).unwrap();

        // Transfer dispute bond USDC from disputer to contract
        let usdc = Self::usdc_client(&env);
        usdc.transfer(&disputer, &env.current_contract_address(), &bond);

        // Record the dispute deposit
        env.storage().persistent().set(
            &DataKey::DisputeDeposit(market_id),
            &(disputer.clone(), bond),
        );
        Self::bump_key(&env, &DataKey::DisputeDeposit(market_id));

        submission.disputed = true;
        env.storage().persistent().set(&DataKey::Submission(market_id), &submission);
        Self::bump_key(&env, &DataKey::Submission(market_id));

        env.events().publish(
            (symbol_short!("dispute"), market_id),
            (disputer, bond),
        );
        Ok(())
    }

    /// Resolve a dispute. Only admin.
    /// If disputer_wins: bond returned to disputer, final_outcome used.
    /// If oracle was correct: bond sent to treasury.
    pub fn resolve_dispute(
        env: Env,
        admin: Address,
        market_id: u64,
        final_outcome: u32,
        disputer_wins: bool,
    ) -> Result<(), Error> {
        admin.require_auth();
        Self::require_admin(&env, &admin)?;

        let mut submission: Submission = env.storage()
            .persistent()
            .get(&DataKey::Submission(market_id))
            .ok_or(Error::NoSubmission)?;

        if !submission.disputed {
            return Err(Error::NotDisputed);
        }
        if submission.finalized {
            return Err(Error::AlreadyFinalized);
        }

        // Transfer bond based on outcome
        let deposit: (Address, i128) = env.storage()
            .persistent()
            .get(&DataKey::DisputeDeposit(market_id))
            .ok_or(Error::NotDisputed)?;
        let (disputer, bond) = deposit;

        let usdc = Self::usdc_client(&env);
        let contract_addr = env.current_contract_address();

        if disputer_wins {
            // Return bond to disputer
            usdc.transfer(&contract_addr, &disputer, &bond);
        } else {
            // Send bond to treasury
            let treasury: Address = env.storage().instance().get(&DataKey::Treasury).unwrap();
            usdc.transfer(&contract_addr, &treasury, &bond);
        }

        // Clean up deposit record
        env.storage().persistent().remove(&DataKey::DisputeDeposit(market_id));

        submission.outcome = final_outcome;
        submission.finalized = true;
        env.storage().persistent().set(&DataKey::Submission(market_id), &submission);
        Self::bump_key(&env, &DataKey::Submission(market_id));

        env.events().publish(
            (symbol_short!("resolved"), market_id),
            (final_outcome, disputer_wins),
        );
        Ok(())
    }

    /// Finalize a non-disputed submission after dispute period.
    pub fn finalize(env: Env, market_id: u64) -> Result<u32, Error> {
        let mut submission: Submission = env.storage()
            .persistent()
            .get(&DataKey::Submission(market_id))
            .ok_or(Error::NoSubmission)?;

        if submission.finalized {
            return Err(Error::AlreadyFinalized);
        }
        if submission.disputed {
            return Err(Error::AlreadyDisputed);
        }

        let now = env.ledger().timestamp();
        if now < submission.dispute_deadline {
            return Err(Error::DisputePeriodActive);
        }

        submission.finalized = true;
        env.storage().persistent().set(&DataKey::Submission(market_id), &submission);
        Self::bump_key(&env, &DataKey::Submission(market_id));

        env.events().publish(
            (symbol_short!("finalize"), market_id),
            submission.outcome,
        );
        Ok(submission.outcome)
    }

    /// Admin-only shortcut to resolve a market directly (hackathon mode).
    pub fn admin_resolve(
        env: Env,
        admin: Address,
        market_id: u64,
        outcome: u32,
    ) -> Result<(), Error> {
        admin.require_auth();
        Self::require_admin(&env, &admin)?;

        let submission = Submission {
            market_id,
            outcome,
            submitted_by: admin.clone(),
            submitted_at: env.ledger().timestamp(),
            dispute_deadline: 0,
            disputed: false,
            finalized: true,
        };

        env.storage().persistent().set(&DataKey::Submission(market_id), &submission);
        Self::bump_key(&env, &DataKey::Submission(market_id));

        env.events().publish(
            (symbol_short!("resolve"), market_id),
            (admin, outcome),
        );
        Ok(())
    }

    /// Get submission for a market.
    pub fn get_submission(env: Env, market_id: u64) -> Result<Submission, Error> {
        env.storage()
            .persistent()
            .get(&DataKey::Submission(market_id))
            .ok_or(Error::NoSubmission)
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

    fn require_oracle(env: &Env, addr: &Address) -> Result<(), Error> {
        let is_oracle: bool = env
            .storage()
            .persistent()
            .get(&DataKey::Oracle(addr.clone()))
            .unwrap_or(false);
        if !is_oracle {
            return Err(Error::NotOracle);
        }
        Ok(())
    }

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
        admin: Address,
        usdc_id: Address,
        treasury: Address,
        client: OracleClient<'static>,
    }

    fn setup() -> TestSetup {
        let env = Env::default();
        env.mock_all_auths();

        // Create USDC SAC token
        let token_admin = Address::generate(&env);
        let usdc_id = env.register_stellar_asset_contract_v2(token_admin.clone()).address();

        let contract_id = env.register(Oracle, ());
        let client = OracleClient::new(&env, &contract_id);
        let admin = Address::generate(&env);
        let treasury = Address::generate(&env);
        let factory = Address::generate(&env);

        // dispute_period = 7200s, dispute_bond = 1000 USDC
        client.initialize(&admin, &usdc_id, &treasury, &factory, &7200, &1000);
        TestSetup { env, admin, usdc_id, treasury, client }
    }

    fn mint_usdc(env: &Env, usdc_id: &Address, to: &Address, amount: i128) {
        let sac = StellarAssetClient::new(env, usdc_id);
        sac.mint(to, &amount);
    }

    #[test]
    fn test_add_and_check_oracle() {
        let t = setup();
        let oracle = Address::generate(&t.env);

        assert!(!t.client.is_oracle(&oracle));
        t.client.add_oracle(&t.admin, &oracle);
        assert!(t.client.is_oracle(&oracle));
    }

    #[test]
    fn test_remove_oracle() {
        let t = setup();
        let oracle = Address::generate(&t.env);

        t.client.add_oracle(&t.admin, &oracle);
        assert!(t.client.is_oracle(&oracle));

        t.client.remove_oracle(&t.admin, &oracle);
        assert!(!t.client.is_oracle(&oracle));
    }

    #[test]
    fn test_submit_result() {
        let t = setup();
        let oracle = Address::generate(&t.env);
        t.client.add_oracle(&t.admin, &oracle);

        t.client.submit_result(&oracle, &1, &0);

        let sub = t.client.get_submission(&1);
        assert_eq!(sub.market_id, 1);
        assert_eq!(sub.outcome, 0);
        assert!(!sub.disputed);
        assert!(!sub.finalized);
    }

    #[test]
    fn test_submit_by_non_oracle_fails() {
        let t = setup();
        let fake = Address::generate(&t.env);

        let result = t.client.try_submit_result(&fake, &1, &0);
        assert!(result.is_err());
    }

    #[test]
    fn test_finalize_after_dispute_period() {
        let t = setup();
        let oracle = Address::generate(&t.env);
        t.client.add_oracle(&t.admin, &oracle);

        // Submit at time 1000
        t.env.ledger().with_mut(|li| li.timestamp = 1000);
        t.client.submit_result(&oracle, &1, &0);

        // Try finalize before deadline → should fail
        t.env.ledger().with_mut(|li| li.timestamp = 2000);
        let result = t.client.try_finalize(&1);
        assert!(result.is_err());

        // Finalize after deadline (1000 + 7200 = 8200)
        t.env.ledger().with_mut(|li| li.timestamp = 8201);
        let outcome = t.client.finalize(&1);
        assert_eq!(outcome, 0);

        let sub = t.client.get_submission(&1);
        assert!(sub.finalized);
    }

    #[test]
    fn test_dispute_transfers_bond() {
        let t = setup();
        let oracle = Address::generate(&t.env);
        let disputer = Address::generate(&t.env);
        t.client.add_oracle(&t.admin, &oracle);
        mint_usdc(&t.env, &t.usdc_id, &disputer, 5_000);

        t.env.ledger().with_mut(|li| li.timestamp = 1000);
        t.client.submit_result(&oracle, &1, &0);

        // Dispute within period — transfers 1000 USDC bond
        t.env.ledger().with_mut(|li| li.timestamp = 2000);
        t.client.dispute(&disputer, &1);

        let usdc = TokenClient::new(&t.env, &t.usdc_id);
        assert_eq!(usdc.balance(&disputer), 4_000); // 5000 - 1000 bond
        assert_eq!(usdc.balance(&t.client.address), 1_000); // bond held

        let sub = t.client.get_submission(&1);
        assert!(sub.disputed);
    }

    #[test]
    fn test_dispute_after_deadline_fails() {
        let t = setup();
        let oracle = Address::generate(&t.env);
        let disputer = Address::generate(&t.env);
        t.client.add_oracle(&t.admin, &oracle);
        mint_usdc(&t.env, &t.usdc_id, &disputer, 5_000);

        t.env.ledger().with_mut(|li| li.timestamp = 1000);
        t.client.submit_result(&oracle, &1, &0);

        // Try dispute after deadline
        t.env.ledger().with_mut(|li| li.timestamp = 8201);
        let result = t.client.try_dispute(&disputer, &1);
        assert!(result.is_err());
    }

    #[test]
    fn test_resolve_dispute_disputer_wins() {
        let t = setup();
        let oracle = Address::generate(&t.env);
        let disputer = Address::generate(&t.env);
        t.client.add_oracle(&t.admin, &oracle);
        mint_usdc(&t.env, &t.usdc_id, &disputer, 5_000);

        t.env.ledger().with_mut(|li| li.timestamp = 1000);
        t.client.submit_result(&oracle, &1, &0);

        t.env.ledger().with_mut(|li| li.timestamp = 2000);
        t.client.dispute(&disputer, &1);

        // Admin resolves: disputer wins, outcome changed to 1
        t.client.resolve_dispute(&t.admin, &1, &1, &true);

        // Bond returned to disputer
        let usdc = TokenClient::new(&t.env, &t.usdc_id);
        assert_eq!(usdc.balance(&disputer), 5_000); // full amount back
        assert_eq!(usdc.balance(&t.client.address), 0);

        let sub = t.client.get_submission(&1);
        assert!(sub.finalized);
        assert_eq!(sub.outcome, 1);
    }

    #[test]
    fn test_resolve_dispute_oracle_wins() {
        let t = setup();
        let oracle = Address::generate(&t.env);
        let disputer = Address::generate(&t.env);
        t.client.add_oracle(&t.admin, &oracle);
        mint_usdc(&t.env, &t.usdc_id, &disputer, 5_000);

        t.env.ledger().with_mut(|li| li.timestamp = 1000);
        t.client.submit_result(&oracle, &1, &0);

        t.env.ledger().with_mut(|li| li.timestamp = 2000);
        t.client.dispute(&disputer, &1);

        // Admin resolves: oracle was correct, disputer loses bond
        t.client.resolve_dispute(&t.admin, &1, &0, &false);

        // Bond sent to treasury
        let usdc = TokenClient::new(&t.env, &t.usdc_id);
        assert_eq!(usdc.balance(&disputer), 4_000); // lost bond
        assert_eq!(usdc.balance(&t.treasury), 1_000); // treasury gets bond
        assert_eq!(usdc.balance(&t.client.address), 0);

        let sub = t.client.get_submission(&1);
        assert!(sub.finalized);
        assert_eq!(sub.outcome, 0); // original outcome preserved
    }

    #[test]
    fn test_admin_resolve_shortcut() {
        let t = setup();

        t.client.admin_resolve(&t.admin, &1, &0);

        let sub = t.client.get_submission(&1);
        assert!(sub.finalized);
        assert_eq!(sub.outcome, 0);
    }

    #[test]
    fn test_double_submission_fails() {
        let t = setup();
        let oracle = Address::generate(&t.env);
        t.client.add_oracle(&t.admin, &oracle);

        t.client.submit_result(&oracle, &1, &0);
        let result = t.client.try_submit_result(&oracle, &1, &1);
        assert!(result.is_err());
    }
}
