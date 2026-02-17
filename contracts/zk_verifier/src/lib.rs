#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, contracterror,
    Address, BytesN, Env, Vec, symbol_short,
};

// ============================================================
// TYPES — Groth16 BN254
// ============================================================

/// Groth16 verification key for BN254 curve.
/// All points in uncompressed big-endian Ethereum-compatible format.
#[contracttype]
#[derive(Clone, Debug)]
pub struct Groth16Vk {
    /// alpha in G1 (64 bytes: be(x) || be(y))
    pub alpha_g1: BytesN<64>,
    /// beta in G2 (128 bytes: be(x_c1) || be(x_c0) || be(y_c1) || be(y_c0))
    pub beta_g2: BytesN<128>,
    /// gamma in G2
    pub gamma_g2: BytesN<128>,
    /// delta in G2
    pub delta_g2: BytesN<128>,
    /// IC points in G1: IC[0], IC[1], ..., IC[n] where n = number of public inputs
    pub ic: Vec<BytesN<64>>,
}

/// Groth16 proof for BN254 curve.
#[contracttype]
#[derive(Clone, Debug)]
pub struct Groth16Proof {
    /// A in G1 (64 bytes)
    pub a: BytesN<64>,
    /// B in G2 (128 bytes)
    pub b: BytesN<128>,
    /// C in G1 (64 bytes)
    pub c: BytesN<64>,
}

/// Registered circuit with its verification key.
#[contracttype]
#[derive(Clone, Debug)]
pub struct Circuit {
    pub id: u32,
    pub vk: Groth16Vk,
    pub active: bool,
}

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    Circuit(u32),
    Nullifier(BytesN<32>),
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum Error {
    AlreadyInitialized = 1,
    NotAdmin = 2,
    CircuitNotFound = 3,
    CircuitNotActive = 4,
    InvalidProof = 5,
    ProofAlreadyUsed = 6,
    InvalidPublicInputCount = 7,
    EmptyIc = 8,
}

const BUMP_AMOUNT: u32 = 518_400;
const LIFETIME_THRESHOLD: u32 = 129_600;

// ============================================================
// CONTRACT
// ============================================================

#[contract]
pub struct ZkVerifier;

#[contractimpl]
impl ZkVerifier {
    pub fn initialize(env: Env, admin: Address) -> Result<(), Error> {
        if env.storage().instance().has(&DataKey::Admin) {
            return Err(Error::AlreadyInitialized);
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        Ok(())
    }

    /// Register a Groth16 BN254 verification key for a circuit type.
    /// circuit_id: 1 = private_bet, 2 = private_redemption, 3 = compliance_proof
    pub fn register_circuit(
        env: Env,
        admin: Address,
        circuit_id: u32,
        vk: Groth16Vk,
    ) -> Result<(), Error> {
        admin.require_auth();
        Self::require_admin(&env, &admin)?;

        if vk.ic.is_empty() {
            return Err(Error::EmptyIc);
        }

        let circuit = Circuit {
            id: circuit_id,
            vk,
            active: true,
        };

        env.storage().persistent().set(&DataKey::Circuit(circuit_id), &circuit);
        Self::bump_key(&env, &DataKey::Circuit(circuit_id));

        env.events().publish(
            (symbol_short!("register"), circuit_id),
            true,
        );
        Ok(())
    }

    /// Deactivate a circuit (admin only).
    pub fn deactivate_circuit(
        env: Env,
        admin: Address,
        circuit_id: u32,
    ) -> Result<(), Error> {
        admin.require_auth();
        Self::require_admin(&env, &admin)?;

        let mut circuit: Circuit = env.storage()
            .persistent()
            .get(&DataKey::Circuit(circuit_id))
            .ok_or(Error::CircuitNotFound)?;

        circuit.active = false;
        env.storage().persistent().set(&DataKey::Circuit(circuit_id), &circuit);
        Self::bump_key(&env, &DataKey::Circuit(circuit_id));
        Ok(())
    }

    /// Verify a Groth16 proof using BN254 pairing check.
    ///
    /// Verifies: e(-A, B) * e(alpha, beta) * e(vk_x, gamma) * e(C, delta) = 1
    /// where vk_x = IC[0] + sum(public_inputs[i] * IC[i+1])
    pub fn verify(
        env: Env,
        circuit_id: u32,
        proof: Groth16Proof,
        public_inputs: Vec<BytesN<32>>,
        nullifier: BytesN<32>,
    ) -> Result<bool, Error> {
        let circuit: Circuit = env.storage()
            .persistent()
            .get(&DataKey::Circuit(circuit_id))
            .ok_or(Error::CircuitNotFound)?;

        if !circuit.active {
            return Err(Error::CircuitNotActive);
        }

        // IC must have exactly public_inputs.len() + 1 elements
        if public_inputs.len() + 1 != circuit.vk.ic.len() {
            return Err(Error::InvalidPublicInputCount);
        }

        // Replay protection
        if env.storage().persistent().has(&DataKey::Nullifier(nullifier.clone())) {
            return Err(Error::ProofAlreadyUsed);
        }

        // Real Groth16 verification via BN254 multi-pairing
        let valid = Self::groth16_verify(&env, &circuit.vk, &proof, &public_inputs);

        if !valid {
            return Err(Error::InvalidProof);
        }

        // Mark nullifier as used
        env.storage().persistent().set(&DataKey::Nullifier(nullifier.clone()), &true);
        Self::bump_key(&env, &DataKey::Nullifier(nullifier));

        env.events().publish(
            (symbol_short!("verify"), circuit_id),
            true,
        );
        Ok(true)
    }

    /// Verify a proof and record the private bet commitment.
    pub fn private_bet(
        env: Env,
        user: Address,
        market_id: u64,
        circuit_id: u32,
        proof: Groth16Proof,
        public_inputs: Vec<BytesN<32>>,
        nullifier: BytesN<32>,
    ) -> Result<bool, Error> {
        user.require_auth();

        let verified = Self::verify(env.clone(), circuit_id, proof, public_inputs, nullifier)?;

        if verified {
            env.events().publish(
                (symbol_short!("pvt_bet"), market_id),
                user,
            );
        }

        Ok(verified)
    }

    pub fn get_circuit(env: Env, circuit_id: u32) -> Result<Circuit, Error> {
        env.storage()
            .persistent()
            .get(&DataKey::Circuit(circuit_id))
            .ok_or(Error::CircuitNotFound)
    }

    pub fn is_nullifier_used(env: Env, nullifier: BytesN<32>) -> bool {
        env.storage()
            .persistent()
            .get(&DataKey::Nullifier(nullifier))
            .unwrap_or(false)
    }

    // ============================================================
    // INTERNAL: Groth16 BN254 Verification
    // ============================================================

    /// Implements Groth16 verification via BN254 multi-pairing check.
    ///
    /// Equation: e(-A, B) * e(alpha, beta) * e(vk_x, gamma) * e(C, delta) = 1
    /// where vk_x = IC[0] + sum(public_inputs[i] * IC[i+1])
    fn groth16_verify(
        env: &Env,
        vk: &Groth16Vk,
        proof: &Groth16Proof,
        public_inputs: &Vec<BytesN<32>>,
    ) -> bool {
        use soroban_sdk::crypto::bn254::{Bn254G1Affine, Bn254G2Affine, Fr};

        let bn254 = env.crypto().bn254();

        // Parse proof elements
        let proof_a = Bn254G1Affine::from_bytes(proof.a.clone());
        let proof_b = Bn254G2Affine::from_bytes(proof.b.clone());
        let proof_c = Bn254G1Affine::from_bytes(proof.c.clone());

        // Parse verification key elements
        let vk_alpha = Bn254G1Affine::from_bytes(vk.alpha_g1.clone());
        let vk_beta = Bn254G2Affine::from_bytes(vk.beta_g2.clone());
        let vk_gamma = Bn254G2Affine::from_bytes(vk.gamma_g2.clone());
        let vk_delta = Bn254G2Affine::from_bytes(vk.delta_g2.clone());

        // Compute vk_x = IC[0] + sum(public_inputs[i] * IC[i+1])
        let mut vk_x = Bn254G1Affine::from_bytes(vk.ic.get(0).unwrap());

        for i in 0..public_inputs.len() {
            let scalar = Fr::from_bytes(public_inputs.get(i).unwrap());
            let ic_point = Bn254G1Affine::from_bytes(vk.ic.get(i + 1).unwrap());
            let term = bn254.g1_mul(&ic_point, &scalar);
            vk_x = bn254.g1_add(&vk_x, &term);
        }

        // Negate A for the pairing equation
        let neg_a = -proof_a;

        // Multi-pairing check:
        // e(-A, B) * e(alpha, beta) * e(vk_x, gamma) * e(C, delta) = 1
        let g1_vec: Vec<Bn254G1Affine> = soroban_sdk::vec![env,
            neg_a, vk_alpha, vk_x, proof_c
        ];
        let g2_vec: Vec<Bn254G2Affine> = soroban_sdk::vec![env,
            proof_b, vk_beta, vk_gamma, vk_delta
        ];

        bn254.pairing_check(g1_vec, g2_vec)
    }

    fn require_admin(env: &Env, addr: &Address) -> Result<(), Error> {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        if *addr != admin {
            return Err(Error::NotAdmin);
        }
        Ok(())
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
    use soroban_sdk::testutils::Address as _;
    use soroban_sdk::crypto::bn254::Bn254G1Affine;
    use soroban_sdk::{Env, vec, BytesN, Vec};

    // BN254 G1 generator: (1, 2) in 64-byte big-endian uncompressed format
    const G1_GEN: [u8; 64] = {
        let mut buf = [0u8; 64];
        buf[31] = 1; // x = 1 (big-endian 32 bytes)
        buf[63] = 2; // y = 2 (big-endian 32 bytes)
        buf
    };

    // BN254 G2 generator in 128-byte Soroban format:
    // be(X_c1) || be(X_c0) || be(Y_c1) || be(Y_c0)
    // where Fp2 = c0 + c1*u (c0=real, c1=imaginary)
    // Values from go-ethereum/crypto/bn256 (alt_bn128)
    const G2_GEN: [u8; 128] = [
        // X_c1 (imaginary) = 11559732032986387107991004021392285783925812861821192530917403151452391805634
        0x19, 0x8e, 0x93, 0x93, 0x92, 0x0d, 0x48, 0x3a,
        0x72, 0x60, 0xbf, 0xb7, 0x31, 0xfb, 0x5d, 0x25,
        0xf1, 0xaa, 0x49, 0x33, 0x35, 0xa9, 0xe7, 0x12,
        0x97, 0xe4, 0x85, 0xb7, 0xae, 0xf3, 0x12, 0xc2,
        // X_c0 (real) = 10857046999023057135944570762232829481370756359578518086990519993285655852781
        0x18, 0x00, 0xde, 0xef, 0x12, 0x1f, 0x1e, 0x76,
        0x42, 0x6a, 0x00, 0x66, 0x5e, 0x5c, 0x44, 0x79,
        0x67, 0x43, 0x22, 0xd4, 0xf7, 0x5e, 0xda, 0xdd,
        0x46, 0xde, 0xbd, 0x5c, 0xd9, 0x92, 0xf6, 0xed,
        // Y_c1 (imaginary) = 4082367875863433681332203403145435568316851327593401208105741076214120093531
        0x09, 0x06, 0x89, 0xd0, 0x58, 0x5f, 0xf0, 0x75,
        0xec, 0x9e, 0x99, 0xad, 0x69, 0x0c, 0x33, 0x95,
        0xbc, 0x4b, 0x31, 0x33, 0x70, 0xb3, 0x8e, 0xf3,
        0x55, 0xac, 0xda, 0xdc, 0xd1, 0x22, 0x97, 0x5b,
        // Y_c0 (real) = 8495653923123431417604973247489272438418190587263600148770280649306958101930
        0x12, 0xc8, 0x5e, 0xa5, 0xdb, 0x8c, 0x6d, 0xeb,
        0x4a, 0xab, 0x71, 0x80, 0x8d, 0xcb, 0x40, 0x8f,
        0xe3, 0xd1, 0xe7, 0x69, 0x0c, 0x43, 0xd3, 0x7b,
        0x4c, 0xe6, 0xcc, 0x01, 0x66, 0xfa, 0x7d, 0xaa,
    ];

    // Point at infinity (identity element) for G1
    const G1_INFINITY: [u8; 64] = [0u8; 64];

    fn setup() -> (Env, Address, ZkVerifierClient<'static>) {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register(ZkVerifier, ());
        let client = ZkVerifierClient::new(&env, &contract_id);
        let admin = Address::generate(&env);
        client.initialize(&admin);
        (env, admin, client)
    }

    /// Build a test VK with 0 public inputs.
    /// VK: alpha=G1, beta=G2, gamma=G2, delta=G2, IC=[G1]
    fn make_test_vk_no_inputs(env: &Env) -> Groth16Vk {
        let g1 = BytesN::from_array(env, &G1_GEN);
        let g2 = BytesN::from_array(env, &G2_GEN);
        Groth16Vk {
            alpha_g1: g1.clone(),
            beta_g2: g2.clone(),
            gamma_g2: g2.clone(),
            delta_g2: g2,
            ic: vec![env, g1],
        }
    }

    /// Build a valid proof for VK with 0 public inputs.
    /// Proof: A=2*G1, B=G2, C=infinity
    ///
    /// Verification:
    ///   e(-2G1, G2) * e(G1, G2) * e(G1, G2) * e(O, G2)
    ///   = e(-2G1 + G1 + G1, G2) * 1
    ///   = e(O, G2) = 1  (bilinearity of pairings)
    fn make_valid_proof_no_inputs(env: &Env) -> Groth16Proof {
        let bn254 = env.crypto().bn254();
        let g1 = Bn254G1Affine::from_array(env, &G1_GEN);
        let two_g1 = bn254.g1_add(&g1, &g1);

        Groth16Proof {
            a: two_g1.to_bytes(),
            b: BytesN::from_array(env, &G2_GEN),
            c: BytesN::from_array(env, &G1_INFINITY),
        }
    }

    /// Build a test VK with 1 public input.
    /// VK: alpha=G1, beta=G2, gamma=G2, delta=G2, IC=[G1, G1]
    fn make_test_vk_one_input(env: &Env) -> Groth16Vk {
        let g1 = BytesN::from_array(env, &G1_GEN);
        let g2 = BytesN::from_array(env, &G2_GEN);
        Groth16Vk {
            alpha_g1: g1.clone(),
            beta_g2: g2.clone(),
            gamma_g2: g2.clone(),
            delta_g2: g2,
            ic: vec![env, g1.clone(), g1],
        }
    }

    /// Build a valid proof for VK with 1 public input where input=1.
    /// vk_x = IC[0] + 1*IC[1] = G1 + G1 = 2*G1
    /// Proof: A=3*G1, B=G2, C=infinity
    ///
    /// Verification:
    ///   e(-3G1, G2) * e(G1, G2) * e(2G1, G2) * e(O, G2)
    ///   = e(-3G1 + G1 + 2G1, G2) * 1
    ///   = e(O, G2) = 1
    fn make_valid_proof_one_input(env: &Env) -> (Groth16Proof, Vec<BytesN<32>>) {
        let bn254 = env.crypto().bn254();
        let g1 = Bn254G1Affine::from_array(env, &G1_GEN);
        let two_g1 = bn254.g1_add(&g1, &g1);
        let three_g1 = bn254.g1_add(&two_g1, &g1);

        let proof = Groth16Proof {
            a: three_g1.to_bytes(),
            b: BytesN::from_array(env, &G2_GEN),
            c: BytesN::from_array(env, &G1_INFINITY),
        };

        // public_input = [1] as Fr scalar (32-byte big-endian)
        let one_scalar: [u8; 32] = {
            let mut buf = [0u8; 32];
            buf[31] = 1;
            buf
        };
        let inputs: Vec<BytesN<32>> = vec![env, BytesN::from_array(env, &one_scalar)];

        (proof, inputs)
    }

    #[test]
    fn test_register_circuit() {
        let (env, admin, client) = setup();
        let vk = make_test_vk_no_inputs(&env);

        client.register_circuit(&admin, &1, &vk);

        let circuit = client.get_circuit(&1);
        assert_eq!(circuit.id, 1);
        assert!(circuit.active);
    }

    #[test]
    fn test_deactivate_circuit() {
        let (env, admin, client) = setup();
        let vk = make_test_vk_no_inputs(&env);

        client.register_circuit(&admin, &1, &vk);
        client.deactivate_circuit(&admin, &1);

        let circuit = client.get_circuit(&1);
        assert!(!circuit.active);
    }

    #[test]
    fn test_verify_valid_proof_no_inputs() {
        let (env, admin, client) = setup();
        let vk = make_test_vk_no_inputs(&env);
        let proof = make_valid_proof_no_inputs(&env);
        let nullifier = BytesN::from_array(&env, &[10u8; 32]);
        let empty_inputs: Vec<BytesN<32>> = Vec::new(&env);

        client.register_circuit(&admin, &1, &vk);
        let result = client.verify(&1, &proof, &empty_inputs, &nullifier);
        assert!(result);
    }

    #[test]
    fn test_verify_valid_proof_with_public_input() {
        let (env, admin, client) = setup();
        let vk = make_test_vk_one_input(&env);
        let (proof, inputs) = make_valid_proof_one_input(&env);
        let nullifier = BytesN::from_array(&env, &[20u8; 32]);

        client.register_circuit(&admin, &1, &vk);
        let result = client.verify(&1, &proof, &inputs, &nullifier);
        assert!(result);
    }

    #[test]
    fn test_verify_invalid_proof_fails() {
        let (env, admin, client) = setup();
        let vk = make_test_vk_no_inputs(&env);
        let nullifier = BytesN::from_array(&env, &[10u8; 32]);
        let empty_inputs: Vec<BytesN<32>> = Vec::new(&env);

        // Use 3*G1 instead of valid 2*G1 — pairing equation won't balance
        let bn254 = env.crypto().bn254();
        let g1 = Bn254G1Affine::from_array(&env, &G1_GEN);
        let two_g1 = bn254.g1_add(&g1, &g1);
        let three_g1 = bn254.g1_add(&two_g1, &g1);

        let bad_proof = Groth16Proof {
            a: three_g1.to_bytes(),
            b: BytesN::from_array(&env, &G2_GEN),
            c: BytesN::from_array(&env, &G1_INFINITY),
        };

        client.register_circuit(&admin, &1, &vk);
        let result = client.try_verify(&1, &bad_proof, &empty_inputs, &nullifier);
        assert!(result.is_err());
    }

    #[test]
    fn test_nullifier_prevents_replay() {
        let (env, admin, client) = setup();
        let vk = make_test_vk_no_inputs(&env);
        let proof = make_valid_proof_no_inputs(&env);
        let nullifier = BytesN::from_array(&env, &[10u8; 32]);
        let empty_inputs: Vec<BytesN<32>> = Vec::new(&env);

        client.register_circuit(&admin, &1, &vk);
        client.verify(&1, &proof, &empty_inputs, &nullifier);

        assert!(client.is_nullifier_used(&nullifier));

        // Replay with same nullifier fails
        let result = client.try_verify(&1, &proof, &empty_inputs, &nullifier);
        assert!(result.is_err());
    }

    #[test]
    fn test_verify_inactive_circuit_fails() {
        let (env, admin, client) = setup();
        let vk = make_test_vk_no_inputs(&env);
        let proof = make_valid_proof_no_inputs(&env);
        let nullifier = BytesN::from_array(&env, &[10u8; 32]);
        let empty_inputs: Vec<BytesN<32>> = Vec::new(&env);

        client.register_circuit(&admin, &1, &vk);
        client.deactivate_circuit(&admin, &1);

        let result = client.try_verify(&1, &proof, &empty_inputs, &nullifier);
        assert!(result.is_err());
    }

    #[test]
    fn test_verify_nonexistent_circuit_fails() {
        let (env, _admin, client) = setup();
        let proof = make_valid_proof_no_inputs(&env);
        let nullifier = BytesN::from_array(&env, &[10u8; 32]);
        let empty_inputs: Vec<BytesN<32>> = Vec::new(&env);

        let result = client.try_verify(&99, &proof, &empty_inputs, &nullifier);
        assert!(result.is_err());
    }

    #[test]
    fn test_invalid_public_input_count_fails() {
        let (env, admin, client) = setup();
        let vk = make_test_vk_no_inputs(&env); // expects 0 public inputs
        let proof = make_valid_proof_no_inputs(&env);
        let nullifier = BytesN::from_array(&env, &[10u8; 32]);

        // Provide 1 public input when VK expects 0
        let extra_input: [u8; 32] = {
            let mut buf = [0u8; 32];
            buf[31] = 1;
            buf
        };
        let inputs: Vec<BytesN<32>> = vec![&env, BytesN::from_array(&env, &extra_input)];

        client.register_circuit(&admin, &1, &vk);
        let result = client.try_verify(&1, &proof, &inputs, &nullifier);
        assert!(result.is_err());
    }

    #[test]
    fn test_private_bet() {
        let (env, admin, client) = setup();
        let vk = make_test_vk_no_inputs(&env);
        let proof = make_valid_proof_no_inputs(&env);
        let nullifier = BytesN::from_array(&env, &[10u8; 32]);
        let user = Address::generate(&env);
        let empty_inputs: Vec<BytesN<32>> = Vec::new(&env);

        client.register_circuit(&admin, &1, &vk);
        let result = client.private_bet(&user, &1, &1, &proof, &empty_inputs, &nullifier);
        assert!(result);
    }

    #[test]
    fn test_register_empty_ic_fails() {
        let (env, admin, client) = setup();
        let g1 = BytesN::from_array(&env, &G1_GEN);
        let g2 = BytesN::from_array(&env, &G2_GEN);

        let vk = Groth16Vk {
            alpha_g1: g1,
            beta_g2: g2.clone(),
            gamma_g2: g2.clone(),
            delta_g2: g2,
            ic: Vec::new(&env),
        };

        let result = client.try_register_circuit(&admin, &1, &vk);
        assert!(result.is_err());
    }

    #[test]
    fn test_double_init_fails() {
        let (env, _admin, client) = setup();
        let other = Address::generate(&env);
        let result = client.try_initialize(&other);
        assert!(result.is_err());
    }
}
