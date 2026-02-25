import { rpc } from "@stellar/stellar-sdk";
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
 * Identify and parse a Soroban contract event.
 */
export declare function parseEvent(event: rpc.Api.EventResponse): {
    type: "trade";
    data: ParsedTradeEvent;
} | {
    type: "market_created";
    data: ParsedMarketCreatedEvent;
} | {
    type: "resolved";
    data: ParsedResolvedEvent;
} | {
    type: "deposit";
    data: ParsedDepositEvent;
} | {
    type: "withdraw";
    data: ParsedWithdrawEvent;
} | {
    type: "unknown";
    data: null;
};
