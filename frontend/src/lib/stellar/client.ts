import {
  rpc,
  TransactionBuilder,
  Contract,
  Account,
  xdr,
} from "@stellar/stellar-sdk";
import {
  SOROBAN_RPC_URL,
  NETWORK_PASSPHRASE,
  DEFAULT_FEE,
  DEFAULT_TIMEOUT,
} from "@/lib/utils/constants";

const server = new rpc.Server(SOROBAN_RPC_URL);

export { server };

/**
 * Build and simulate a contract call transaction that requires signing.
 * Returns the assembled (prepared) transaction XDR ready for signing.
 */
export async function buildContractTx(
  contractId: string,
  method: string,
  args: xdr.ScVal[],
  signerAddress: string,
): Promise<string> {
  const account = await server.getAccount(signerAddress);
  const contract = new Contract(contractId);

  const tx = new TransactionBuilder(account, {
    fee: DEFAULT_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call(method, ...args))
    .setTimeout(DEFAULT_TIMEOUT)
    .build();

  const simResult = await server.simulateTransaction(tx);
  if (rpc.Api.isSimulationError(simResult)) {
    throw new Error(
      `Simulation failed: ${JSON.stringify(simResult.error)}`,
    );
  }

  const preparedTx = rpc.assembleTransaction(tx, simResult).build();
  return preparedTx.toXDR();
}

// Dummy address for read-only simulations
const DUMMY_ADDRESS =
  "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF";

/**
 * Read-only contract call (no signing needed).
 * Uses a dummy account for simulation.
 */
export async function readContract(
  contractId: string,
  method: string,
  args: xdr.ScVal[] = [],
): Promise<xdr.ScVal> {
  // Try fetching the dummy account, fall back to creating one locally
  let account: Account;
  try {
    const fetched = await server.getAccount(DUMMY_ADDRESS);
    account = new Account(fetched.accountId(), fetched.sequenceNumber());
  } catch {
    account = new Account(DUMMY_ADDRESS, "0");
  }

  const contract = new Contract(contractId);

  const tx = new TransactionBuilder(account, {
    fee: DEFAULT_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call(method, ...args))
    .setTimeout(DEFAULT_TIMEOUT)
    .build();

  const simResult = await server.simulateTransaction(tx);
  if (rpc.Api.isSimulationError(simResult)) {
    throw new Error(`Read failed: ${JSON.stringify(simResult.error)}`);
  }

  if (!rpc.Api.isSimulationSuccess(simResult) || !simResult.result) {
    throw new Error("Simulation did not return a result");
  }

  return simResult.result.retval;
}

export interface SubmitTxResult {
  hash: string;
  txResponse: rpc.Api.GetSuccessfulTransactionResponse;
}

/**
 * Submit a signed transaction and wait for confirmation.
 */
export async function submitTx(signedXdr: string): Promise<SubmitTxResult> {
  const tx = TransactionBuilder.fromXDR(
    signedXdr,
    NETWORK_PASSPHRASE,
  );

  const sendResult = await server.sendTransaction(tx);

  if (sendResult.status === "ERROR") {
    throw new Error(`Transaction send failed: ${sendResult.errorResult?.toXDR("base64") ?? "unknown error"}`);
  }

  // Poll for result
  const hash = sendResult.hash;
  let getResult = await server.getTransaction(hash);

  while (getResult.status === "NOT_FOUND") {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    getResult = await server.getTransaction(hash);
  }

  if (getResult.status === "FAILED") {
    throw new Error(`Transaction failed: ${getResult.resultXdr?.toXDR("base64") ?? "unknown"}`);
  }

  return {
    hash,
    txResponse: getResult as rpc.Api.GetSuccessfulTransactionResponse,
  };
}
