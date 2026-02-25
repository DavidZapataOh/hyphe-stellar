"use client";

import { toast } from "sonner";
import { EXPLORER_URL } from "@/lib/utils/constants";

export function txPending(message = "Submitting transaction...") {
  return toast.loading(message, {
    description: "Waiting for confirmation on Stellar...",
  });
}

export function txSuccess(hash: string, message = "Transaction confirmed!") {
  const url = `${EXPLORER_URL}/tx/${hash}`;
  toast.success(message, {
    description: "View on Stellar Explorer",
    action: {
      label: "View",
      onClick: () => window.open(url, "_blank"),
    },
    duration: 5000,
  });
}

export function txError(error: string, message = "Transaction failed") {
  toast.error(message, {
    description: error,
    duration: 8000,
  });
}
