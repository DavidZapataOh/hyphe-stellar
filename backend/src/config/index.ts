import "dotenv/config";

export const config = {
  // Server
  PORT: parseInt(process.env["PORT"] || "3001", 10),

  // Database
  DATABASE_URL: process.env["DATABASE_URL"] || "",

  // Redis
  REDIS_URL: process.env["REDIS_URL"] || "redis://localhost:6379",

  // Stellar
  STELLAR_NETWORK: process.env["STELLAR_NETWORK"] || "testnet",
  SOROBAN_RPC_URL:
    process.env["SOROBAN_RPC_URL"] || "https://soroban-testnet.stellar.org",
  HORIZON_URL:
    process.env["HORIZON_URL"] || "https://horizon-testnet.stellar.org",

  // Contract addresses
  OUTCOME_TOKEN_CONTRACT: process.env["OUTCOME_TOKEN_CONTRACT"] || "",
  FACTORY_CONTRACT: process.env["FACTORY_CONTRACT"] || "",
  AMM_CONTRACT: process.env["AMM_CONTRACT"] || "",
  VAULT_CONTRACT: process.env["VAULT_CONTRACT"] || "",
  ORACLE_CONTRACT: process.env["ORACLE_CONTRACT"] || "",
  COMMIT_REVEAL_CONTRACT: process.env["COMMIT_REVEAL_CONTRACT"] || "",
  ZK_VERIFIER_CONTRACT: process.env["ZK_VERIFIER_CONTRACT"] || "",

  // USDC
  USDC_TOKEN: process.env["USDC_TOKEN"] || "",

  // Oracle
  ORACLE_SECRET_KEY: process.env["ORACLE_SECRET_KEY"] || "",

  // Sports APIs
  FOOTBALL_DATA_API_KEY: process.env["FOOTBALL_DATA_API_KEY"] || "",
} as const;
