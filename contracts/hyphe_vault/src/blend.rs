/// Blend Protocol integration types and helpers.
///
/// Defines types matching Blend Pool's interface and provides
/// helper functions for supply/withdraw via `env.invoke_contract()`.
/// This avoids needing `blend-contract-sdk` as a dependency.

use soroban_sdk::{contracttype, vec, Address, Env, IntoVal, Map, Symbol};

pub const SCALAR_9: i128 = 1_000_000_000;

// ============================================================
// BLEND TYPES (must match Blend Pool's contracttype definitions)
// ============================================================

/// Request passed to Blend Pool's `submit()`.
#[contracttype]
#[derive(Clone)]
pub struct Request {
    pub request_type: u32,
    pub address: Address,
    pub amount: i128,
}

/// Positions returned by Blend Pool's `submit()`.
/// Maps are: reserve_index (u32) → bToken balance (i128).
#[contracttype]
#[derive(Clone)]
pub struct Positions {
    pub liabilities: Map<u32, i128>,
    pub collateral: Map<u32, i128>,
    pub supply: Map<u32, i128>,
}

// Request type constants
pub const REQUEST_SUPPLY: u32 = 0;
pub const REQUEST_WITHDRAW: u32 = 1;

// ============================================================
// BLEND HELPERS
// ============================================================

/// Supply USDC to Blend Pool.
/// The vault must hold the USDC before calling this.
/// Returns updated Positions.
pub fn supply(
    env: &Env,
    pool: &Address,
    usdc: &Address,
    vault: &Address,
    amount: i128,
) -> Positions {
    let requests = vec![
        env,
        Request {
            request_type: REQUEST_SUPPLY,
            address: usdc.clone(),
            amount,
        },
    ];
    env.invoke_contract::<Positions>(
        pool,
        &Symbol::new(env, "submit"),
        vec![
            env,
            vault.into_val(env),
            vault.into_val(env),
            vault.into_val(env),
            requests.into_val(env),
        ],
    )
}

/// Withdraw USDC from Blend Pool.
/// If amount exceeds position, Blend caps to the maximum available.
/// Returns updated Positions.
pub fn withdraw(
    env: &Env,
    pool: &Address,
    usdc: &Address,
    vault: &Address,
    amount: i128,
) -> Positions {
    let requests = vec![
        env,
        Request {
            request_type: REQUEST_WITHDRAW,
            address: usdc.clone(),
            amount,
        },
    ];
    env.invoke_contract::<Positions>(
        pool,
        &Symbol::new(env, "submit"),
        vec![
            env,
            vault.into_val(env),
            vault.into_val(env),
            vault.into_val(env),
            requests.into_val(env),
        ],
    )
}

/// Read vault's positions from Blend Pool.
pub fn get_positions(env: &Env, pool: &Address, vault: &Address) -> Positions {
    env.invoke_contract::<Positions>(
        pool,
        &Symbol::new(env, "get_positions"),
        vec![env, vault.into_val(env)],
    )
}
