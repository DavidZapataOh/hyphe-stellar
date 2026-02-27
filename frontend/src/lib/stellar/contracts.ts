import { nativeToScVal, Address, scValToNative } from "@stellar/stellar-sdk";
import { readContract } from "./client";
import { executeContractCall, type TxResult } from "./transaction";
import { CONTRACTS } from "@/lib/utils/constants";
import { parseChainMarket, parsePricesVec, i128ToBigInt } from "./parsers";
import type { ChainMarketInfo } from "./types";

export const MarketContract = {
  async marketCount() {
    return readContract(CONTRACTS.factory, "market_count", []);
  },

  async getMarket(marketId: number) {
    return readContract(CONTRACTS.factory, "get_market", [
      nativeToScVal(marketId, { type: "u64" }),
    ]);
  },

  async getMarketParsed(marketId: number): Promise<ChainMarketInfo> {
    const raw = await readContract(CONTRACTS.factory, "get_market", [
      nativeToScVal(marketId, { type: "u64" }),
    ]);
    return parseChainMarket(raw);
  },

  async marketCountParsed(): Promise<number> {
    const raw = await readContract(CONTRACTS.factory, "market_count", []);
    return Number(raw.u64());
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

  async getPrices(marketId: number): Promise<bigint[]> {
    const raw = await readContract(CONTRACTS.amm, "get_prices", [
      nativeToScVal(marketId, { type: "u64" }),
    ]);
    return parsePricesVec(raw);
  },

  async getTradeCount(marketId: number): Promise<number> {
    const raw = await readContract(CONTRACTS.amm, "get_trade_count", [
      nativeToScVal(marketId, { type: "u64" }),
    ]);
    return Number(raw.u64());
  },

  async getVolume(marketId: number): Promise<bigint> {
    const raw = await readContract(CONTRACTS.amm, "get_volume", [
      nativeToScVal(marketId, { type: "u64" }),
    ]);
    return i128ToBigInt(raw);
  },

  async quoteBuyParsed(marketId: number, outcome: number, shares: bigint): Promise<bigint> {
    const raw = await readContract(CONTRACTS.amm, "quote_buy", [
      nativeToScVal(marketId, { type: "u64" }),
      nativeToScVal(outcome, { type: "u32" }),
      nativeToScVal(shares, { type: "i128" }),
    ]);
    return i128ToBigInt(raw);
  },

  async quoteBuy(marketId: number, outcome: number, shares: bigint) {
    return readContract(CONTRACTS.amm, "quote_buy", [
      nativeToScVal(marketId, { type: "u64" }),
      nativeToScVal(outcome, { type: "u32" }),
      nativeToScVal(shares, { type: "i128" }),
    ]);
  },

  async quoteSellParsed(marketId: number, outcome: number, shares: bigint): Promise<bigint> {
    const raw = await readContract(CONTRACTS.amm, "quote_sell", [
      nativeToScVal(marketId, { type: "u64" }),
      nativeToScVal(outcome, { type: "u32" }),
      nativeToScVal(shares, { type: "i128" }),
    ]);
    return i128ToBigInt(raw);
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

export const OutcomeTokenContract = {
  async balance(marketId: number, outcome: number, user: string): Promise<bigint> {
    const raw = await readContract(CONTRACTS.outcomeToken, "balance", [
      nativeToScVal(marketId, { type: "u64" }),
      nativeToScVal(outcome, { type: "u32" }),
      new Address(user).toScVal(),
    ]);
    return i128ToBigInt(raw);
  },

  async totalSupply(marketId: number, outcome: number): Promise<bigint> {
    const raw = await readContract(CONTRACTS.outcomeToken, "total_supply", [
      nativeToScVal(marketId, { type: "u64" }),
      nativeToScVal(outcome, { type: "u32" }),
    ]);
    return i128ToBigInt(raw);
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
