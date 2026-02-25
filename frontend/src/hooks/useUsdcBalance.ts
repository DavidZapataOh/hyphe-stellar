"use client";

import { useQuery } from "@tanstack/react-query";
import { Address, scValToNative } from "@stellar/stellar-sdk";
import { readContract } from "@/lib/stellar/client";
import { CONTRACTS } from "@/lib/utils/constants";
import { useWallet } from "./useWallet";

/**
 * Fetch the connected wallet's USDC balance from the SAC contract.
 * Returns the balance as a string (raw 7-decimal integer) to avoid bigint serialization issues.
 */
export function useUsdcBalance() {
  const { connected, address } = useWallet();

  return useQuery({
    queryKey: ["usdc-balance", address],
    queryFn: async (): Promise<string> => {
      if (!address) return "0";
      const result = await readContract(CONTRACTS.usdcSac, "balance", [
        new Address(address).toScVal(),
      ]);
      const raw = scValToNative(result) as bigint;
      return raw.toString();
    },
    enabled: connected && !!address,
    refetchInterval: 15_000,
  });
}
