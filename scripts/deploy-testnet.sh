#!/bin/bash
# Hyphe Protocol — Testnet Deployment Script
# Deploys all contracts to Stellar Testnet and initializes them.
#
# Prerequisites:
# - stellar CLI v25+ installed (cargo install --locked stellar-cli)
# - Testnet account funded (friendbot)
# - wasm32v1-none target installed (rustup target add wasm32v1-none)
#
# Usage: ./scripts/deploy-testnet.sh

set -euo pipefail

# ============================================================
# CONFIGURATION
# ============================================================

NETWORK="testnet"
NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
RPC_URL="https://soroban-testnet.stellar.org"

# Blend Protocol addresses (testnet)
USDC_TOKEN="CAQCFVLOBK5GIULPNZRGATJJMIZL5BSP7X5YJVMGCPTUEPFM4AVSRCJU"
BLEND_POOL="CCEBVDYM32YNYCVNRXQKDFFPISJJCV557CDZEIRBEE4NCV4KHPQ44HGF"

# Deployer identity (create with: stellar keys generate deployer --network testnet)
DEPLOYER="deployer"

# Yield split: 70% AMM subsidy / 20% users / 10% protocol
SUBSIDY_BPS=7000
USER_BPS=2000
PROTOCOL_BPS=1000
BUFFER_RATIO_BPS=1500

# Oracle config
DISPUTE_PERIOD=7200   # 2 hours
DISPUTE_BOND=10000000 # 1 USDC (7 decimals)

# Commit-reveal config
REVEAL_DEADLINE=3600  # 1 hour

# Output file
OUTPUT_FILE="scripts/testnet-addresses.json"

# ============================================================
# BUILD
# ============================================================

echo "=== Building contracts ==="
cd "$(dirname "$0")/.."

# Build WASMs WITHOUT CARGO_TARGET_DIR so contractimport finds them
# at contracts/target/wasm32v1-none/release/
cargo build \
    --manifest-path contracts/Cargo.toml \
    --release \
    --target wasm32v1-none \
    -p hyphe-outcome-token \
    -p hyphe-market-factory \
    -p hyphe-lmsr-amm \
    -p hyphe-vault \
    -p hyphe-oracle \
    -p hyphe-commit-reveal \
    -p hyphe-zk-verifier

WASM_DIR="contracts/target/wasm32v1-none/release"

echo "=== Optimizing WASMs ==="
for wasm in \
    "$WASM_DIR/hyphe_outcome_token.wasm" \
    "$WASM_DIR/hyphe_market_factory.wasm" \
    "$WASM_DIR/hyphe_lmsr_amm.wasm" \
    "$WASM_DIR/hyphe_vault.wasm" \
    "$WASM_DIR/hyphe_oracle.wasm" \
    "$WASM_DIR/hyphe_commit_reveal.wasm" \
    "$WASM_DIR/hyphe_zk_verifier.wasm"; do
    stellar contract optimize --wasm "$wasm" 2>/dev/null || true
done

# ============================================================
# DEPLOY
# ============================================================

deploy() {
    local name=$1
    local wasm=$2
    echo "  Deploying $name..." >&2
    stellar contract deploy \
        --wasm "$wasm" \
        --source "$DEPLOYER" \
        --network "$NETWORK"
}

echo ""
echo "=== Deploying contracts ==="

ADMIN=$(stellar keys address "$DEPLOYER" 2>/dev/null || echo "UNKNOWN")
echo "  Admin/Deployer: $ADMIN"

OUTCOME_TOKEN=$(deploy "outcome_token" "$WASM_DIR/hyphe_outcome_token.wasm")
echo "  outcome_token:   $OUTCOME_TOKEN"

MARKET_FACTORY=$(deploy "market_factory" "$WASM_DIR/hyphe_market_factory.wasm")
echo "  market_factory:  $MARKET_FACTORY"

LMSR_AMM=$(deploy "lmsr_amm" "$WASM_DIR/hyphe_lmsr_amm.wasm")
echo "  lmsr_amm:        $LMSR_AMM"

HYPHE_VAULT=$(deploy "hyphe_vault" "$WASM_DIR/hyphe_vault.wasm")
echo "  hyphe_vault:     $HYPHE_VAULT"

ORACLE=$(deploy "oracle" "$WASM_DIR/hyphe_oracle.wasm")
echo "  oracle:          $ORACLE"

COMMIT_REVEAL=$(deploy "commit_reveal" "$WASM_DIR/hyphe_commit_reveal.wasm")
echo "  commit_reveal:   $COMMIT_REVEAL"

ZK_VERIFIER=$(deploy "zk_verifier" "$WASM_DIR/hyphe_zk_verifier.wasm")
echo "  zk_verifier:     $ZK_VERIFIER"

# Treasury is the deployer address for testnet
TREASURY="$ADMIN"

# ============================================================
# INITIALIZE (order matters: dependencies first)
# ============================================================

invoke() {
    local contract=$1
    shift
    stellar contract invoke \
        --id "$contract" \
        --source "$DEPLOYER" \
        --network "$NETWORK" \
        -- "$@"
}

echo ""
echo "=== Initializing contracts ==="

echo "  1/7 outcome_token..."
invoke "$OUTCOME_TOKEN" initialize --admin "$ADMIN"

echo "  2/7 market_factory..."
invoke "$MARKET_FACTORY" initialize \
    --admin "$ADMIN" \
    --outcome_token "$OUTCOME_TOKEN" \
    --vault "$HYPHE_VAULT" \
    --amm "$LMSR_AMM" \
    --usdc_token "$USDC_TOKEN"

echo "  3/7 lmsr_amm..."
invoke "$LMSR_AMM" initialize \
    --admin "$ADMIN" \
    --outcome_token "$OUTCOME_TOKEN" \
    --market_factory "$MARKET_FACTORY" \
    --usdc_token "$USDC_TOKEN"

echo "  4/7 hyphe_vault..."
invoke "$HYPHE_VAULT" initialize \
    --admin "$ADMIN" \
    --usdc_token "$USDC_TOKEN" \
    --blend_pool "$BLEND_POOL" \
    --lmsr_amm "$LMSR_AMM" \
    --treasury "$TREASURY" \
    --buffer_ratio_bps "$BUFFER_RATIO_BPS" \
    --subsidy_bps "$SUBSIDY_BPS" \
    --user_bps "$USER_BPS" \
    --protocol_bps "$PROTOCOL_BPS"

echo "  5/7 oracle..."
invoke "$ORACLE" initialize \
    --admin "$ADMIN" \
    --usdc_token "$USDC_TOKEN" \
    --treasury "$TREASURY" \
    --market_factory "$MARKET_FACTORY" \
    --dispute_period "$DISPUTE_PERIOD" \
    --dispute_bond "$DISPUTE_BOND"

echo "  6/7 commit_reveal..."
invoke "$COMMIT_REVEAL" initialize \
    --admin "$ADMIN" \
    --usdc_token "$USDC_TOKEN" \
    --lmsr_amm "$LMSR_AMM" \
    --reveal_deadline_offset "$REVEAL_DEADLINE"

echo "  7/7 zk_verifier..."
invoke "$ZK_VERIFIER" initialize --admin "$ADMIN"

# ============================================================
# REGISTER MINTERS
# ============================================================

echo ""
echo "=== Registering minters on OutcomeToken ==="

echo "  Adding market_factory as minter..."
invoke "$OUTCOME_TOKEN" add_minter --admin "$ADMIN" --minter "$MARKET_FACTORY"

echo "  Adding lmsr_amm as minter..."
invoke "$OUTCOME_TOKEN" add_minter --admin "$ADMIN" --minter "$LMSR_AMM"

# ============================================================
# SAVE ADDRESSES
# ============================================================

echo ""
echo "=== Saving addresses to $OUTPUT_FILE ==="

cat > "$OUTPUT_FILE" << JSONEOF
{
  "network": "$NETWORK",
  "rpc_url": "$RPC_URL",
  "admin": "$ADMIN",
  "treasury": "$TREASURY",
  "usdc_token": "$USDC_TOKEN",
  "blend_pool": "$BLEND_POOL",
  "contracts": {
    "outcome_token": "$OUTCOME_TOKEN",
    "market_factory": "$MARKET_FACTORY",
    "lmsr_amm": "$LMSR_AMM",
    "hyphe_vault": "$HYPHE_VAULT",
    "oracle": "$ORACLE",
    "commit_reveal": "$COMMIT_REVEAL",
    "zk_verifier": "$ZK_VERIFIER"
  },
  "config": {
    "buffer_ratio_bps": $BUFFER_RATIO_BPS,
    "subsidy_bps": $SUBSIDY_BPS,
    "user_bps": $USER_BPS,
    "protocol_bps": $PROTOCOL_BPS,
    "dispute_period": $DISPUTE_PERIOD,
    "dispute_bond": $DISPUTE_BOND,
    "reveal_deadline": $REVEAL_DEADLINE
  }
}
JSONEOF

echo ""
echo "=== Deployment complete! ==="
echo "Addresses saved to: $OUTPUT_FILE"
echo ""
echo "Next steps:"
echo "  1. Fund vault with test USDC: stellar contract invoke --id $HYPHE_VAULT ..."
echo "  2. Create a test market: stellar contract invoke --id $MARKET_FACTORY -- create_market ..."
echo "  3. Init AMM state: stellar contract invoke --id $LMSR_AMM -- init_market ..."
