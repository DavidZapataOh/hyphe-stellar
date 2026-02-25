import { Networks } from "@stellar/stellar-sdk";

export const NETWORK = process.env.NEXT_PUBLIC_NETWORK || "testnet";
export const HORIZON_URL =
  process.env.NEXT_PUBLIC_HORIZON_URL || "https://horizon-testnet.stellar.org";
export const SOROBAN_RPC_URL =
  process.env.NEXT_PUBLIC_SOROBAN_RPC_URL ||
  "https://soroban-testnet.stellar.org";
export const NETWORK_PASSPHRASE =
  NETWORK === "mainnet" ? Networks.PUBLIC : Networks.TESTNET;

export const CONTRACTS = {
  factory: process.env.NEXT_PUBLIC_FACTORY_CONTRACT!,
  vault: process.env.NEXT_PUBLIC_VAULT_CONTRACT!,
  amm: process.env.NEXT_PUBLIC_AMM_CONTRACT!,
  outcomeToken: process.env.NEXT_PUBLIC_OUTCOME_TOKEN_CONTRACT!,
  oracle: process.env.NEXT_PUBLIC_ORACLE_CONTRACT!,
  usdcSac: process.env.NEXT_PUBLIC_USDC_SAC!,
} as const;

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
export const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001";

// USDC has 7 decimals on Stellar
export const USDC_DECIMALS = 7;
export const USDC_MULTIPLIER = 10n ** BigInt(USDC_DECIMALS);

// Transaction defaults
export const DEFAULT_FEE = "100";
export const DEFAULT_TIMEOUT = 30;

// Stellar Explorer
export const EXPLORER_URL =
  NETWORK === "mainnet"
    ? "https://stellar.expert/explorer/public"
    : "https://stellar.expert/explorer/testnet";
