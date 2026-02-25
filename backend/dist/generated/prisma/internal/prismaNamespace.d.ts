import * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../models.js";
import { type PrismaClient } from "./class.js";
export type * from '../models.js';
export type DMMF = typeof runtime.DMMF;
export type PrismaPromise<T> = runtime.Types.Public.PrismaPromise<T>;
/**
 * Prisma Errors
 */
export declare const PrismaClientKnownRequestError: typeof runtime.PrismaClientKnownRequestError;
export type PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
export declare const PrismaClientUnknownRequestError: typeof runtime.PrismaClientUnknownRequestError;
export type PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
export declare const PrismaClientRustPanicError: typeof runtime.PrismaClientRustPanicError;
export type PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
export declare const PrismaClientInitializationError: typeof runtime.PrismaClientInitializationError;
export type PrismaClientInitializationError = runtime.PrismaClientInitializationError;
export declare const PrismaClientValidationError: typeof runtime.PrismaClientValidationError;
export type PrismaClientValidationError = runtime.PrismaClientValidationError;
/**
 * Re-export of sql-template-tag
 */
export declare const sql: typeof runtime.sqltag;
export declare const empty: runtime.Sql;
export declare const join: typeof runtime.join;
export declare const raw: typeof runtime.raw;
export declare const Sql: typeof runtime.Sql;
export type Sql = runtime.Sql;
/**
 * Decimal.js
 */
export declare const Decimal: typeof runtime.Decimal;
export type Decimal = runtime.Decimal;
export type DecimalJsLike = runtime.DecimalJsLike;
/**
* Extensions
*/
export type Extension = runtime.Types.Extensions.UserArgs;
export declare const getExtensionContext: typeof runtime.Extensions.getExtensionContext;
export type Args<T, F extends runtime.Operation> = runtime.Types.Public.Args<T, F>;
export type Payload<T, F extends runtime.Operation = never> = runtime.Types.Public.Payload<T, F>;
export type Result<T, A, F extends runtime.Operation> = runtime.Types.Public.Result<T, A, F>;
export type Exact<A, W> = runtime.Types.Public.Exact<A, W>;
export type PrismaVersion = {
    client: string;
    engine: string;
};
/**
 * Prisma Client JS version: 7.4.1
 * Query Engine version: 55ae170b1ced7fc6ed07a15f110549408c501bb3
 */
export declare const prismaVersion: PrismaVersion;
/**
 * Utility Types
 */
export type Bytes = runtime.Bytes;
export type JsonObject = runtime.JsonObject;
export type JsonArray = runtime.JsonArray;
export type JsonValue = runtime.JsonValue;
export type InputJsonObject = runtime.InputJsonObject;
export type InputJsonArray = runtime.InputJsonArray;
export type InputJsonValue = runtime.InputJsonValue;
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
export declare const DbNull: runtime.DbNullClass;
/**
 * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const JsonNull: runtime.JsonNullClass;
/**
 * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const AnyNull: runtime.AnyNullClass;
type SelectAndInclude = {
    select: any;
    include: any;
};
type SelectAndOmit = {
    select: any;
    omit: any;
};
/**
 * From T, pick a set of properties whose keys are in the union K
 */
type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
export type Enumerable<T> = T | Array<T>;
/**
 * Subset
 * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
 */
export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
};
/**
 * SelectSubset
 * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
 * Additionally, it validates, if both select and include are present. If the case, it errors.
 */
export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & (T extends SelectAndInclude ? 'Please either choose `select` or `include`.' : T extends SelectAndOmit ? 'Please either choose `select` or `omit`.' : {});
/**
 * Subset + Intersection
 * @desc From `T` pick properties that exist in `U` and intersect `K`
 */
export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & K;
type Without<T, U> = {
    [P in Exclude<keyof T, keyof U>]?: never;
};
/**
 * XOR is needed to have a real mutually exclusive union type
 * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
 */
export type XOR<T, U> = T extends object ? U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : U : T;
/**
 * Is T a Record?
 */
type IsObject<T extends any> = T extends Array<any> ? False : T extends Date ? False : T extends Uint8Array ? False : T extends BigInt ? False : T extends object ? True : False;
/**
 * If it's T[], return T
 */
export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T;
/**
 * From ts-toolbelt
 */
type __Either<O extends object, K extends Key> = Omit<O, K> & {
    [P in K]: Prisma__Pick<O, P & keyof O>;
}[K];
type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;
type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>;
type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>;
    0: EitherLoose<O, K>;
}[strict];
export type Either<O extends object, K extends Key, strict extends Boolean = 1> = O extends unknown ? _Either<O, K, strict> : never;
export type Union = any;
export type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
} & {};
/** Helper Types for "Merge" **/
export type IntersectOf<U extends Union> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
} & {};
type _Merge<U extends object> = IntersectOf<Overwrite<U, {
    [K in keyof U]-?: At<U, K>;
}>>;
type Key = string | number | symbol;
type AtStrict<O extends object, K extends Key> = O[K & keyof O];
type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
    1: AtStrict<O, K>;
    0: AtLoose<O, K>;
}[strict];
export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
} & {};
export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
} & {};
type _Record<K extends keyof any, T> = {
    [P in K]: T;
};
type NoExpand<T> = T extends unknown ? T : never;
export type AtLeast<O extends object, K extends string> = NoExpand<O extends unknown ? (K extends keyof O ? {
    [P in K]: O[P];
} & O : O) | {
    [P in keyof O as P extends K ? P : never]-?: O[P];
} & O : never>;
type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;
export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
/** End Helper Types for "Merge" **/
export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;
export type Boolean = True | False;
export type True = 1;
export type False = 0;
export type Not<B extends Boolean> = {
    0: 1;
    1: 0;
}[B];
export type Extends<A1 extends any, A2 extends any> = [A1] extends [never] ? 0 : A1 extends A2 ? 1 : 0;
export type Has<U extends Union, U1 extends Union> = Not<Extends<Exclude<U1, U>, U1>>;
export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
        0: 0;
        1: 1;
    };
    1: {
        0: 1;
        1: 1;
    };
}[B1][B2];
export type Keys<U extends Union> = U extends unknown ? keyof U : never;
export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O ? O[P] : never;
} : never;
type FieldPaths<T, U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>> = IsObject<T> extends True ? U : T;
export type GetHavingFields<T> = {
    [K in keyof T]: Or<Or<Extends<'OR', K>, Extends<'AND', K>>, Extends<'NOT', K>> extends True ? T[K] extends infer TK ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never> : never : {} extends FieldPaths<T[K]> ? never : K;
}[keyof T];
/**
 * Convert tuple to union
 */
type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
export type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;
/**
 * Like `Pick`, but additionally can also accept an array of keys
 */
export type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>;
/**
 * Exclude all keys with underscores
 */
export type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T;
export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;
type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>;
export declare const ModelName: {
    readonly Market: "Market";
    readonly PriceSnapshot: "PriceSnapshot";
    readonly Trade: "Trade";
    readonly VaultSnapshot: "VaultSnapshot";
    readonly OracleSubmission: "OracleSubmission";
    readonly InfoFiSignal: "InfoFiSignal";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export interface TypeMapCb<GlobalOmitOptions = {}> extends runtime.Types.Utils.Fn<{
    extArgs: runtime.Types.Extensions.InternalArgs;
}, runtime.Types.Utils.Record<string, any>> {
    returns: TypeMap<this['params']['extArgs'], GlobalOmitOptions>;
}
export type TypeMap<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
        omit: GlobalOmitOptions;
    };
    meta: {
        modelProps: "market" | "priceSnapshot" | "trade" | "vaultSnapshot" | "oracleSubmission" | "infoFiSignal";
        txIsolationLevel: TransactionIsolationLevel;
    };
    model: {
        Market: {
            payload: Prisma.$MarketPayload<ExtArgs>;
            fields: Prisma.MarketFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.MarketFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MarketPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.MarketFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MarketPayload>;
                };
                findFirst: {
                    args: Prisma.MarketFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MarketPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.MarketFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MarketPayload>;
                };
                findMany: {
                    args: Prisma.MarketFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MarketPayload>[];
                };
                create: {
                    args: Prisma.MarketCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MarketPayload>;
                };
                createMany: {
                    args: Prisma.MarketCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.MarketCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MarketPayload>[];
                };
                delete: {
                    args: Prisma.MarketDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MarketPayload>;
                };
                update: {
                    args: Prisma.MarketUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MarketPayload>;
                };
                deleteMany: {
                    args: Prisma.MarketDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.MarketUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.MarketUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MarketPayload>[];
                };
                upsert: {
                    args: Prisma.MarketUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MarketPayload>;
                };
                aggregate: {
                    args: Prisma.MarketAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateMarket>;
                };
                groupBy: {
                    args: Prisma.MarketGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MarketGroupByOutputType>[];
                };
                count: {
                    args: Prisma.MarketCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MarketCountAggregateOutputType> | number;
                };
            };
        };
        PriceSnapshot: {
            payload: Prisma.$PriceSnapshotPayload<ExtArgs>;
            fields: Prisma.PriceSnapshotFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PriceSnapshotFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PriceSnapshotPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PriceSnapshotFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PriceSnapshotPayload>;
                };
                findFirst: {
                    args: Prisma.PriceSnapshotFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PriceSnapshotPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PriceSnapshotFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PriceSnapshotPayload>;
                };
                findMany: {
                    args: Prisma.PriceSnapshotFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PriceSnapshotPayload>[];
                };
                create: {
                    args: Prisma.PriceSnapshotCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PriceSnapshotPayload>;
                };
                createMany: {
                    args: Prisma.PriceSnapshotCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.PriceSnapshotCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PriceSnapshotPayload>[];
                };
                delete: {
                    args: Prisma.PriceSnapshotDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PriceSnapshotPayload>;
                };
                update: {
                    args: Prisma.PriceSnapshotUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PriceSnapshotPayload>;
                };
                deleteMany: {
                    args: Prisma.PriceSnapshotDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PriceSnapshotUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.PriceSnapshotUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PriceSnapshotPayload>[];
                };
                upsert: {
                    args: Prisma.PriceSnapshotUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PriceSnapshotPayload>;
                };
                aggregate: {
                    args: Prisma.PriceSnapshotAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePriceSnapshot>;
                };
                groupBy: {
                    args: Prisma.PriceSnapshotGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PriceSnapshotGroupByOutputType>[];
                };
                count: {
                    args: Prisma.PriceSnapshotCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PriceSnapshotCountAggregateOutputType> | number;
                };
            };
        };
        Trade: {
            payload: Prisma.$TradePayload<ExtArgs>;
            fields: Prisma.TradeFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.TradeFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TradePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.TradeFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TradePayload>;
                };
                findFirst: {
                    args: Prisma.TradeFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TradePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.TradeFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TradePayload>;
                };
                findMany: {
                    args: Prisma.TradeFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TradePayload>[];
                };
                create: {
                    args: Prisma.TradeCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TradePayload>;
                };
                createMany: {
                    args: Prisma.TradeCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.TradeCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TradePayload>[];
                };
                delete: {
                    args: Prisma.TradeDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TradePayload>;
                };
                update: {
                    args: Prisma.TradeUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TradePayload>;
                };
                deleteMany: {
                    args: Prisma.TradeDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.TradeUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.TradeUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TradePayload>[];
                };
                upsert: {
                    args: Prisma.TradeUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TradePayload>;
                };
                aggregate: {
                    args: Prisma.TradeAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateTrade>;
                };
                groupBy: {
                    args: Prisma.TradeGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TradeGroupByOutputType>[];
                };
                count: {
                    args: Prisma.TradeCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TradeCountAggregateOutputType> | number;
                };
            };
        };
        VaultSnapshot: {
            payload: Prisma.$VaultSnapshotPayload<ExtArgs>;
            fields: Prisma.VaultSnapshotFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.VaultSnapshotFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VaultSnapshotPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.VaultSnapshotFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VaultSnapshotPayload>;
                };
                findFirst: {
                    args: Prisma.VaultSnapshotFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VaultSnapshotPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.VaultSnapshotFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VaultSnapshotPayload>;
                };
                findMany: {
                    args: Prisma.VaultSnapshotFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VaultSnapshotPayload>[];
                };
                create: {
                    args: Prisma.VaultSnapshotCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VaultSnapshotPayload>;
                };
                createMany: {
                    args: Prisma.VaultSnapshotCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.VaultSnapshotCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VaultSnapshotPayload>[];
                };
                delete: {
                    args: Prisma.VaultSnapshotDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VaultSnapshotPayload>;
                };
                update: {
                    args: Prisma.VaultSnapshotUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VaultSnapshotPayload>;
                };
                deleteMany: {
                    args: Prisma.VaultSnapshotDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.VaultSnapshotUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.VaultSnapshotUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VaultSnapshotPayload>[];
                };
                upsert: {
                    args: Prisma.VaultSnapshotUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$VaultSnapshotPayload>;
                };
                aggregate: {
                    args: Prisma.VaultSnapshotAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateVaultSnapshot>;
                };
                groupBy: {
                    args: Prisma.VaultSnapshotGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.VaultSnapshotGroupByOutputType>[];
                };
                count: {
                    args: Prisma.VaultSnapshotCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.VaultSnapshotCountAggregateOutputType> | number;
                };
            };
        };
        OracleSubmission: {
            payload: Prisma.$OracleSubmissionPayload<ExtArgs>;
            fields: Prisma.OracleSubmissionFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.OracleSubmissionFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OracleSubmissionPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.OracleSubmissionFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OracleSubmissionPayload>;
                };
                findFirst: {
                    args: Prisma.OracleSubmissionFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OracleSubmissionPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.OracleSubmissionFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OracleSubmissionPayload>;
                };
                findMany: {
                    args: Prisma.OracleSubmissionFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OracleSubmissionPayload>[];
                };
                create: {
                    args: Prisma.OracleSubmissionCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OracleSubmissionPayload>;
                };
                createMany: {
                    args: Prisma.OracleSubmissionCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.OracleSubmissionCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OracleSubmissionPayload>[];
                };
                delete: {
                    args: Prisma.OracleSubmissionDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OracleSubmissionPayload>;
                };
                update: {
                    args: Prisma.OracleSubmissionUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OracleSubmissionPayload>;
                };
                deleteMany: {
                    args: Prisma.OracleSubmissionDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.OracleSubmissionUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.OracleSubmissionUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OracleSubmissionPayload>[];
                };
                upsert: {
                    args: Prisma.OracleSubmissionUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OracleSubmissionPayload>;
                };
                aggregate: {
                    args: Prisma.OracleSubmissionAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateOracleSubmission>;
                };
                groupBy: {
                    args: Prisma.OracleSubmissionGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.OracleSubmissionGroupByOutputType>[];
                };
                count: {
                    args: Prisma.OracleSubmissionCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.OracleSubmissionCountAggregateOutputType> | number;
                };
            };
        };
        InfoFiSignal: {
            payload: Prisma.$InfoFiSignalPayload<ExtArgs>;
            fields: Prisma.InfoFiSignalFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.InfoFiSignalFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InfoFiSignalPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.InfoFiSignalFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InfoFiSignalPayload>;
                };
                findFirst: {
                    args: Prisma.InfoFiSignalFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InfoFiSignalPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.InfoFiSignalFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InfoFiSignalPayload>;
                };
                findMany: {
                    args: Prisma.InfoFiSignalFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InfoFiSignalPayload>[];
                };
                create: {
                    args: Prisma.InfoFiSignalCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InfoFiSignalPayload>;
                };
                createMany: {
                    args: Prisma.InfoFiSignalCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.InfoFiSignalCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InfoFiSignalPayload>[];
                };
                delete: {
                    args: Prisma.InfoFiSignalDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InfoFiSignalPayload>;
                };
                update: {
                    args: Prisma.InfoFiSignalUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InfoFiSignalPayload>;
                };
                deleteMany: {
                    args: Prisma.InfoFiSignalDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.InfoFiSignalUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.InfoFiSignalUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InfoFiSignalPayload>[];
                };
                upsert: {
                    args: Prisma.InfoFiSignalUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InfoFiSignalPayload>;
                };
                aggregate: {
                    args: Prisma.InfoFiSignalAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateInfoFiSignal>;
                };
                groupBy: {
                    args: Prisma.InfoFiSignalGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.InfoFiSignalGroupByOutputType>[];
                };
                count: {
                    args: Prisma.InfoFiSignalCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.InfoFiSignalCountAggregateOutputType> | number;
                };
            };
        };
    };
} & {
    other: {
        payload: any;
        operations: {
            $executeRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $executeRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
            $queryRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $queryRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
        };
    };
};
/**
 * Enums
 */
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
    readonly JsonNull: runtime.JsonNullClass;
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
    readonly DbNull: runtime.DbNullClass;
    readonly JsonNull: runtime.JsonNullClass;
    readonly AnyNull: runtime.AnyNullClass;
};
export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter];
/**
 * Field references
 */
/**
 * Reference to a field of type 'Int'
 */
export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>;
/**
 * Reference to a field of type 'Int[]'
 */
export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>;
/**
 * Reference to a field of type 'String'
 */
export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>;
/**
 * Reference to a field of type 'String[]'
 */
export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>;
/**
 * Reference to a field of type 'DateTime'
 */
export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>;
/**
 * Reference to a field of type 'DateTime[]'
 */
export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>;
/**
 * Reference to a field of type 'MarketStatus'
 */
export type EnumMarketStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MarketStatus'>;
/**
 * Reference to a field of type 'MarketStatus[]'
 */
export type ListEnumMarketStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MarketStatus[]'>;
/**
 * Reference to a field of type 'BigInt'
 */
export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>;
/**
 * Reference to a field of type 'BigInt[]'
 */
export type ListBigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt[]'>;
/**
 * Reference to a field of type 'Float'
 */
export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>;
/**
 * Reference to a field of type 'Float[]'
 */
export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>;
/**
 * Reference to a field of type 'TradeSide'
 */
export type EnumTradeSideFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TradeSide'>;
/**
 * Reference to a field of type 'TradeSide[]'
 */
export type ListEnumTradeSideFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TradeSide[]'>;
/**
 * Reference to a field of type 'Json'
 */
export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>;
/**
 * Reference to a field of type 'QueryMode'
 */
export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>;
/**
 * Reference to a field of type 'SubmissionStatus'
 */
export type EnumSubmissionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SubmissionStatus'>;
/**
 * Reference to a field of type 'SubmissionStatus[]'
 */
export type ListEnumSubmissionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SubmissionStatus[]'>;
/**
 * Batch Payload for updateMany & deleteMany & createMany
 */
export type BatchPayload = {
    count: number;
};
export declare const defineExtension: runtime.Types.Extensions.ExtendsHook<"define", TypeMapCb, runtime.Types.Extensions.DefaultArgs>;
export type DefaultPrismaClient = PrismaClient;
export type ErrorFormat = 'pretty' | 'colorless' | 'minimal';
export type PrismaClientOptions = ({
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-pg`.
     */
    adapter: runtime.SqlDriverAdapterFactory;
    accelerateUrl?: never;
} | {
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl: string;
    adapter?: never;
}) & {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat;
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     *
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     *
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     *
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[];
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: TransactionIsolationLevel;
    };
    /**
     * Global configuration for omitting model fields by default.
     *
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: GlobalOmitConfig;
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     *
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[];
};
export type GlobalOmitConfig = {
    market?: Prisma.MarketOmit;
    priceSnapshot?: Prisma.PriceSnapshotOmit;
    trade?: Prisma.TradeOmit;
    vaultSnapshot?: Prisma.VaultSnapshotOmit;
    oracleSubmission?: Prisma.OracleSubmissionOmit;
    infoFiSignal?: Prisma.InfoFiSignalOmit;
};
export type LogLevel = 'info' | 'query' | 'warn' | 'error';
export type LogDefinition = {
    level: LogLevel;
    emit: 'stdout' | 'event';
};
export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;
export type GetLogType<T> = CheckIsLogLevel<T extends LogDefinition ? T['level'] : T>;
export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition> ? GetLogType<T[number]> : never;
export type QueryEvent = {
    timestamp: Date;
    query: string;
    params: string;
    duration: number;
    target: string;
};
export type LogEvent = {
    timestamp: Date;
    message: string;
    target: string;
};
export type PrismaAction = 'findUnique' | 'findUniqueOrThrow' | 'findMany' | 'findFirst' | 'findFirstOrThrow' | 'create' | 'createMany' | 'createManyAndReturn' | 'update' | 'updateMany' | 'updateManyAndReturn' | 'upsert' | 'delete' | 'deleteMany' | 'executeRaw' | 'queryRaw' | 'aggregate' | 'count' | 'runCommandRaw' | 'findRaw' | 'groupBy';
/**
 * `PrismaClient` proxy available in interactive transactions.
 */
export type TransactionClient = Omit<DefaultPrismaClient, runtime.ITXClientDenyList>;
