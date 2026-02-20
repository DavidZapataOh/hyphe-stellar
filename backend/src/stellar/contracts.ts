import {
  Contract,
  TransactionBuilder,
  nativeToScVal,
  Address,
  xdr,
  rpc,
} from "@stellar/stellar-sdk";
import { config } from "../config/index.js";
import { getSorobanServer } from "./client.js";
import { getOracleKeypair, getNetworkPassphrase, signAndSubmit } from "./signer.js";
import { logger } from "../utils/logger.js";

// Contract instances
const factoryContract = new Contract(config.FACTORY_CONTRACT);
const ammContract = new Contract(config.AMM_CONTRACT);
const vaultContract = new Contract(config.VAULT_CONTRACT);
const oracleContract = new Contract(config.ORACLE_CONTRACT);
const outcomeTokenContract = new Contract(config.OUTCOME_TOKEN_CONTRACT);

const BASE_FEE = "100";

async function getOracleAccount(): Promise<ReturnType<rpc.Server["getAccount"]> extends Promise<infer T> ? T : never> {
  const server = getSorobanServer();
  const keypair = getOracleKeypair();
  return server.getAccount(keypair.publicKey());
}

/**
 * Helper to build a TransactionBuilder for contract calls.
 */
async function buildTx(
  contract: Contract,
  method: string,
  ...args: xdr.ScVal[]
): Promise<TransactionBuilder> {
  const account = await getOracleAccount();
  const builder = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: getNetworkPassphrase(),
  })
    .addOperation(contract.call(method, ...args))
    .setTimeout(30);

  return builder;
}

/**
 * Read-only: simulate a contract call and return the result value.
 */
async function readContract(
  contract: Contract,
  method: string,
  ...args: xdr.ScVal[]
): Promise<xdr.ScVal | null> {
  const server = getSorobanServer();
  const account = await getOracleAccount();

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: getNetworkPassphrase(),
  })
    .addOperation(contract.call(method, ...args))
    .setTimeout(30)
    .build();

  const simResult = await server.simulateTransaction(tx);

  if (rpc.Api.isSimulationError(simResult)) {
    const errResult = simResult as rpc.Api.SimulateTransactionErrorResponse;
    logger.warn(
      { method, error: errResult.error },
      "Contract read simulation failed"
    );
    return null;
  }

  const success = simResult as rpc.Api.SimulateTransactionSuccessResponse;
  if (success.result) {
    return success.result.retval;
  }
  return null;
}

// Helper to decode i128 ScVal to bigint
function i128ToBigInt(scVal: xdr.ScVal): bigint {
  const i128 = scVal.i128();
  return i128.lo().toBigInt() + (i128.hi().toBigInt() << 64n);
}

// ──────────────────────────────────────────
// Factory
// ──────────────────────────────────────────

export async function getMarket(marketId: number): Promise<xdr.ScVal | null> {
  return readContract(
    factoryContract,
    "get_market",
    nativeToScVal(marketId, { type: "u64" })
  );
}

export async function getMarketCount(): Promise<number> {
  const result = await readContract(factoryContract, "market_count");
  if (!result) return 0;
  return Number(result.u64());
}

// ──────────────────────────────────────────
// AMM — Read
// ──────────────────────────────────────────

export async function getPrice(
  marketId: number,
  outcome: number
): Promise<bigint> {
  const result = await readContract(
    ammContract,
    "get_price",
    nativeToScVal(marketId, { type: "u64" }),
    nativeToScVal(outcome, { type: "u32" })
  );
  if (!result) return 0n;
  return i128ToBigInt(result);
}

export async function getPrices(marketId: number): Promise<bigint[]> {
  const result = await readContract(
    ammContract,
    "get_prices",
    nativeToScVal(marketId, { type: "u64" })
  );
  if (!result) return [];

  const vec = result.vec();
  if (!vec) return [];
  return vec.map((v: xdr.ScVal) => i128ToBigInt(v));
}

export async function quoteBuy(
  marketId: number,
  outcome: number,
  shares: bigint
): Promise<bigint> {
  const result = await readContract(
    ammContract,
    "quote_buy",
    nativeToScVal(marketId, { type: "u64" }),
    nativeToScVal(outcome, { type: "u32" }),
    nativeToScVal(shares, { type: "i128" })
  );
  if (!result) return 0n;
  return i128ToBigInt(result);
}

export async function getAmmBalance(): Promise<bigint> {
  const result = await readContract(ammContract, "get_balance");
  if (!result) return 0n;
  return i128ToBigInt(result);
}

// ──────────────────────────────────────────
// Vault — Read
// ──────────────────────────────────────────

export async function getVaultTvl(): Promise<bigint> {
  const result = await readContract(vaultContract, "get_tvl");
  if (!result) return 0n;
  return i128ToBigInt(result);
}

export async function getVaultBalance(): Promise<bigint> {
  const result = await readContract(vaultContract, "get_balance");
  if (!result) return 0n;
  return i128ToBigInt(result);
}

export async function getBlendPosition(): Promise<{
  principal: bigint;
  bTokens: bigint;
}> {
  const result = await readContract(vaultContract, "get_blend_position");
  if (!result) return { principal: 0n, bTokens: 0n };
  const tuple = result.vec();
  if (!tuple || tuple.length < 2) return { principal: 0n, bTokens: 0n };
  return {
    principal: i128ToBigInt(tuple[0]),
    bTokens: i128ToBigInt(tuple[1]),
  };
}

export async function getVaultTotalYield(): Promise<bigint> {
  const result = await readContract(vaultContract, "get_total_yield");
  if (!result) return 0n;
  return i128ToBigInt(result);
}

export async function getUserYield(address: string): Promise<bigint> {
  const result = await readContract(
    vaultContract,
    "get_user_yield",
    new Address(address).toScVal()
  );
  if (!result) return 0n;
  return i128ToBigInt(result);
}

export async function getUserDeposit(address: string): Promise<bigint> {
  const result = await readContract(
    vaultContract,
    "get_deposit",
    new Address(address).toScVal()
  );
  if (!result) return 0n;
  return i128ToBigInt(result);
}

// ──────────────────────────────────────────
// Vault — Write
// ──────────────────────────────────────────

export async function accrueYield(): Promise<string> {
  const txBuilder = await buildTx(vaultContract, "accrue_yield");
  return signAndSubmit(txBuilder);
}

// ──────────────────────────────────────────
// Oracle — Write
// ──────────────────────────────────────────

export async function submitOracleResult(
  marketId: number,
  outcome: number
): Promise<string> {
  const keypair = getOracleKeypair();
  const txBuilder = await buildTx(
    oracleContract,
    "submit_result",
    new Address(keypair.publicKey()).toScVal(),
    nativeToScVal(marketId, { type: "u64" }),
    nativeToScVal(outcome, { type: "u32" })
  );
  return signAndSubmit(txBuilder);
}

export async function finalizeOracle(marketId: number): Promise<string> {
  const txBuilder = await buildTx(
    oracleContract,
    "finalize",
    nativeToScVal(marketId, { type: "u64" })
  );
  return signAndSubmit(txBuilder);
}

// ──────────────────────────────────────────
// Outcome Token — Read
// ──────────────────────────────────────────

export async function getOutcomeBalance(
  marketId: number,
  outcome: number,
  user: string
): Promise<bigint> {
  const result = await readContract(
    outcomeTokenContract,
    "balance",
    nativeToScVal(marketId, { type: "u64" }),
    nativeToScVal(outcome, { type: "u32" }),
    new Address(user).toScVal()
  );
  if (!result) return 0n;
  return i128ToBigInt(result);
}

export async function getOutcomeTotalSupply(
  marketId: number,
  outcome: number
): Promise<bigint> {
  const result = await readContract(
    outcomeTokenContract,
    "total_supply",
    nativeToScVal(marketId, { type: "u64" }),
    nativeToScVal(outcome, { type: "u32" })
  );
  if (!result) return 0n;
  return i128ToBigInt(result);
}
