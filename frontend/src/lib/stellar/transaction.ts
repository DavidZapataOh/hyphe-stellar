import { buildContractTx, submitTx } from "./client";
import { signTransaction } from "./wallet";
import { xdr } from "@stellar/stellar-sdk";
import { EXPLORER_URL } from "@/lib/utils/constants";

export interface TxResult {
  hash: string;
  explorerUrl: string;
  returnValue?: xdr.ScVal;
}

/**
 * Full transaction lifecycle: build → sign → submit → return result.
 */
export async function executeContractCall(
  contractId: string,
  method: string,
  args: xdr.ScVal[],
  signerAddress: string,
): Promise<TxResult> {
  // 1. Build and simulate
  const txXdr = await buildContractTx(contractId, method, args, signerAddress);

  // 2. Sign with wallet
  const signedXdr = await signTransaction(txXdr);

  // 3. Submit and wait
  const { hash, txResponse } = await submitTx(signedXdr);

  return {
    hash,
    explorerUrl: `${EXPLORER_URL}/tx/${hash}`,
    returnValue: txResponse.returnValue,
  };
}
