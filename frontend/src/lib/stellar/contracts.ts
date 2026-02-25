import { nativeToScVal, Address } from "@stellar/stellar-sdk";
import { readContract } from "./client";
import { executeContractCall, type TxResult } from "./transaction";
import { CONTRACTS } from "@/lib/utils/constants";

export const MarketContract = {
  async marketCount() {
    return readContract(CONTRACTS.factory, "market_count", []);
  },

  async getMarket(marketId: number) {
    return readContract(CONTRACTS.factory, "get_market", [
      nativeToScVal(marketId, { type: "u64" }),
    ]);
  },

  async split(
    userAddress: string,
    marketId: number,
    amount: bigint,
  ): Promise<TxResult> {
    return executeContractCall(CONTRACTS.factory, "split", [
      new Address(userAddress).toScVal(),
      nativeToScVal(marketId, { type: "u64" }),
      nativeToScVal(amount, { type: "i128" }),
    ], userAddress);
  },

  async merge(
    userAddress: string,
    marketId: number,
    amount: bigint,
  ): Promise<TxResult> {
    return executeContractCall(CONTRACTS.factory, "merge", [
      new Address(userAddress).toScVal(),
      nativeToScVal(marketId, { type: "u64" }),
      nativeToScVal(amount, { type: "i128" }),
    ], userAddress);
  },

  async redeem(
    userAddress: string,
    marketId: number,
  ): Promise<TxResult> {
    return executeContractCall(CONTRACTS.factory, "redeem", [
      new Address(userAddress).toScVal(),
      nativeToScVal(marketId, { type: "u64" }),
    ], userAddress);
  },
};

export const AmmContract = {
  async getPrice(marketId: number, outcome: number) {
    return readContract(CONTRACTS.amm, "get_price", [
      nativeToScVal(marketId, { type: "u64" }),
      nativeToScVal(outcome, { type: "u32" }),
    ]);
  },

  async quoteBuy(marketId: number, outcome: number, shares: bigint) {
    return readContract(CONTRACTS.amm, "quote_buy", [
      nativeToScVal(marketId, { type: "u64" }),
      nativeToScVal(outcome, { type: "u32" }),
      nativeToScVal(shares, { type: "i128" }),
    ]);
  },

  async buy(
    userAddress: string,
    marketId: number,
    outcome: number,
    shares: bigint,
  ): Promise<TxResult> {
    return executeContractCall(CONTRACTS.amm, "buy", [
      new Address(userAddress).toScVal(),
      nativeToScVal(marketId, { type: "u64" }),
      nativeToScVal(outcome, { type: "u32" }),
      nativeToScVal(shares, { type: "i128" }),
    ], userAddress);
  },

  async sell(
    userAddress: string,
    marketId: number,
    outcome: number,
    shares: bigint,
  ): Promise<TxResult> {
    return executeContractCall(CONTRACTS.amm, "sell", [
      new Address(userAddress).toScVal(),
      nativeToScVal(marketId, { type: "u64" }),
      nativeToScVal(outcome, { type: "u32" }),
      nativeToScVal(shares, { type: "i128" }),
    ], userAddress);
  },
};

export const VaultContract = {
  async deposit(
    userAddress: string,
    amount: bigint,
  ): Promise<TxResult> {
    return executeContractCall(CONTRACTS.vault, "deposit", [
      new Address(userAddress).toScVal(),
      nativeToScVal(amount, { type: "i128" }),
    ], userAddress);
  },

  async withdraw(
    userAddress: string,
    amount: bigint,
  ): Promise<TxResult> {
    return executeContractCall(CONTRACTS.vault, "withdraw", [
      new Address(userAddress).toScVal(),
      nativeToScVal(amount, { type: "i128" }),
    ], userAddress);
  },

  async getTvl() {
    return readContract(CONTRACTS.vault, "get_tvl", []);
  },

  async getUserYield(userAddress: string) {
    return readContract(CONTRACTS.vault, "get_user_yield", [
      new Address(userAddress).toScVal(),
    ]);
  },

  async claimYield(userAddress: string): Promise<TxResult> {
    return executeContractCall(CONTRACTS.vault, "claim_yield", [
      new Address(userAddress).toScVal(),
    ], userAddress);
  },
};
