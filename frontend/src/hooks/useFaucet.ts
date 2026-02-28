"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useFaucet() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (address: string) => {
      const res = await fetch("/api/faucet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Faucet request failed");
      return data as { success: boolean; hash: string };
    },
    onSuccess: (_data, address) => {
      queryClient.invalidateQueries({ queryKey: ["usdc-balance", address] });
    },
  });

  return {
    requestFaucet: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
}
