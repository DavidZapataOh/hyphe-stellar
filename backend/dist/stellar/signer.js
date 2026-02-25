import { Keypair, Networks, rpc, } from "@stellar/stellar-sdk";
import { config } from "../config/index.js";
import { getSorobanServer } from "./client.js";
import { logger } from "../utils/logger.js";
let oracleKeypair = null;
export function getOracleKeypair() {
    if (!oracleKeypair) {
        if (!config.ORACLE_SECRET_KEY) {
            throw new Error("ORACLE_SECRET_KEY not configured");
        }
        oracleKeypair = Keypair.fromSecret(config.ORACLE_SECRET_KEY);
    }
    return oracleKeypair;
}
export function getNetworkPassphrase() {
    return config.STELLAR_NETWORK === "mainnet"
        ? Networks.PUBLIC
        : Networks.TESTNET;
}
/**
 * Sign, simulate, assemble, and submit a Soroban transaction.
 * Returns the transaction hash on success.
 */
export async function signAndSubmit(txBuilder) {
    const server = getSorobanServer();
    const keypair = getOracleKeypair();
    const built = txBuilder.build();
    // Simulate to get footprint and resource fees
    const simResult = await server.simulateTransaction(built);
    if (rpc.Api.isSimulationError(simResult)) {
        const errResult = simResult;
        throw new Error(`Simulation failed: ${errResult.error}`);
    }
    // Assemble with simulation results
    const assembled = rpc.assembleTransaction(built, simResult).build();
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
//# sourceMappingURL=signer.js.map