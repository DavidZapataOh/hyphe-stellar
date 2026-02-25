export declare const MarketStatus: {
    readonly OPEN: "OPEN";
    readonly CLOSED: "CLOSED";
    readonly RESOLVED: "RESOLVED";
    readonly DISPUTED: "DISPUTED";
};
export type MarketStatus = (typeof MarketStatus)[keyof typeof MarketStatus];
export declare const TradeSide: {
    readonly BUY: "BUY";
    readonly SELL: "SELL";
    readonly SPLIT: "SPLIT";
    readonly MERGE: "MERGE";
    readonly REDEEM: "REDEEM";
};
export type TradeSide = (typeof TradeSide)[keyof typeof TradeSide];
export declare const SubmissionStatus: {
    readonly PENDING: "PENDING";
    readonly SUBMITTED: "SUBMITTED";
    readonly FINALIZED: "FINALIZED";
    readonly DISPUTED: "DISPUTED";
    readonly FAILED: "FAILED";
};
export type SubmissionStatus = (typeof SubmissionStatus)[keyof typeof SubmissionStatus];
