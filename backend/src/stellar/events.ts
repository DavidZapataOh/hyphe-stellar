import { xdr, scValToNative, rpc } from "@stellar/stellar-sdk";

export interface ParsedTradeEvent {
  marketId: number;
  user: string;
  outcome: number;
  side: "BUY" | "SELL";
  shares: bigint;
  cost: bigint;
}

export interface ParsedMarketCreatedEvent {
  marketId: number;
  question: string;
  numOutcomes: number;
  endTime: number;
}

export interface ParsedResolvedEvent {
  marketId: number;
  winningOutcome: number;
}

export interface ParsedDepositEvent {
  user: string;
  amount: bigint;
}

export interface ParsedWithdrawEvent {
  user: string;
  amount: bigint;
}

/**
 * Extract topic symbol names from a Soroban event.
 * In stellar-sdk v14, topic is xdr.ScVal[] (already parsed).
 */
function topicStrings(event: rpc.Api.EventResponse): string[] {
  return event.topic.map((scVal: xdr.ScVal) => {
    try {
      return scValToNative(scVal) as string;
    } catch {
      return String(scVal);
    }
  });
}

/**
 * Parse the event data (value) into a native JS value.
 * In stellar-sdk v14, value is already xdr.ScVal.
 */
function parseEventValue(event: rpc.Api.EventResponse): unknown {
  try {
    return scValToNative(event.value);
  } catch {
    return null;
  }
}

/**
 * Identify and parse a Soroban contract event.
 */
export function parseEvent(
  event: rpc.Api.EventResponse
):
  | { type: "trade"; data: ParsedTradeEvent }
  | { type: "market_created"; data: ParsedMarketCreatedEvent }
  | { type: "resolved"; data: ParsedResolvedEvent }
  | { type: "deposit"; data: ParsedDepositEvent }
  | { type: "withdraw"; data: ParsedWithdrawEvent }
  | { type: "unknown"; data: null } {
  const topics = topicStrings(event);
  const value = parseEventValue(event) as Record<string, unknown> | null;

  if (topics[0] === "buy" || topics[0] === "sell") {
    // Event shape from AMM contract:
    //   topics: [symbol("buy"|"sell"), market_id: u64, outcome: u32]
    //   value:  tuple (user: Address, shares: i128, usdc_cost: i128) → parsed as array
    const arr = Array.isArray(value) ? value : [];
    return {
      type: "trade",
      data: {
        marketId: Number(topics[1] ?? 0),
        user: String(arr[0] ?? ""),
        outcome: Number(topics[2] ?? 0),
        side: topics[0] === "buy" ? "BUY" : "SELL",
        shares: BigInt(String(arr[1] ?? "0")),
        cost: BigInt(String(arr[2] ?? "0")),
      },
    };
  }

  if (topics[0] === "mkt_new") {
    // Event shape from market_factory:
    //   topics: [symbol("mkt_new"), market_id: u64]
    //   value:  tuple (num_outcomes: u32, end_time: u64) → parsed as array
    const arr = Array.isArray(value) ? value : [];
    return {
      type: "market_created",
      data: {
        marketId: Number(topics[1] ?? 0),
        question: "",
        numOutcomes: Number(arr[0] ?? 2),
        endTime: Number(arr[1] ?? 0),
      },
    };
  }

  if (topics[0] === "resolve") {
    // Event shape from market_factory:
    //   topics: [symbol("resolve"), market_id: u64]
    //   value:  winning_outcome: u32 (scalar, not tuple)
    return {
      type: "resolved",
      data: {
        marketId: Number(topics[1] ?? 0),
        winningOutcome: Number(value ?? 0),
      },
    };
  }

  if (topics[0] === "deposit") {
    // Event shape from hyphe_vault:
    //   topics: [symbol("deposit")]
    //   value:  tuple (user: Address, amount: i128) → parsed as array
    const arr = Array.isArray(value) ? value : [];
    return {
      type: "deposit",
      data: {
        user: String(arr[0] ?? ""),
        amount: BigInt(String(arr[1] ?? "0")),
      },
    };
  }

  if (topics[0] === "withdraw") {
    // Event shape from hyphe_vault:
    //   topics: [symbol("withdraw")]
    //   value:  tuple (user: Address, amount: i128) → parsed as array
    const arr = Array.isArray(value) ? value : [];
    return {
      type: "withdraw",
      data: {
        user: String(arr[0] ?? ""),
        amount: BigInt(String(arr[1] ?? "0")),
      },
    };
  }

  return { type: "unknown", data: null };
}
