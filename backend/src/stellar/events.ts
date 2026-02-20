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
    return {
      type: "trade",
      data: {
        marketId: Number(value?.["market_id"] ?? topics[1] ?? 0),
        user: String(value?.["user"] ?? ""),
        outcome: Number(value?.["outcome"] ?? 0),
        side: topics[0] === "buy" ? "BUY" : "SELL",
        shares: BigInt(String(value?.["shares"] ?? "0")),
        cost: BigInt(String(value?.["cost"] ?? "0")),
      },
    };
  }

  if (topics[0] === "market_created") {
    return {
      type: "market_created",
      data: {
        marketId: Number(value?.["market_id"] ?? 0),
        question: String(value?.["question"] ?? ""),
        numOutcomes: Number(value?.["num_outcomes"] ?? 2),
        endTime: Number(value?.["end_time"] ?? 0),
      },
    };
  }

  if (topics[0] === "resolved") {
    return {
      type: "resolved",
      data: {
        marketId: Number(value?.["market_id"] ?? topics[1] ?? 0),
        winningOutcome: Number(value?.["outcome"] ?? 0),
      },
    };
  }

  if (topics[0] === "deposit") {
    return {
      type: "deposit",
      data: {
        user: String(value?.["user"] ?? ""),
        amount: BigInt(String(value?.["amount"] ?? "0")),
      },
    };
  }

  if (topics[0] === "withdraw") {
    return {
      type: "withdraw",
      data: {
        user: String(value?.["user"] ?? ""),
        amount: BigInt(String(value?.["amount"] ?? "0")),
      },
    };
  }

  return { type: "unknown", data: null };
}
