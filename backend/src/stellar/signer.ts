import {
  Keypair,
  TransactionBuilder,
  Networks,
  rpc,
} from "@stellar/stellar-sdk";
import { config } from "../config/index.js";
import { getSorobanServer } from "./client.js";
import { logger } from "../utils/logger.js";

let oracleKeypair: Keypair | null = null;

export function getOracleKeypair(): Keypair {
  if (!oracleKeypair) {
    if (!config.ORACLE_SECRET_KEY) {
      throw new Error("ORACLE_SECRET_KEY not configured");
    }
    oracleKeypair = Keypair.fromSecret(config.ORACLE_SECRET_KEY);
  }
  return oracleKeypair;
}

export function getNetworkPassphrase(): string {
  return config.STELLAR_NETWORK === "mainnet"
    ? Networks.PUBLIC
    : Networks.TESTNET;
}

/**
 * Sign, simulate, assemble, and submit a Soroban transaction.
 * Returns the transaction hash on success.
 */
export async function signAndSubmit(
  txBuilder: TransactionBuilder
): Promise<string> {
  const server = getSorobanServer();
  const keypair = getOracleKeypair();

  const built = txBuilder.build();

  // Simulate to get footprint and resource fees
  const simResult = await server.simulateTransaction(built);

  if (rpc.Api.isSimulationError(simResult)) {
    const errResult = simResult as rpc.Api.SimulateTransactionErrorResponse;
    throw new Error(`Simulation failed: ${errResult.error}`);
  }

  // Assemble with simulation results
  const assembled = rpc.assembleTransaction(
    built,
    simResult as rpc.Api.SimulateTransactionSuccessResponse
  ).build();

  // Sign
  assembled.sign(keypair);

  // Submit
  const sendResult = await server.sendTransaction(assembled);

  if (sendResult.status === "ERROR") {
    throw new Error(`Transaction send failed: ${sendResult.status}`);
  }

  // Poll for result
  const hash = sendResult.hash;
  let getResult = await server.getTransaction(hash);

  while (getResult.status === "NOT_FOUND") {
    await new Promise((r) => setTimeout(r, 1000));
    getResult = await server.getTransaction(hash);
  }

  if (getResult.status === "FAILED") {
    logger.error({ hash }, "Transaction failed on-chain");
    throw new Error(`Transaction failed: ${hash}`);
  }

  return hash;
}
