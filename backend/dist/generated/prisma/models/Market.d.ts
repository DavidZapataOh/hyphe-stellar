import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model Market
 *
 */
export type MarketModel = runtime.Types.Result.DefaultSelection<Prisma.$MarketPayload>;
export type AggregateMarket = {
    _count: MarketCountAggregateOutputType | null;
    _avg: MarketAvgAggregateOutputType | null;
    _sum: MarketSumAggregateOutputType | null;
    _min: MarketMinAggregateOutputType | null;
    _max: MarketMaxAggregateOutputType | null;
};
export type MarketAvgAggregateOutputType = {
    id: number | null;
    numOutcomes: number | null;
    winningOutcome: number | null;
    totalCollateral: number | null;
};
export type MarketSumAggregateOutputType = {
    id: number | null;
    numOutcomes: number | null;
    winningOutcome: number | null;
    totalCollateral: bigint | null;
};
export type MarketMinAggregateOutputType = {
    id: number | null;
    question: string | null;
    numOutcomes: number | null;
    endTime: Date | null;
    status: $Enums.MarketStatus | null;
    winningOutcome: number | null;
    totalCollateral: bigint | null;
    createdAt: Date | null;
    resolvedAt: Date | null;
    sportType: string | null;
    homeTeam: string | null;
    awayTeam: string | null;
    matchDate: Date | null;
    externalMatchId: string | null;
};
export type MarketMaxAggregateOutputType = {
    id: number | null;
    question: string | null;
    numOutcomes: number | null;
    endTime: Date | null;
    status: $Enums.MarketStatus | null;
    winningOutcome: number | null;
    totalCollateral: bigint | null;
    createdAt: Date | null;
    resolvedAt: Date | null;
    sportType: string | null;
    homeTeam: string | null;
    awayTeam: string | null;
    matchDate: Date | null;
    externalMatchId: string | null;
};
export type MarketCountAggregateOutputType = {
    id: number;
    question: number;
    numOutcomes: number;
    endTime: number;
    status: number;
    winningOutcome: number;
    totalCollateral: number;
    createdAt: number;
    resolvedAt: number;
    sportType: number;
    homeTeam: number;
    awayTeam: number;
    matchDate: number;
    externalMatchId: number;
    _all: number;
};
export type MarketAvgAggregateInputType = {
    id?: true;
    numOutcomes?: true;
    winningOutcome?: true;
    totalCollateral?: true;
};
export type MarketSumAggregateInputType = {
    id?: true;
    numOutcomes?: true;
    winningOutcome?: true;
    totalCollateral?: true;
};
export type MarketMinAggregateInputType = {
    id?: true;
    question?: true;
    numOutcomes?: true;
    endTime?: true;
    status?: true;
    winningOutcome?: true;
    totalCollateral?: true;
    createdAt?: true;
    resolvedAt?: true;
    sportType?: true;
    homeTeam?: true;
    awayTeam?: true;
    matchDate?: true;
    externalMatchId?: true;
};
export type MarketMaxAggregateInputType = {
    id?: true;
    question?: true;
    numOutcomes?: true;
    endTime?: true;
    status?: true;
    winningOutcome?: true;
    totalCollateral?: true;
    createdAt?: true;
    resolvedAt?: true;
    sportType?: true;
    homeTeam?: true;
    awayTeam?: true;
    matchDate?: true;
    externalMatchId?: true;
};
export type MarketCountAggregateInputType = {
    id?: true;
    question?: true;
    numOutcomes?: true;
    endTime?: true;
    status?: true;
    winningOutcome?: true;
    totalCollateral?: true;
    createdAt?: true;
    resolvedAt?: true;
    sportType?: true;
    homeTeam?: true;
    awayTeam?: true;
    matchDate?: true;
    externalMatchId?: true;
    _all?: true;
};
export type MarketAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Market to aggregate.
     */
    where?: Prisma.MarketWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Markets to fetch.
     */
    orderBy?: Prisma.MarketOrderByWithRelationInput | Prisma.MarketOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.MarketWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Markets from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Markets.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Markets
    **/
    _count?: true | MarketCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: MarketAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: MarketSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: MarketMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: MarketMaxAggregateInputType;
};
export type GetMarketAggregateType<T extends MarketAggregateArgs> = {
    [P in keyof T & keyof AggregateMarket]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateMarket[P]> : Prisma.GetScalarType<T[P], AggregateMarket[P]>;
};
export type MarketGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MarketWhereInput;
    orderBy?: Prisma.MarketOrderByWithAggregationInput | Prisma.MarketOrderByWithAggregationInput[];
    by: Prisma.MarketScalarFieldEnum[] | Prisma.MarketScalarFieldEnum;
    having?: Prisma.MarketScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: MarketCountAggregateInputType | true;
    _avg?: MarketAvgAggregateInputType;
    _sum?: MarketSumAggregateInputType;
    _min?: MarketMinAggregateInputType;
    _max?: MarketMaxAggregateInputType;
};
export type MarketGroupByOutputType = {
    id: number;
    question: string;
    numOutcomes: number;
    endTime: Date;
    status: $Enums.MarketStatus;
    winningOutcome: number | null;
    totalCollateral: bigint;
    createdAt: Date;
    resolvedAt: Date | null;
    sportType: string | null;
    homeTeam: string | null;
    awayTeam: string | null;
    matchDate: Date | null;
    externalMatchId: string | null;
    _count: MarketCountAggregateOutputType | null;
    _avg: MarketAvgAggregateOutputType | null;
    _sum: MarketSumAggregateOutputType | null;
    _min: MarketMinAggregateOutputType | null;
    _max: MarketMaxAggregateOutputType | null;
};
type GetMarketGroupByPayload<T extends MarketGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<MarketGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof MarketGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], MarketGroupByOutputType[P]> : Prisma.GetScalarType<T[P], MarketGroupByOutputType[P]>;
}>>;
export type MarketWhereInput = {
    AND?: Prisma.MarketWhereInput | Prisma.MarketWhereInput[];
    OR?: Prisma.MarketWhereInput[];
    NOT?: Prisma.MarketWhereInput | Prisma.MarketWhereInput[];
    id?: Prisma.IntFilter<"Market"> | number;
    question?: Prisma.StringFilter<"Market"> | string;
    numOutcomes?: Prisma.IntFilter<"Market"> | number;
    endTime?: Prisma.DateTimeFilter<"Market"> | Date | string;
    status?: Prisma.EnumMarketStatusFilter<"Market"> | $Enums.MarketStatus;
    winningOutcome?: Prisma.IntNullableFilter<"Market"> | number | null;
    totalCollateral?: Prisma.BigIntFilter<"Market"> | bigint | number;
    createdAt?: Prisma.DateTimeFilter<"Market"> | Date | string;
    resolvedAt?: Prisma.DateTimeNullableFilter<"Market"> | Date | string | null;
    sportType?: Prisma.StringNullableFilter<"Market"> | string | null;
    homeTeam?: Prisma.StringNullableFilter<"Market"> | string | null;
    awayTeam?: Prisma.StringNullableFilter<"Market"> | string | null;
    matchDate?: Prisma.DateTimeNullableFilter<"Market"> | Date | string | null;
    externalMatchId?: Prisma.StringNullableFilter<"Market"> | string | null;
    priceHistory?: Prisma.PriceSnapshotListRelationFilter;
    trades?: Prisma.TradeListRelationFilter;
    signals?: Prisma.InfoFiSignalListRelationFilter;
};
export type MarketOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    question?: Prisma.SortOrder;
    numOutcomes?: Prisma.SortOrder;
    endTime?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    winningOutcome?: Prisma.SortOrderInput | Prisma.SortOrder;
    totalCollateral?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    resolvedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    sportType?: Prisma.SortOrderInput | Prisma.SortOrder;
    homeTeam?: Prisma.SortOrderInput | Prisma.SortOrder;
    awayTeam?: Prisma.SortOrderInput | Prisma.SortOrder;
    matchDate?: Prisma.SortOrderInput | Prisma.SortOrder;
    externalMatchId?: Prisma.SortOrderInput | Prisma.SortOrder;
    priceHistory?: Prisma.PriceSnapshotOrderByRelationAggregateInput;
    trades?: Prisma.TradeOrderByRelationAggregateInput;
    signals?: Prisma.InfoFiSignalOrderByRelationAggregateInput;
};
export type MarketWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    AND?: Prisma.MarketWhereInput | Prisma.MarketWhereInput[];
    OR?: Prisma.MarketWhereInput[];
    NOT?: Prisma.MarketWhereInput | Prisma.MarketWhereInput[];
    question?: Prisma.StringFilter<"Market"> | string;
    numOutcomes?: Prisma.IntFilter<"Market"> | number;
    endTime?: Prisma.DateTimeFilter<"Market"> | Date | string;
    status?: Prisma.EnumMarketStatusFilter<"Market"> | $Enums.MarketStatus;
    winningOutcome?: Prisma.IntNullableFilter<"Market"> | number | null;
    totalCollateral?: Prisma.BigIntFilter<"Market"> | bigint | number;
    createdAt?: Prisma.DateTimeFilter<"Market"> | Date | string;
    resolvedAt?: Prisma.DateTimeNullableFilter<"Market"> | Date | string | null;
    sportType?: Prisma.StringNullableFilter<"Market"> | string | null;
    homeTeam?: Prisma.StringNullableFilter<"Market"> | string | null;
    awayTeam?: Prisma.StringNullableFilter<"Market"> | string | null;
    matchDate?: Prisma.DateTimeNullableFilter<"Market"> | Date | string | null;
    externalMatchId?: Prisma.StringNullableFilter<"Market"> | string | null;
    priceHistory?: Prisma.PriceSnapshotListRelationFilter;
    trades?: Prisma.TradeListRelationFilter;
    signals?: Prisma.InfoFiSignalListRelationFilter;
}, "id">;
export type MarketOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    question?: Prisma.SortOrder;
    numOutcomes?: Prisma.SortOrder;
    endTime?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    winningOutcome?: Prisma.SortOrderInput | Prisma.SortOrder;
    totalCollateral?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    resolvedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    sportType?: Prisma.SortOrderInput | Prisma.SortOrder;
    homeTeam?: Prisma.SortOrderInput | Prisma.SortOrder;
    awayTeam?: Prisma.SortOrderInput | Prisma.SortOrder;
    matchDate?: Prisma.SortOrderInput | Prisma.SortOrder;
    externalMatchId?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.MarketCountOrderByAggregateInput;
    _avg?: Prisma.MarketAvgOrderByAggregateInput;
    _max?: Prisma.MarketMaxOrderByAggregateInput;
    _min?: Prisma.MarketMinOrderByAggregateInput;
    _sum?: Prisma.MarketSumOrderByAggregateInput;
};
export type MarketScalarWhereWithAggregatesInput = {
    AND?: Prisma.MarketScalarWhereWithAggregatesInput | Prisma.MarketScalarWhereWithAggregatesInput[];
    OR?: Prisma.MarketScalarWhereWithAggregatesInput[];
    NOT?: Prisma.MarketScalarWhereWithAggregatesInput | Prisma.MarketScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"Market"> | number;
    question?: Prisma.StringWithAggregatesFilter<"Market"> | string;
    numOutcomes?: Prisma.IntWithAggregatesFilter<"Market"> | number;
    endTime?: Prisma.DateTimeWithAggregatesFilter<"Market"> | Date | string;
    status?: Prisma.EnumMarketStatusWithAggregatesFilter<"Market"> | $Enums.MarketStatus;
    winningOutcome?: Prisma.IntNullableWithAggregatesFilter<"Market"> | number | null;
    totalCollateral?: Prisma.BigIntWithAggregatesFilter<"Market"> | bigint | number;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Market"> | Date | string;
    resolvedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"Market"> | Date | string | null;
    sportType?: Prisma.StringNullableWithAggregatesFilter<"Market"> | string | null;
    homeTeam?: Prisma.StringNullableWithAggregatesFilter<"Market"> | string | null;
    awayTeam?: Prisma.StringNullableWithAggregatesFilter<"Market"> | string | null;
    matchDate?: Prisma.DateTimeNullableWithAggregatesFilter<"Market"> | Date | string | null;
    externalMatchId?: Prisma.StringNullableWithAggregatesFilter<"Market"> | string | null;
};
export type MarketCreateInput = {
    id: number;
    question: string;
    numOutcomes: number;
    endTime: Date | string;
    status?: $Enums.MarketStatus;
    winningOutcome?: number | null;
    totalCollateral?: bigint | number;
    createdAt?: Date | string;
    resolvedAt?: Date | string | null;
    sportType?: string | null;
    homeTeam?: string | null;
    awayTeam?: string | null;
    matchDate?: Date | string | null;
    externalMatchId?: string | null;
    priceHistory?: Prisma.PriceSnapshotCreateNestedManyWithoutMarketInput;
    trades?: Prisma.TradeCreateNestedManyWithoutMarketInput;
    signals?: Prisma.InfoFiSignalCreateNestedManyWithoutMarketInput;
};
export type MarketUncheckedCreateInput = {
    id: number;
    question: string;
    numOutcomes: number;
    endTime: Date | string;
    status?: $Enums.MarketStatus;
    winningOutcome?: number | null;
    totalCollateral?: bigint | number;
    createdAt?: Date | string;
    resolvedAt?: Date | string | null;
    sportType?: string | null;
    homeTeam?: string | null;
    awayTeam?: string | null;
    matchDate?: Date | string | null;
    externalMatchId?: string | null;
    priceHistory?: Prisma.PriceSnapshotUncheckedCreateNestedManyWithoutMarketInput;
    trades?: Prisma.TradeUncheckedCreateNestedManyWithoutMarketInput;
    signals?: Prisma.InfoFiSignalUncheckedCreateNestedManyWithoutMarketInput;
};
export type MarketUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    question?: Prisma.StringFieldUpdateOperationsInput | string;
    numOutcomes?: Prisma.IntFieldUpdateOperationsInput | number;
    endTime?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumMarketStatusFieldUpdateOperationsInput | $Enums.MarketStatus;
    winningOutcome?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    totalCollateral?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    sportType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    homeTeam?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    awayTeam?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    matchDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    externalMatchId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    priceHistory?: Prisma.PriceSnapshotUpdateManyWithoutMarketNestedInput;
    trades?: Prisma.TradeUpdateManyWithoutMarketNestedInput;
    signals?: Prisma.InfoFiSignalUpdateManyWithoutMarketNestedInput;
};
export type MarketUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    question?: Prisma.StringFieldUpdateOperationsInput | string;
    numOutcomes?: Prisma.IntFieldUpdateOperationsInput | number;
    endTime?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumMarketStatusFieldUpdateOperationsInput | $Enums.MarketStatus;
    winningOutcome?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    totalCollateral?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    sportType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    homeTeam?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    awayTeam?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    matchDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    externalMatchId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    priceHistory?: Prisma.PriceSnapshotUncheckedUpdateManyWithoutMarketNestedInput;
    trades?: Prisma.TradeUncheckedUpdateManyWithoutMarketNestedInput;
    signals?: Prisma.InfoFiSignalUncheckedUpdateManyWithoutMarketNestedInput;
};
export type MarketCreateManyInput = {
    id: number;
    question: string;
    numOutcomes: number;
    endTime: Date | string;
    status?: $Enums.MarketStatus;
    winningOutcome?: number | null;
    totalCollateral?: bigint | number;
    createdAt?: Date | string;
    resolvedAt?: Date | string | null;
    sportType?: string | null;
    homeTeam?: string | null;
    awayTeam?: string | null;
    matchDate?: Date | string | null;
    externalMatchId?: string | null;
};
export type MarketUpdateManyMutationInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    question?: Prisma.StringFieldUpdateOperationsInput | string;
    numOutcomes?: Prisma.IntFieldUpdateOperationsInput | number;
    endTime?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumMarketStatusFieldUpdateOperationsInput | $Enums.MarketStatus;
    winningOutcome?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    totalCollateral?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    sportType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    homeTeam?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    awayTeam?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    matchDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    externalMatchId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type MarketUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    question?: Prisma.StringFieldUpdateOperationsInput | string;
    numOutcomes?: Prisma.IntFieldUpdateOperationsInput | number;
    endTime?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumMarketStatusFieldUpdateOperationsInput | $Enums.MarketStatus;
    winningOutcome?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    totalCollateral?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    sportType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    homeTeam?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    awayTeam?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    matchDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    externalMatchId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type MarketCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    question?: Prisma.SortOrder;
    numOutcomes?: Prisma.SortOrder;
    endTime?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    winningOutcome?: Prisma.SortOrder;
    totalCollateral?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    resolvedAt?: Prisma.SortOrder;
    sportType?: Prisma.SortOrder;
    homeTeam?: Prisma.SortOrder;
    awayTeam?: Prisma.SortOrder;
    matchDate?: Prisma.SortOrder;
    externalMatchId?: Prisma.SortOrder;
};
export type MarketAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    numOutcomes?: Prisma.SortOrder;
    winningOutcome?: Prisma.SortOrder;
    totalCollateral?: Prisma.SortOrder;
};
export type MarketMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    question?: Prisma.SortOrder;
    numOutcomes?: Prisma.SortOrder;
    endTime?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    winningOutcome?: Prisma.SortOrder;
    totalCollateral?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    resolvedAt?: Prisma.SortOrder;
    sportType?: Prisma.SortOrder;
    homeTeam?: Prisma.SortOrder;
    awayTeam?: Prisma.SortOrder;
    matchDate?: Prisma.SortOrder;
    externalMatchId?: Prisma.SortOrder;
};
export type MarketMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    question?: Prisma.SortOrder;
    numOutcomes?: Prisma.SortOrder;
    endTime?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    winningOutcome?: Prisma.SortOrder;
    totalCollateral?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    resolvedAt?: Prisma.SortOrder;
    sportType?: Prisma.SortOrder;
    homeTeam?: Prisma.SortOrder;
    awayTeam?: Prisma.SortOrder;
    matchDate?: Prisma.SortOrder;
    externalMatchId?: Prisma.SortOrder;
};
export type MarketSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    numOutcomes?: Prisma.SortOrder;
    winningOutcome?: Prisma.SortOrder;
    totalCollateral?: Prisma.SortOrder;
};
export type MarketScalarRelationFilter = {
    is?: Prisma.MarketWhereInput;
    isNot?: Prisma.MarketWhereInput;
};
export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type StringFieldUpdateOperationsInput = {
    set?: string;
};
export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
};
export type EnumMarketStatusFieldUpdateOperationsInput = {
    set?: $Enums.MarketStatus;
};
export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number;
    increment?: bigint | number;
    decrement?: bigint | number;
    multiply?: bigint | number;
    divide?: bigint | number;
};
export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null;
};
export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
};
export type MarketCreateNestedOneWithoutPriceHistoryInput = {
    create?: Prisma.XOR<Prisma.MarketCreateWithoutPriceHistoryInput, Prisma.MarketUncheckedCreateWithoutPriceHistoryInput>;
    connectOrCreate?: Prisma.MarketCreateOrConnectWithoutPriceHistoryInput;
    connect?: Prisma.MarketWhereUniqueInput;
};
export type MarketUpdateOneRequiredWithoutPriceHistoryNestedInput = {
    create?: Prisma.XOR<Prisma.MarketCreateWithoutPriceHistoryInput, Prisma.MarketUncheckedCreateWithoutPriceHistoryInput>;
    connectOrCreate?: Prisma.MarketCreateOrConnectWithoutPriceHistoryInput;
    upsert?: Prisma.MarketUpsertWithoutPriceHistoryInput;
    connect?: Prisma.MarketWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.MarketUpdateToOneWithWhereWithoutPriceHistoryInput, Prisma.MarketUpdateWithoutPriceHistoryInput>, Prisma.MarketUncheckedUpdateWithoutPriceHistoryInput>;
};
export type MarketCreateNestedOneWithoutTradesInput = {
    create?: Prisma.XOR<Prisma.MarketCreateWithoutTradesInput, Prisma.MarketUncheckedCreateWithoutTradesInput>;
    connectOrCreate?: Prisma.MarketCreateOrConnectWithoutTradesInput;
    connect?: Prisma.MarketWhereUniqueInput;
};
export type MarketUpdateOneRequiredWithoutTradesNestedInput = {
    create?: Prisma.XOR<Prisma.MarketCreateWithoutTradesInput, Prisma.MarketUncheckedCreateWithoutTradesInput>;
    connectOrCreate?: Prisma.MarketCreateOrConnectWithoutTradesInput;
    upsert?: Prisma.MarketUpsertWithoutTradesInput;
    connect?: Prisma.MarketWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.MarketUpdateToOneWithWhereWithoutTradesInput, Prisma.MarketUpdateWithoutTradesInput>, Prisma.MarketUncheckedUpdateWithoutTradesInput>;
};
export type MarketCreateNestedOneWithoutSignalsInput = {
    create?: Prisma.XOR<Prisma.MarketCreateWithoutSignalsInput, Prisma.MarketUncheckedCreateWithoutSignalsInput>;
    connectOrCreate?: Prisma.MarketCreateOrConnectWithoutSignalsInput;
    connect?: Prisma.MarketWhereUniqueInput;
};
export type MarketUpdateOneRequiredWithoutSignalsNestedInput = {
    create?: Prisma.XOR<Prisma.MarketCreateWithoutSignalsInput, Prisma.MarketUncheckedCreateWithoutSignalsInput>;
    connectOrCreate?: Prisma.MarketCreateOrConnectWithoutSignalsInput;
    upsert?: Prisma.MarketUpsertWithoutSignalsInput;
    connect?: Prisma.MarketWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.MarketUpdateToOneWithWhereWithoutSignalsInput, Prisma.MarketUpdateWithoutSignalsInput>, Prisma.MarketUncheckedUpdateWithoutSignalsInput>;
};
export type MarketCreateWithoutPriceHistoryInput = {
    id: number;
    question: string;
    numOutcomes: number;
    endTime: Date | string;
    status?: $Enums.MarketStatus;
    winningOutcome?: number | null;
    totalCollateral?: bigint | number;
    createdAt?: Date | string;
    resolvedAt?: Date | string | null;
    sportType?: string | null;
    homeTeam?: string | null;
    awayTeam?: string | null;
    matchDate?: Date | string | null;
    externalMatchId?: string | null;
    trades?: Prisma.TradeCreateNestedManyWithoutMarketInput;
    signals?: Prisma.InfoFiSignalCreateNestedManyWithoutMarketInput;
};
export type MarketUncheckedCreateWithoutPriceHistoryInput = {
    id: number;
    question: string;
    numOutcomes: number;
    endTime: Date | string;
    status?: $Enums.MarketStatus;
    winningOutcome?: number | null;
    totalCollateral?: bigint | number;
    createdAt?: Date | string;
    resolvedAt?: Date | string | null;
    sportType?: string | null;
    homeTeam?: string | null;
    awayTeam?: string | null;
    matchDate?: Date | string | null;
    externalMatchId?: string | null;
    trades?: Prisma.TradeUncheckedCreateNestedManyWithoutMarketInput;
    signals?: Prisma.InfoFiSignalUncheckedCreateNestedManyWithoutMarketInput;
};
export type MarketCreateOrConnectWithoutPriceHistoryInput = {
    where: Prisma.MarketWhereUniqueInput;
    create: Prisma.XOR<Prisma.MarketCreateWithoutPriceHistoryInput, Prisma.MarketUncheckedCreateWithoutPriceHistoryInput>;
};
export type MarketUpsertWithoutPriceHistoryInput = {
    update: Prisma.XOR<Prisma.MarketUpdateWithoutPriceHistoryInput, Prisma.MarketUncheckedUpdateWithoutPriceHistoryInput>;
    create: Prisma.XOR<Prisma.MarketCreateWithoutPriceHistoryInput, Prisma.MarketUncheckedCreateWithoutPriceHistoryInput>;
    where?: Prisma.MarketWhereInput;
};
export type MarketUpdateToOneWithWhereWithoutPriceHistoryInput = {
    where?: Prisma.MarketWhereInput;
    data: Prisma.XOR<Prisma.MarketUpdateWithoutPriceHistoryInput, Prisma.MarketUncheckedUpdateWithoutPriceHistoryInput>;
};
export type MarketUpdateWithoutPriceHistoryInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    question?: Prisma.StringFieldUpdateOperationsInput | string;
    numOutcomes?: Prisma.IntFieldUpdateOperationsInput | number;
    endTime?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumMarketStatusFieldUpdateOperationsInput | $Enums.MarketStatus;
    winningOutcome?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    totalCollateral?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    sportType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    homeTeam?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    awayTeam?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    matchDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    externalMatchId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    trades?: Prisma.TradeUpdateManyWithoutMarketNestedInput;
    signals?: Prisma.InfoFiSignalUpdateManyWithoutMarketNestedInput;
};
export type MarketUncheckedUpdateWithoutPriceHistoryInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    question?: Prisma.StringFieldUpdateOperationsInput | string;
    numOutcomes?: Prisma.IntFieldUpdateOperationsInput | number;
    endTime?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumMarketStatusFieldUpdateOperationsInput | $Enums.MarketStatus;
    winningOutcome?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    totalCollateral?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    sportType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    homeTeam?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    awayTeam?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    matchDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    externalMatchId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    trades?: Prisma.TradeUncheckedUpdateManyWithoutMarketNestedInput;
    signals?: Prisma.InfoFiSignalUncheckedUpdateManyWithoutMarketNestedInput;
};
export type MarketCreateWithoutTradesInput = {
    id: number;
    question: string;
    numOutcomes: number;
    endTime: Date | string;
    status?: $Enums.MarketStatus;
    winningOutcome?: number | null;
    totalCollateral?: bigint | number;
    createdAt?: Date | string;
    resolvedAt?: Date | string | null;
    sportType?: string | null;
    homeTeam?: string | null;
    awayTeam?: string | null;
    matchDate?: Date | string | null;
    externalMatchId?: string | null;
    priceHistory?: Prisma.PriceSnapshotCreateNestedManyWithoutMarketInput;
    signals?: Prisma.InfoFiSignalCreateNestedManyWithoutMarketInput;
};
export type MarketUncheckedCreateWithoutTradesInput = {
    id: number;
    question: string;
    numOutcomes: number;
    endTime: Date | string;
    status?: $Enums.MarketStatus;
    winningOutcome?: number | null;
    totalCollateral?: bigint | number;
    createdAt?: Date | string;
    resolvedAt?: Date | string | null;
    sportType?: string | null;
    homeTeam?: string | null;
    awayTeam?: string | null;
    matchDate?: Date | string | null;
    externalMatchId?: string | null;
    priceHistory?: Prisma.PriceSnapshotUncheckedCreateNestedManyWithoutMarketInput;
    signals?: Prisma.InfoFiSignalUncheckedCreateNestedManyWithoutMarketInput;
};
export type MarketCreateOrConnectWithoutTradesInput = {
    where: Prisma.MarketWhereUniqueInput;
    create: Prisma.XOR<Prisma.MarketCreateWithoutTradesInput, Prisma.MarketUncheckedCreateWithoutTradesInput>;
};
export type MarketUpsertWithoutTradesInput = {
    update: Prisma.XOR<Prisma.MarketUpdateWithoutTradesInput, Prisma.MarketUncheckedUpdateWithoutTradesInput>;
    create: Prisma.XOR<Prisma.MarketCreateWithoutTradesInput, Prisma.MarketUncheckedCreateWithoutTradesInput>;
    where?: Prisma.MarketWhereInput;
};
export type MarketUpdateToOneWithWhereWithoutTradesInput = {
    where?: Prisma.MarketWhereInput;
    data: Prisma.XOR<Prisma.MarketUpdateWithoutTradesInput, Prisma.MarketUncheckedUpdateWithoutTradesInput>;
};
export type MarketUpdateWithoutTradesInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    question?: Prisma.StringFieldUpdateOperationsInput | string;
    numOutcomes?: Prisma.IntFieldUpdateOperationsInput | number;
    endTime?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumMarketStatusFieldUpdateOperationsInput | $Enums.MarketStatus;
    winningOutcome?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    totalCollateral?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    sportType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    homeTeam?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    awayTeam?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    matchDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    externalMatchId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    priceHistory?: Prisma.PriceSnapshotUpdateManyWithoutMarketNestedInput;
    signals?: Prisma.InfoFiSignalUpdateManyWithoutMarketNestedInput;
};
export type MarketUncheckedUpdateWithoutTradesInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    question?: Prisma.StringFieldUpdateOperationsInput | string;
    numOutcomes?: Prisma.IntFieldUpdateOperationsInput | number;
    endTime?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumMarketStatusFieldUpdateOperationsInput | $Enums.MarketStatus;
    winningOutcome?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    totalCollateral?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    sportType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    homeTeam?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    awayTeam?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    matchDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    externalMatchId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    priceHistory?: Prisma.PriceSnapshotUncheckedUpdateManyWithoutMarketNestedInput;
    signals?: Prisma.InfoFiSignalUncheckedUpdateManyWithoutMarketNestedInput;
};
export type MarketCreateWithoutSignalsInput = {
    id: number;
    question: string;
    numOutcomes: number;
    endTime: Date | string;
    status?: $Enums.MarketStatus;
    winningOutcome?: number | null;
    totalCollateral?: bigint | number;
    createdAt?: Date | string;
    resolvedAt?: Date | string | null;
    sportType?: string | null;
    homeTeam?: string | null;
    awayTeam?: string | null;
    matchDate?: Date | string | null;
    externalMatchId?: string | null;
    priceHistory?: Prisma.PriceSnapshotCreateNestedManyWithoutMarketInput;
    trades?: Prisma.TradeCreateNestedManyWithoutMarketInput;
};
export type MarketUncheckedCreateWithoutSignalsInput = {
    id: number;
    question: string;
    numOutcomes: number;
    endTime: Date | string;
    status?: $Enums.MarketStatus;
    winningOutcome?: number | null;
    totalCollateral?: bigint | number;
    createdAt?: Date | string;
    resolvedAt?: Date | string | null;
    sportType?: string | null;
    homeTeam?: string | null;
    awayTeam?: string | null;
    matchDate?: Date | string | null;
    externalMatchId?: string | null;
    priceHistory?: Prisma.PriceSnapshotUncheckedCreateNestedManyWithoutMarketInput;
    trades?: Prisma.TradeUncheckedCreateNestedManyWithoutMarketInput;
};
export type MarketCreateOrConnectWithoutSignalsInput = {
    where: Prisma.MarketWhereUniqueInput;
    create: Prisma.XOR<Prisma.MarketCreateWithoutSignalsInput, Prisma.MarketUncheckedCreateWithoutSignalsInput>;
};
export type MarketUpsertWithoutSignalsInput = {
    update: Prisma.XOR<Prisma.MarketUpdateWithoutSignalsInput, Prisma.MarketUncheckedUpdateWithoutSignalsInput>;
    create: Prisma.XOR<Prisma.MarketCreateWithoutSignalsInput, Prisma.MarketUncheckedCreateWithoutSignalsInput>;
    where?: Prisma.MarketWhereInput;
};
export type MarketUpdateToOneWithWhereWithoutSignalsInput = {
    where?: Prisma.MarketWhereInput;
    data: Prisma.XOR<Prisma.MarketUpdateWithoutSignalsInput, Prisma.MarketUncheckedUpdateWithoutSignalsInput>;
};
export type MarketUpdateWithoutSignalsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    question?: Prisma.StringFieldUpdateOperationsInput | string;
    numOutcomes?: Prisma.IntFieldUpdateOperationsInput | number;
    endTime?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumMarketStatusFieldUpdateOperationsInput | $Enums.MarketStatus;
    winningOutcome?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    totalCollateral?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    sportType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    homeTeam?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    awayTeam?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    matchDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    externalMatchId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    priceHistory?: Prisma.PriceSnapshotUpdateManyWithoutMarketNestedInput;
    trades?: Prisma.TradeUpdateManyWithoutMarketNestedInput;
};
export type MarketUncheckedUpdateWithoutSignalsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    question?: Prisma.StringFieldUpdateOperationsInput | string;
    numOutcomes?: Prisma.IntFieldUpdateOperationsInput | number;
    endTime?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumMarketStatusFieldUpdateOperationsInput | $Enums.MarketStatus;
    winningOutcome?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    totalCollateral?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    sportType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    homeTeam?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    awayTeam?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    matchDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    externalMatchId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    priceHistory?: Prisma.PriceSnapshotUncheckedUpdateManyWithoutMarketNestedInput;
    trades?: Prisma.TradeUncheckedUpdateManyWithoutMarketNestedInput;
};
/**
 * Count Type MarketCountOutputType
 */
export type MarketCountOutputType = {
    priceHistory: number;
    trades: number;
    signals: number;
};
export type MarketCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    priceHistory?: boolean | MarketCountOutputTypeCountPriceHistoryArgs;
    trades?: boolean | MarketCountOutputTypeCountTradesArgs;
    signals?: boolean | MarketCountOutputTypeCountSignalsArgs;
};
/**
 * MarketCountOutputType without action
 */
export type MarketCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MarketCountOutputType
     */
    select?: Prisma.MarketCountOutputTypeSelect<ExtArgs> | null;
};
/**
 * MarketCountOutputType without action
 */
export type MarketCountOutputTypeCountPriceHistoryArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PriceSnapshotWhereInput;
};
/**
 * MarketCountOutputType without action
 */
export type MarketCountOutputTypeCountTradesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TradeWhereInput;
};
/**
 * MarketCountOutputType without action
 */
export type MarketCountOutputTypeCountSignalsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.InfoFiSignalWhereInput;
};
export type MarketSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    question?: boolean;
    numOutcomes?: boolean;
    endTime?: boolean;
    status?: boolean;
    winningOutcome?: boolean;
    totalCollateral?: boolean;
    createdAt?: boolean;
    resolvedAt?: boolean;
    sportType?: boolean;
    homeTeam?: boolean;
    awayTeam?: boolean;
    matchDate?: boolean;
    externalMatchId?: boolean;
    priceHistory?: boolean | Prisma.Market$priceHistoryArgs<ExtArgs>;
    trades?: boolean | Prisma.Market$tradesArgs<ExtArgs>;
    signals?: boolean | Prisma.Market$signalsArgs<ExtArgs>;
    _count?: boolean | Prisma.MarketCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["market"]>;
export type MarketSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    question?: boolean;
    numOutcomes?: boolean;
    endTime?: boolean;
    status?: boolean;
    winningOutcome?: boolean;
    totalCollateral?: boolean;
    createdAt?: boolean;
    resolvedAt?: boolean;
    sportType?: boolean;
    homeTeam?: boolean;
    awayTeam?: boolean;
    matchDate?: boolean;
    externalMatchId?: boolean;
}, ExtArgs["result"]["market"]>;
export type MarketSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    question?: boolean;
    numOutcomes?: boolean;
    endTime?: boolean;
    status?: boolean;
    winningOutcome?: boolean;
    totalCollateral?: boolean;
    createdAt?: boolean;
    resolvedAt?: boolean;
    sportType?: boolean;
    homeTeam?: boolean;
    awayTeam?: boolean;
    matchDate?: boolean;
    externalMatchId?: boolean;
}, ExtArgs["result"]["market"]>;
export type MarketSelectScalar = {
    id?: boolean;
    question?: boolean;
    numOutcomes?: boolean;
    endTime?: boolean;
    status?: boolean;
    winningOutcome?: boolean;
    totalCollateral?: boolean;
    createdAt?: boolean;
    resolvedAt?: boolean;
    sportType?: boolean;
    homeTeam?: boolean;
    awayTeam?: boolean;
    matchDate?: boolean;
    externalMatchId?: boolean;
};
export type MarketOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "question" | "numOutcomes" | "endTime" | "status" | "winningOutcome" | "totalCollateral" | "createdAt" | "resolvedAt" | "sportType" | "homeTeam" | "awayTeam" | "matchDate" | "externalMatchId", ExtArgs["result"]["market"]>;
export type MarketInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    priceHistory?: boolean | Prisma.Market$priceHistoryArgs<ExtArgs>;
    trades?: boolean | Prisma.Market$tradesArgs<ExtArgs>;
    signals?: boolean | Prisma.Market$signalsArgs<ExtArgs>;
    _count?: boolean | Prisma.MarketCountOutputTypeDefaultArgs<ExtArgs>;
};
export type MarketIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type MarketIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $MarketPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Market";
    objects: {
        priceHistory: Prisma.$PriceSnapshotPayload<ExtArgs>[];
        trades: Prisma.$TradePayload<ExtArgs>[];
        signals: Prisma.$InfoFiSignalPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        question: string;
        numOutcomes: number;
        endTime: Date;
        status: $Enums.MarketStatus;
        winningOutcome: number | null;
        totalCollateral: bigint;
        createdAt: Date;
        resolvedAt: Date | null;
        sportType: string | null;
        homeTeam: string | null;
        awayTeam: string | null;
        matchDate: Date | null;
        externalMatchId: string | null;
    }, ExtArgs["result"]["market"]>;
    composites: {};
};
export type MarketGetPayload<S extends boolean | null | undefined | MarketDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$MarketPayload, S>;
export type MarketCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<MarketFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: MarketCountAggregateInputType | true;
};
export interface MarketDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Market'];
        meta: {
            name: 'Market';
        };
    };
    /**
     * Find zero or one Market that matches the filter.
     * @param {MarketFindUniqueArgs} args - Arguments to find a Market
     * @example
     * // Get one Market
     * const market = await prisma.market.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MarketFindUniqueArgs>(args: Prisma.SelectSubset<T, MarketFindUniqueArgs<ExtArgs>>): Prisma.Prisma__MarketClient<runtime.Types.Result.GetResult<Prisma.$MarketPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one Market that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MarketFindUniqueOrThrowArgs} args - Arguments to find a Market
     * @example
     * // Get one Market
     * const market = await prisma.market.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MarketFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, MarketFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__MarketClient<runtime.Types.Result.GetResult<Prisma.$MarketPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Market that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarketFindFirstArgs} args - Arguments to find a Market
     * @example
     * // Get one Market
     * const market = await prisma.market.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MarketFindFirstArgs>(args?: Prisma.SelectSubset<T, MarketFindFirstArgs<ExtArgs>>): Prisma.Prisma__MarketClient<runtime.Types.Result.GetResult<Prisma.$MarketPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Market that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarketFindFirstOrThrowArgs} args - Arguments to find a Market
     * @example
     * // Get one Market
     * const market = await prisma.market.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MarketFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, MarketFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__MarketClient<runtime.Types.Result.GetResult<Prisma.$MarketPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Markets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarketFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Markets
     * const markets = await prisma.market.findMany()
     *
     * // Get first 10 Markets
     * const markets = await prisma.market.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const marketWithIdOnly = await prisma.market.findMany({ select: { id: true } })
     *
     */
    findMany<T extends MarketFindManyArgs>(args?: Prisma.SelectSubset<T, MarketFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MarketPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a Market.
     * @param {MarketCreateArgs} args - Arguments to create a Market.
     * @example
     * // Create one Market
     * const Market = await prisma.market.create({
     *   data: {
     *     // ... data to create a Market
     *   }
     * })
     *
     */
    create<T extends MarketCreateArgs>(args: Prisma.SelectSubset<T, MarketCreateArgs<ExtArgs>>): Prisma.Prisma__MarketClient<runtime.Types.Result.GetResult<Prisma.$MarketPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Markets.
     * @param {MarketCreateManyArgs} args - Arguments to create many Markets.
     * @example
     * // Create many Markets
     * const market = await prisma.market.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends MarketCreateManyArgs>(args?: Prisma.SelectSubset<T, MarketCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many Markets and returns the data saved in the database.
     * @param {MarketCreateManyAndReturnArgs} args - Arguments to create many Markets.
     * @example
     * // Create many Markets
     * const market = await prisma.market.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Markets and only return the `id`
     * const marketWithIdOnly = await prisma.market.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends MarketCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, MarketCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MarketPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a Market.
     * @param {MarketDeleteArgs} args - Arguments to delete one Market.
     * @example
     * // Delete one Market
     * const Market = await prisma.market.delete({
     *   where: {
     *     // ... filter to delete one Market
     *   }
     * })
     *
     */
    delete<T extends MarketDeleteArgs>(args: Prisma.SelectSubset<T, MarketDeleteArgs<ExtArgs>>): Prisma.Prisma__MarketClient<runtime.Types.Result.GetResult<Prisma.$MarketPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one Market.
     * @param {MarketUpdateArgs} args - Arguments to update one Market.
     * @example
     * // Update one Market
     * const market = await prisma.market.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends MarketUpdateArgs>(args: Prisma.SelectSubset<T, MarketUpdateArgs<ExtArgs>>): Prisma.Prisma__MarketClient<runtime.Types.Result.GetResult<Prisma.$MarketPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Markets.
     * @param {MarketDeleteManyArgs} args - Arguments to filter Markets to delete.
     * @example
     * // Delete a few Markets
     * const { count } = await prisma.market.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends MarketDeleteManyArgs>(args?: Prisma.SelectSubset<T, MarketDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Markets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarketUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Markets
     * const market = await prisma.market.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends MarketUpdateManyArgs>(args: Prisma.SelectSubset<T, MarketUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Markets and returns the data updated in the database.
     * @param {MarketUpdateManyAndReturnArgs} args - Arguments to update many Markets.
     * @example
     * // Update many Markets
     * const market = await prisma.market.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Markets and only return the `id`
     * const marketWithIdOnly = await prisma.market.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends MarketUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, MarketUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MarketPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one Market.
     * @param {MarketUpsertArgs} args - Arguments to update or create a Market.
     * @example
     * // Update or create a Market
     * const market = await prisma.market.upsert({
     *   create: {
     *     // ... data to create a Market
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Market we want to update
     *   }
     * })
     */
    upsert<T extends MarketUpsertArgs>(args: Prisma.SelectSubset<T, MarketUpsertArgs<ExtArgs>>): Prisma.Prisma__MarketClient<runtime.Types.Result.GetResult<Prisma.$MarketPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of Markets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarketCountArgs} args - Arguments to filter Markets to count.
     * @example
     * // Count the number of Markets
     * const count = await prisma.market.count({
     *   where: {
     *     // ... the filter for the Markets we want to count
     *   }
     * })
    **/
    count<T extends MarketCountArgs>(args?: Prisma.Subset<T, MarketCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], MarketCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a Market.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarketAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MarketAggregateArgs>(args: Prisma.Subset<T, MarketAggregateArgs>): Prisma.PrismaPromise<GetMarketAggregateType<T>>;
    /**
     * Group by Market.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarketGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
    **/
    groupBy<T extends MarketGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: MarketGroupByArgs['orderBy'];
    } : {
        orderBy?: MarketGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, MarketGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMarketGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Market model
     */
    readonly fields: MarketFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for Market.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__MarketClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    priceHistory<T extends Prisma.Market$priceHistoryArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Market$priceHistoryArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PriceSnapshotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    trades<T extends Prisma.Market$tradesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Market$tradesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    signals<T extends Prisma.Market$signalsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Market$signalsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$InfoFiSignalPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
/**
 * Fields of the Market model
 */
export interface MarketFieldRefs {
    readonly id: Prisma.FieldRef<"Market", 'Int'>;
    readonly question: Prisma.FieldRef<"Market", 'String'>;
    readonly numOutcomes: Prisma.FieldRef<"Market", 'Int'>;
    readonly endTime: Prisma.FieldRef<"Market", 'DateTime'>;
    readonly status: Prisma.FieldRef<"Market", 'MarketStatus'>;
    readonly winningOutcome: Prisma.FieldRef<"Market", 'Int'>;
    readonly totalCollateral: Prisma.FieldRef<"Market", 'BigInt'>;
    readonly createdAt: Prisma.FieldRef<"Market", 'DateTime'>;
    readonly resolvedAt: Prisma.FieldRef<"Market", 'DateTime'>;
    readonly sportType: Prisma.FieldRef<"Market", 'String'>;
    readonly homeTeam: Prisma.FieldRef<"Market", 'String'>;
    readonly awayTeam: Prisma.FieldRef<"Market", 'String'>;
    readonly matchDate: Prisma.FieldRef<"Market", 'DateTime'>;
    readonly externalMatchId: Prisma.FieldRef<"Market", 'String'>;
}
/**
 * Market findUnique
 */
export type MarketFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Market
     */
    select?: Prisma.MarketSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Market
     */
    omit?: Prisma.MarketOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MarketInclude<ExtArgs> | null;
    /**
     * Filter, which Market to fetch.
     */
    where: Prisma.MarketWhereUniqueInput;
};
/**
 * Market findUniqueOrThrow
 */
export type MarketFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Market
     */
    select?: Prisma.MarketSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Market
     */
    omit?: Prisma.MarketOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MarketInclude<ExtArgs> | null;
    /**
     * Filter, which Market to fetch.
     */
    where: Prisma.MarketWhereUniqueInput;
};
/**
 * Market findFirst
 */
export type MarketFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Market
     */
    select?: Prisma.MarketSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Market
     */
    omit?: Prisma.MarketOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MarketInclude<ExtArgs> | null;
    /**
     * Filter, which Market to fetch.
     */
    where?: Prisma.MarketWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Markets to fetch.
     */
    orderBy?: Prisma.MarketOrderByWithRelationInput | Prisma.MarketOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Markets.
     */
    cursor?: Prisma.MarketWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Markets from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Markets.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Markets.
     */
    distinct?: Prisma.MarketScalarFieldEnum | Prisma.MarketScalarFieldEnum[];
};
/**
 * Market findFirstOrThrow
 */
export type MarketFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Market
     */
    select?: Prisma.MarketSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Market
     */
    omit?: Prisma.MarketOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MarketInclude<ExtArgs> | null;
    /**
     * Filter, which Market to fetch.
     */
    where?: Prisma.MarketWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Markets to fetch.
     */
    orderBy?: Prisma.MarketOrderByWithRelationInput | Prisma.MarketOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Markets.
     */
    cursor?: Prisma.MarketWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Markets from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Markets.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Markets.
     */
    distinct?: Prisma.MarketScalarFieldEnum | Prisma.MarketScalarFieldEnum[];
};
/**
 * Market findMany
 */
export type MarketFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Market
     */
    select?: Prisma.MarketSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Market
     */
    omit?: Prisma.MarketOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MarketInclude<ExtArgs> | null;
    /**
     * Filter, which Markets to fetch.
     */
    where?: Prisma.MarketWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Markets to fetch.
     */
    orderBy?: Prisma.MarketOrderByWithRelationInput | Prisma.MarketOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Markets.
     */
    cursor?: Prisma.MarketWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Markets from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Markets.
     */
    skip?: number;
    distinct?: Prisma.MarketScalarFieldEnum | Prisma.MarketScalarFieldEnum[];
};
/**
 * Market create
 */
export type MarketCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Market
     */
    select?: Prisma.MarketSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Market
     */
    omit?: Prisma.MarketOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MarketInclude<ExtArgs> | null;
    /**
     * The data needed to create a Market.
     */
    data: Prisma.XOR<Prisma.MarketCreateInput, Prisma.MarketUncheckedCreateInput>;
};
/**
 * Market createMany
 */
export type MarketCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many Markets.
     */
    data: Prisma.MarketCreateManyInput | Prisma.MarketCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * Market createManyAndReturn
 */
export type MarketCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Market
     */
    select?: Prisma.MarketSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Market
     */
    omit?: Prisma.MarketOmit<ExtArgs> | null;
    /**
     * The data used to create many Markets.
     */
    data: Prisma.MarketCreateManyInput | Prisma.MarketCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * Market update
 */
export type MarketUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Market
     */
    select?: Prisma.MarketSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Market
     */
    omit?: Prisma.MarketOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MarketInclude<ExtArgs> | null;
    /**
     * The data needed to update a Market.
     */
    data: Prisma.XOR<Prisma.MarketUpdateInput, Prisma.MarketUncheckedUpdateInput>;
    /**
     * Choose, which Market to update.
     */
    where: Prisma.MarketWhereUniqueInput;
};
/**
 * Market updateMany
 */
export type MarketUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update Markets.
     */
    data: Prisma.XOR<Prisma.MarketUpdateManyMutationInput, Prisma.MarketUncheckedUpdateManyInput>;
    /**
     * Filter which Markets to update
     */
    where?: Prisma.MarketWhereInput;
    /**
     * Limit how many Markets to update.
     */
    limit?: number;
};
/**
 * Market updateManyAndReturn
 */
export type MarketUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Market
     */
    select?: Prisma.MarketSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Market
     */
    omit?: Prisma.MarketOmit<ExtArgs> | null;
    /**
     * The data used to update Markets.
     */
    data: Prisma.XOR<Prisma.MarketUpdateManyMutationInput, Prisma.MarketUncheckedUpdateManyInput>;
    /**
     * Filter which Markets to update
     */
    where?: Prisma.MarketWhereInput;
    /**
     * Limit how many Markets to update.
     */
    limit?: number;
};
/**
 * Market upsert
 */
export type MarketUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Market
     */
    select?: Prisma.MarketSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Market
     */
    omit?: Prisma.MarketOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MarketInclude<ExtArgs> | null;
    /**
     * The filter to search for the Market to update in case it exists.
     */
    where: Prisma.MarketWhereUniqueInput;
    /**
     * In case the Market found by the `where` argument doesn't exist, create a new Market with this data.
     */
    create: Prisma.XOR<Prisma.MarketCreateInput, Prisma.MarketUncheckedCreateInput>;
    /**
     * In case the Market was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.MarketUpdateInput, Prisma.MarketUncheckedUpdateInput>;
};
/**
 * Market delete
 */
export type MarketDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Market
     */
    select?: Prisma.MarketSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Market
     */
    omit?: Prisma.MarketOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MarketInclude<ExtArgs> | null;
    /**
     * Filter which Market to delete.
     */
    where: Prisma.MarketWhereUniqueInput;
};
/**
 * Market deleteMany
 */
export type MarketDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Markets to delete
     */
    where?: Prisma.MarketWhereInput;
    /**
     * Limit how many Markets to delete.
     */
    limit?: number;
};
/**
 * Market.priceHistory
 */
export type Market$priceHistoryArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriceSnapshot
     */
    select?: Prisma.PriceSnapshotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PriceSnapshot
     */
    omit?: Prisma.PriceSnapshotOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PriceSnapshotInclude<ExtArgs> | null;
    where?: Prisma.PriceSnapshotWhereInput;
    orderBy?: Prisma.PriceSnapshotOrderByWithRelationInput | Prisma.PriceSnapshotOrderByWithRelationInput[];
    cursor?: Prisma.PriceSnapshotWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PriceSnapshotScalarFieldEnum | Prisma.PriceSnapshotScalarFieldEnum[];
};
/**
 * Market.trades
 */
export type Market$tradesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trade
     */
    select?: Prisma.TradeSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Trade
     */
    omit?: Prisma.TradeOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TradeInclude<ExtArgs> | null;
    where?: Prisma.TradeWhereInput;
    orderBy?: Prisma.TradeOrderByWithRelationInput | Prisma.TradeOrderByWithRelationInput[];
    cursor?: Prisma.TradeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TradeScalarFieldEnum | Prisma.TradeScalarFieldEnum[];
};
/**
 * Market.signals
 */
export type Market$signalsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InfoFiSignal
     */
    select?: Prisma.InfoFiSignalSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the InfoFiSignal
     */
    omit?: Prisma.InfoFiSignalOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.InfoFiSignalInclude<ExtArgs> | null;
    where?: Prisma.InfoFiSignalWhereInput;
    orderBy?: Prisma.InfoFiSignalOrderByWithRelationInput | Prisma.InfoFiSignalOrderByWithRelationInput[];
    cursor?: Prisma.InfoFiSignalWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.InfoFiSignalScalarFieldEnum | Prisma.InfoFiSignalScalarFieldEnum[];
};
/**
 * Market without action
 */
export type MarketDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Market
     */
    select?: Prisma.MarketSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Market
     */
    omit?: Prisma.MarketOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MarketInclude<ExtArgs> | null;
};
export {};
