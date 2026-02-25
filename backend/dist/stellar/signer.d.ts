import { Keypair, TransactionBuilder } from "@stellar/stellar-sdk";
export declare function getOracleKeypair(): Keypair;
export declare function getNetworkPassphrase(): string;
/**
 * Sign, simulate, assemble, and submit a Soroban transaction.
 * Returns the transaction hash on success.
 */
export declare function signAndSubmit(txBuilder: TransactionBuilder): Promise<string>;
