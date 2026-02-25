import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models.js';
export type * from './prismaNamespace.js';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
/**
 * Helper for filtering JSON entries that have `null` on the database (empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const DbNull: import("@prisma/client-runtime-utils").DbNullClass;
/**
 * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
/**
 * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
export declare const ModelName: {
    readonly Market: "Market";
    readonly PriceSnapshot: "PriceSnapshot";
    readonly Trade: "Trade";
    readonly VaultSnapshot: "VaultSnapshot";
    readonly OracleSubmission: "OracleSubmission";
    readonly InfoFiSignal: "InfoFiSignal";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const MarketScalarFieldEnum: {
    readonly id: "id";
    readonly question: "question";
    readonly numOutcomes: "numOutcomes";
    readonly endTime: "endTime";
    readonly status: "status";
    readonly winningOutcome: "winningOutcome";
    readonly totalCollateral: "totalCollateral";
    readonly createdAt: "createdAt";
    readonly resolvedAt: "resolvedAt";
    readonly sportType: "sportType";
    readonly homeTeam: "homeTeam";
    readonly awayTeam: "awayTeam";
    readonly matchDate: "matchDate";
    readonly externalMatchId: "externalMatchId";
};
export type MarketScalarFieldEnum = (typeof MarketScalarFieldEnum)[keyof typeof MarketScalarFieldEnum];
export declare const PriceSnapshotScalarFieldEnum: {
    readonly id: "id";
    readonly marketId: "marketId";
    readonly yesPrice: "yesPrice";
    readonly noPrice: "noPrice";
    readonly timestamp: "timestamp";
};
export type PriceSnapshotScalarFieldEnum = (typeof PriceSnapshotScalarFieldEnum)[keyof typeof PriceSnapshotScalarFieldEnum];
export declare const TradeScalarFieldEnum: {
    readonly id: "id";
    readonly marketId: "marketId";
    readonly user: "user";
    readonly outcome: "outcome";
    readonly side: "side";
    readonly shares: "shares";
    readonly cost: "cost";
    readonly price: "price";
    readonly txHash: "txHash";
    readonly timestamp: "timestamp";
};
export type TradeScalarFieldEnum = (typeof TradeScalarFieldEnum)[keyof typeof TradeScalarFieldEnum];
export declare const VaultSnapshotScalarFieldEnum: {
    readonly id: "id";
    readonly tvl: "tvl";
    readonly blendBalance: "blendBalance";
    readonly bufferBalance: "bufferBalance";
    readonly yieldGenerated: "yieldGenerated";
    readonly yieldCumulative: "yieldCumulative";
    readonly apyEstimate: "apyEstimate";
    readonly timestamp: "timestamp";
};
export type VaultSnapshotScalarFieldEnum = (typeof VaultSnapshotScalarFieldEnum)[keyof typeof VaultSnapshotScalarFieldEnum];
export declare const OracleSubmissionScalarFieldEnum: {
    readonly id: "id";
    readonly marketId: "marketId";
    readonly outcome: "outcome";
    readonly source: "source";
    readonly rawData: "rawData";
    readonly txHash: "txHash";
    readonly status: "status";
    readonly submittedAt: "submittedAt";
    readonly finalizedAt: "finalizedAt";
};
export type OracleSubmissionScalarFieldEnum = (typeof OracleSubmissionScalarFieldEnum)[keyof typeof OracleSubmissionScalarFieldEnum];
export declare const InfoFiSignalScalarFieldEnum: {
    readonly id: "id";
    readonly marketId: "marketId";
    readonly signalType: "signalType";
    readonly entity: "entity";
    readonly value: "value";
    readonly description: "description";
    readonly confidence: "confidence";
    readonly timestamp: "timestamp";
};
export type InfoFiSignalScalarFieldEnum = (typeof InfoFiSignalScalarFieldEnum)[keyof typeof InfoFiSignalScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const JsonNullValueInput: {
    readonly JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
};
export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
export declare const JsonNullValueFilter: {
    readonly DbNull: import("@prisma/client-runtime-utils").DbNullClass;
    readonly JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
    readonly AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
};
export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter];
