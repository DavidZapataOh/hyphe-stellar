import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model InfoFiSignal
 *
 */
export type InfoFiSignalModel = runtime.Types.Result.DefaultSelection<Prisma.$InfoFiSignalPayload>;
export type AggregateInfoFiSignal = {
    _count: InfoFiSignalCountAggregateOutputType | null;
    _avg: InfoFiSignalAvgAggregateOutputType | null;
    _sum: InfoFiSignalSumAggregateOutputType | null;
    _min: InfoFiSignalMinAggregateOutputType | null;
    _max: InfoFiSignalMaxAggregateOutputType | null;
};
export type InfoFiSignalAvgAggregateOutputType = {
    id: number | null;
    marketId: number | null;
    value: number | null;
    confidence: number | null;
};
export type InfoFiSignalSumAggregateOutputType = {
    id: number | null;
    marketId: number | null;
    value: number | null;
    confidence: number | null;
};
export type InfoFiSignalMinAggregateOutputType = {
    id: number | null;
    marketId: number | null;
    signalType: string | null;
    entity: string | null;
    value: number | null;
    description: string | null;
    confidence: number | null;
    timestamp: Date | null;
};
export type InfoFiSignalMaxAggregateOutputType = {
    id: number | null;
    marketId: number | null;
    signalType: string | null;
    entity: string | null;
    value: number | null;
    description: string | null;
    confidence: number | null;
    timestamp: Date | null;
};
export type InfoFiSignalCountAggregateOutputType = {
    id: number;
    marketId: number;
    signalType: number;
    entity: number;
    value: number;
    description: number;
    confidence: number;
    timestamp: number;
    _all: number;
};
export type InfoFiSignalAvgAggregateInputType = {
    id?: true;
    marketId?: true;
    value?: true;
    confidence?: true;
};
export type InfoFiSignalSumAggregateInputType = {
    id?: true;
    marketId?: true;
    value?: true;
    confidence?: true;
};
export type InfoFiSignalMinAggregateInputType = {
    id?: true;
    marketId?: true;
    signalType?: true;
    entity?: true;
    value?: true;
    description?: true;
    confidence?: true;
    timestamp?: true;
};
export type InfoFiSignalMaxAggregateInputType = {
    id?: true;
    marketId?: true;
    signalType?: true;
    entity?: true;
    value?: true;
    description?: true;
    confidence?: true;
    timestamp?: true;
};
export type InfoFiSignalCountAggregateInputType = {
    id?: true;
    marketId?: true;
    signalType?: true;
    entity?: true;
    value?: true;
    description?: true;
    confidence?: true;
    timestamp?: true;
    _all?: true;
};
export type InfoFiSignalAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which InfoFiSignal to aggregate.
     */
    where?: Prisma.InfoFiSignalWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of InfoFiSignals to fetch.
     */
    orderBy?: Prisma.InfoFiSignalOrderByWithRelationInput | Prisma.InfoFiSignalOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.InfoFiSignalWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` InfoFiSignals from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` InfoFiSignals.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned InfoFiSignals
    **/
    _count?: true | InfoFiSignalCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: InfoFiSignalAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: InfoFiSignalSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: InfoFiSignalMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: InfoFiSignalMaxAggregateInputType;
};
export type GetInfoFiSignalAggregateType<T extends InfoFiSignalAggregateArgs> = {
    [P in keyof T & keyof AggregateInfoFiSignal]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateInfoFiSignal[P]> : Prisma.GetScalarType<T[P], AggregateInfoFiSignal[P]>;
};
export type InfoFiSignalGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.InfoFiSignalWhereInput;
    orderBy?: Prisma.InfoFiSignalOrderByWithAggregationInput | Prisma.InfoFiSignalOrderByWithAggregationInput[];
    by: Prisma.InfoFiSignalScalarFieldEnum[] | Prisma.InfoFiSignalScalarFieldEnum;
    having?: Prisma.InfoFiSignalScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: InfoFiSignalCountAggregateInputType | true;
    _avg?: InfoFiSignalAvgAggregateInputType;
    _sum?: InfoFiSignalSumAggregateInputType;
    _min?: InfoFiSignalMinAggregateInputType;
    _max?: InfoFiSignalMaxAggregateInputType;
};
export type InfoFiSignalGroupByOutputType = {
    id: number;
    marketId: number;
    signalType: string;
    entity: string;
    value: number;
    description: string;
    confidence: number;
    timestamp: Date;
    _count: InfoFiSignalCountAggregateOutputType | null;
    _avg: InfoFiSignalAvgAggregateOutputType | null;
    _sum: InfoFiSignalSumAggregateOutputType | null;
    _min: InfoFiSignalMinAggregateOutputType | null;
    _max: InfoFiSignalMaxAggregateOutputType | null;
};
type GetInfoFiSignalGroupByPayload<T extends InfoFiSignalGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<InfoFiSignalGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof InfoFiSignalGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], InfoFiSignalGroupByOutputType[P]> : Prisma.GetScalarType<T[P], InfoFiSignalGroupByOutputType[P]>;
}>>;
export type InfoFiSignalWhereInput = {
    AND?: Prisma.InfoFiSignalWhereInput | Prisma.InfoFiSignalWhereInput[];
    OR?: Prisma.InfoFiSignalWhereInput[];
    NOT?: Prisma.InfoFiSignalWhereInput | Prisma.InfoFiSignalWhereInput[];
    id?: Prisma.IntFilter<"InfoFiSignal"> | number;
    marketId?: Prisma.IntFilter<"InfoFiSignal"> | number;
    signalType?: Prisma.StringFilter<"InfoFiSignal"> | string;
    entity?: Prisma.StringFilter<"InfoFiSignal"> | string;
    value?: Prisma.FloatFilter<"InfoFiSignal"> | number;
    description?: Prisma.StringFilter<"InfoFiSignal"> | string;
    confidence?: Prisma.FloatFilter<"InfoFiSignal"> | number;
    timestamp?: Prisma.DateTimeFilter<"InfoFiSignal"> | Date | string;
    market?: Prisma.XOR<Prisma.MarketScalarRelationFilter, Prisma.MarketWhereInput>;
};
export type InfoFiSignalOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    marketId?: Prisma.SortOrder;
    signalType?: Prisma.SortOrder;
    entity?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    confidence?: Prisma.SortOrder;
    timestamp?: Prisma.SortOrder;
    market?: Prisma.MarketOrderByWithRelationInput;
};
export type InfoFiSignalWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    AND?: Prisma.InfoFiSignalWhereInput | Prisma.InfoFiSignalWhereInput[];
    OR?: Prisma.InfoFiSignalWhereInput[];
    NOT?: Prisma.InfoFiSignalWhereInput | Prisma.InfoFiSignalWhereInput[];
    marketId?: Prisma.IntFilter<"InfoFiSignal"> | number;
    signalType?: Prisma.StringFilter<"InfoFiSignal"> | string;
    entity?: Prisma.StringFilter<"InfoFiSignal"> | string;
    value?: Prisma.FloatFilter<"InfoFiSignal"> | number;
    description?: Prisma.StringFilter<"InfoFiSignal"> | string;
    confidence?: Prisma.FloatFilter<"InfoFiSignal"> | number;
    timestamp?: Prisma.DateTimeFilter<"InfoFiSignal"> | Date | string;
    market?: Prisma.XOR<Prisma.MarketScalarRelationFilter, Prisma.MarketWhereInput>;
}, "id">;
export type InfoFiSignalOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    marketId?: Prisma.SortOrder;
    signalType?: Prisma.SortOrder;
    entity?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    confidence?: Prisma.SortOrder;
    timestamp?: Prisma.SortOrder;
    _count?: Prisma.InfoFiSignalCountOrderByAggregateInput;
    _avg?: Prisma.InfoFiSignalAvgOrderByAggregateInput;
    _max?: Prisma.InfoFiSignalMaxOrderByAggregateInput;
    _min?: Prisma.InfoFiSignalMinOrderByAggregateInput;
    _sum?: Prisma.InfoFiSignalSumOrderByAggregateInput;
};
export type InfoFiSignalScalarWhereWithAggregatesInput = {
    AND?: Prisma.InfoFiSignalScalarWhereWithAggregatesInput | Prisma.InfoFiSignalScalarWhereWithAggregatesInput[];
    OR?: Prisma.InfoFiSignalScalarWhereWithAggregatesInput[];
    NOT?: Prisma.InfoFiSignalScalarWhereWithAggregatesInput | Prisma.InfoFiSignalScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"InfoFiSignal"> | number;
    marketId?: Prisma.IntWithAggregatesFilter<"InfoFiSignal"> | number;
    signalType?: Prisma.StringWithAggregatesFilter<"InfoFiSignal"> | string;
    entity?: Prisma.StringWithAggregatesFilter<"InfoFiSignal"> | string;
    value?: Prisma.FloatWithAggregatesFilter<"InfoFiSignal"> | number;
    description?: Prisma.StringWithAggregatesFilter<"InfoFiSignal"> | string;
    confidence?: Prisma.FloatWithAggregatesFilter<"InfoFiSignal"> | number;
    timestamp?: Prisma.DateTimeWithAggregatesFilter<"InfoFiSignal"> | Date | string;
};
export type InfoFiSignalCreateInput = {
    signalType: string;
    entity: string;
    value: number;
    description: string;
    confidence: number;
    timestamp?: Date | string;
    market: Prisma.MarketCreateNestedOneWithoutSignalsInput;
};
export type InfoFiSignalUncheckedCreateInput = {
    id?: number;
    marketId: number;
    signalType: string;
    entity: string;
    value: number;
    description: string;
    confidence: number;
    timestamp?: Date | string;
};
export type InfoFiSignalUpdateInput = {
    signalType?: Prisma.StringFieldUpdateOperationsInput | string;
    entity?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.FloatFieldUpdateOperationsInput | number;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    confidence?: Prisma.FloatFieldUpdateOperationsInput | number;
    timestamp?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    market?: Prisma.MarketUpdateOneRequiredWithoutSignalsNestedInput;
};
export type InfoFiSignalUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    marketId?: Prisma.IntFieldUpdateOperationsInput | number;
    signalType?: Prisma.StringFieldUpdateOperationsInput | string;
    entity?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.FloatFieldUpdateOperationsInput | number;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    confidence?: Prisma.FloatFieldUpdateOperationsInput | number;
    timestamp?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type InfoFiSignalCreateManyInput = {
    id?: number;
    marketId: number;
    signalType: string;
    entity: string;
    value: number;
    description: string;
    confidence: number;
    timestamp?: Date | string;
};
export type InfoFiSignalUpdateManyMutationInput = {
    signalType?: Prisma.StringFieldUpdateOperationsInput | string;
    entity?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.FloatFieldUpdateOperationsInput | number;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    confidence?: Prisma.FloatFieldUpdateOperationsInput | number;
    timestamp?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type InfoFiSignalUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    marketId?: Prisma.IntFieldUpdateOperationsInput | number;
    signalType?: Prisma.StringFieldUpdateOperationsInput | string;
    entity?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.FloatFieldUpdateOperationsInput | number;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    confidence?: Prisma.FloatFieldUpdateOperationsInput | number;
    timestamp?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type InfoFiSignalListRelationFilter = {
    every?: Prisma.InfoFiSignalWhereInput;
    some?: Prisma.InfoFiSignalWhereInput;
    none?: Prisma.InfoFiSignalWhereInput;
};
export type InfoFiSignalOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type InfoFiSignalCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    marketId?: Prisma.SortOrder;
    signalType?: Prisma.SortOrder;
    entity?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    confidence?: Prisma.SortOrder;
    timestamp?: Prisma.SortOrder;
};
export type InfoFiSignalAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    marketId?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
    confidence?: Prisma.SortOrder;
};
export type InfoFiSignalMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    marketId?: Prisma.SortOrder;
    signalType?: Prisma.SortOrder;
    entity?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    confidence?: Prisma.SortOrder;
    timestamp?: Prisma.SortOrder;
};
export type InfoFiSignalMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    marketId?: Prisma.SortOrder;
    signalType?: Prisma.SortOrder;
    entity?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    confidence?: Prisma.SortOrder;
    timestamp?: Prisma.SortOrder;
};
export type InfoFiSignalSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    marketId?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
    confidence?: Prisma.SortOrder;
};
export type InfoFiSignalCreateNestedManyWithoutMarketInput = {
    create?: Prisma.XOR<Prisma.InfoFiSignalCreateWithoutMarketInput, Prisma.InfoFiSignalUncheckedCreateWithoutMarketInput> | Prisma.InfoFiSignalCreateWithoutMarketInput[] | Prisma.InfoFiSignalUncheckedCreateWithoutMarketInput[];
    connectOrCreate?: Prisma.InfoFiSignalCreateOrConnectWithoutMarketInput | Prisma.InfoFiSignalCreateOrConnectWithoutMarketInput[];
    createMany?: Prisma.InfoFiSignalCreateManyMarketInputEnvelope;
    connect?: Prisma.InfoFiSignalWhereUniqueInput | Prisma.InfoFiSignalWhereUniqueInput[];
};
export type InfoFiSignalUncheckedCreateNestedManyWithoutMarketInput = {
    create?: Prisma.XOR<Prisma.InfoFiSignalCreateWithoutMarketInput, Prisma.InfoFiSignalUncheckedCreateWithoutMarketInput> | Prisma.InfoFiSignalCreateWithoutMarketInput[] | Prisma.InfoFiSignalUncheckedCreateWithoutMarketInput[];
    connectOrCreate?: Prisma.InfoFiSignalCreateOrConnectWithoutMarketInput | Prisma.InfoFiSignalCreateOrConnectWithoutMarketInput[];
    createMany?: Prisma.InfoFiSignalCreateManyMarketInputEnvelope;
    connect?: Prisma.InfoFiSignalWhereUniqueInput | Prisma.InfoFiSignalWhereUniqueInput[];
};
export type InfoFiSignalUpdateManyWithoutMarketNestedInput = {
    create?: Prisma.XOR<Prisma.InfoFiSignalCreateWithoutMarketInput, Prisma.InfoFiSignalUncheckedCreateWithoutMarketInput> | Prisma.InfoFiSignalCreateWithoutMarketInput[] | Prisma.InfoFiSignalUncheckedCreateWithoutMarketInput[];
    connectOrCreate?: Prisma.InfoFiSignalCreateOrConnectWithoutMarketInput | Prisma.InfoFiSignalCreateOrConnectWithoutMarketInput[];
    upsert?: Prisma.InfoFiSignalUpsertWithWhereUniqueWithoutMarketInput | Prisma.InfoFiSignalUpsertWithWhereUniqueWithoutMarketInput[];
    createMany?: Prisma.InfoFiSignalCreateManyMarketInputEnvelope;
    set?: Prisma.InfoFiSignalWhereUniqueInput | Prisma.InfoFiSignalWhereUniqueInput[];
    disconnect?: Prisma.InfoFiSignalWhereUniqueInput | Prisma.InfoFiSignalWhereUniqueInput[];
    delete?: Prisma.InfoFiSignalWhereUniqueInput | Prisma.InfoFiSignalWhereUniqueInput[];
    connect?: Prisma.InfoFiSignalWhereUniqueInput | Prisma.InfoFiSignalWhereUniqueInput[];
    update?: Prisma.InfoFiSignalUpdateWithWhereUniqueWithoutMarketInput | Prisma.InfoFiSignalUpdateWithWhereUniqueWithoutMarketInput[];
    updateMany?: Prisma.InfoFiSignalUpdateManyWithWhereWithoutMarketInput | Prisma.InfoFiSignalUpdateManyWithWhereWithoutMarketInput[];
    deleteMany?: Prisma.InfoFiSignalScalarWhereInput | Prisma.InfoFiSignalScalarWhereInput[];
};
export type InfoFiSignalUncheckedUpdateManyWithoutMarketNestedInput = {
    create?: Prisma.XOR<Prisma.InfoFiSignalCreateWithoutMarketInput, Prisma.InfoFiSignalUncheckedCreateWithoutMarketInput> | Prisma.InfoFiSignalCreateWithoutMarketInput[] | Prisma.InfoFiSignalUncheckedCreateWithoutMarketInput[];
    connectOrCreate?: Prisma.InfoFiSignalCreateOrConnectWithoutMarketInput | Prisma.InfoFiSignalCreateOrConnectWithoutMarketInput[];
    upsert?: Prisma.InfoFiSignalUpsertWithWhereUniqueWithoutMarketInput | Prisma.InfoFiSignalUpsertWithWhereUniqueWithoutMarketInput[];
    createMany?: Prisma.InfoFiSignalCreateManyMarketInputEnvelope;
    set?: Prisma.InfoFiSignalWhereUniqueInput | Prisma.InfoFiSignalWhereUniqueInput[];
    disconnect?: Prisma.InfoFiSignalWhereUniqueInput | Prisma.InfoFiSignalWhereUniqueInput[];
    delete?: Prisma.InfoFiSignalWhereUniqueInput | Prisma.InfoFiSignalWhereUniqueInput[];
    connect?: Prisma.InfoFiSignalWhereUniqueInput | Prisma.InfoFiSignalWhereUniqueInput[];
    update?: Prisma.InfoFiSignalUpdateWithWhereUniqueWithoutMarketInput | Prisma.InfoFiSignalUpdateWithWhereUniqueWithoutMarketInput[];
    updateMany?: Prisma.InfoFiSignalUpdateManyWithWhereWithoutMarketInput | Prisma.InfoFiSignalUpdateManyWithWhereWithoutMarketInput[];
    deleteMany?: Prisma.InfoFiSignalScalarWhereInput | Prisma.InfoFiSignalScalarWhereInput[];
};
export type InfoFiSignalCreateWithoutMarketInput = {
    signalType: string;
    entity: string;
    value: number;
    description: string;
    confidence: number;
    timestamp?: Date | string;
};
export type InfoFiSignalUncheckedCreateWithoutMarketInput = {
    id?: number;
    signalType: string;
    entity: string;
    value: number;
    description: string;
    confidence: number;
    timestamp?: Date | string;
};
export type InfoFiSignalCreateOrConnectWithoutMarketInput = {
    where: Prisma.InfoFiSignalWhereUniqueInput;
    create: Prisma.XOR<Prisma.InfoFiSignalCreateWithoutMarketInput, Prisma.InfoFiSignalUncheckedCreateWithoutMarketInput>;
};
export type InfoFiSignalCreateManyMarketInputEnvelope = {
    data: Prisma.InfoFiSignalCreateManyMarketInput | Prisma.InfoFiSignalCreateManyMarketInput[];
    skipDuplicates?: boolean;
};
export type InfoFiSignalUpsertWithWhereUniqueWithoutMarketInput = {
    where: Prisma.InfoFiSignalWhereUniqueInput;
    update: Prisma.XOR<Prisma.InfoFiSignalUpdateWithoutMarketInput, Prisma.InfoFiSignalUncheckedUpdateWithoutMarketInput>;
    create: Prisma.XOR<Prisma.InfoFiSignalCreateWithoutMarketInput, Prisma.InfoFiSignalUncheckedCreateWithoutMarketInput>;
};
export type InfoFiSignalUpdateWithWhereUniqueWithoutMarketInput = {
    where: Prisma.InfoFiSignalWhereUniqueInput;
    data: Prisma.XOR<Prisma.InfoFiSignalUpdateWithoutMarketInput, Prisma.InfoFiSignalUncheckedUpdateWithoutMarketInput>;
};
export type InfoFiSignalUpdateManyWithWhereWithoutMarketInput = {
    where: Prisma.InfoFiSignalScalarWhereInput;
    data: Prisma.XOR<Prisma.InfoFiSignalUpdateManyMutationInput, Prisma.InfoFiSignalUncheckedUpdateManyWithoutMarketInput>;
};
export type InfoFiSignalScalarWhereInput = {
    AND?: Prisma.InfoFiSignalScalarWhereInput | Prisma.InfoFiSignalScalarWhereInput[];
    OR?: Prisma.InfoFiSignalScalarWhereInput[];
    NOT?: Prisma.InfoFiSignalScalarWhereInput | Prisma.InfoFiSignalScalarWhereInput[];
    id?: Prisma.IntFilter<"InfoFiSignal"> | number;
    marketId?: Prisma.IntFilter<"InfoFiSignal"> | number;
    signalType?: Prisma.StringFilter<"InfoFiSignal"> | string;
    entity?: Prisma.StringFilter<"InfoFiSignal"> | string;
    value?: Prisma.FloatFilter<"InfoFiSignal"> | number;
    description?: Prisma.StringFilter<"InfoFiSignal"> | string;
    confidence?: Prisma.FloatFilter<"InfoFiSignal"> | number;
    timestamp?: Prisma.DateTimeFilter<"InfoFiSignal"> | Date | string;
};
export type InfoFiSignalCreateManyMarketInput = {
    id?: number;
    signalType: string;
    entity: string;
    value: number;
    description: string;
    confidence: number;
    timestamp?: Date | string;
};
export type InfoFiSignalUpdateWithoutMarketInput = {
    signalType?: Prisma.StringFieldUpdateOperationsInput | string;
    entity?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.FloatFieldUpdateOperationsInput | number;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    confidence?: Prisma.FloatFieldUpdateOperationsInput | number;
    timestamp?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type InfoFiSignalUncheckedUpdateWithoutMarketInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    signalType?: Prisma.StringFieldUpdateOperationsInput | string;
    entity?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.FloatFieldUpdateOperationsInput | number;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    confidence?: Prisma.FloatFieldUpdateOperationsInput | number;
    timestamp?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type InfoFiSignalUncheckedUpdateManyWithoutMarketInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    signalType?: Prisma.StringFieldUpdateOperationsInput | string;
    entity?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.FloatFieldUpdateOperationsInput | number;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    confidence?: Prisma.FloatFieldUpdateOperationsInput | number;
    timestamp?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type InfoFiSignalSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    marketId?: boolean;
    signalType?: boolean;
    entity?: boolean;
    value?: boolean;
    description?: boolean;
    confidence?: boolean;
    timestamp?: boolean;
    market?: boolean | Prisma.MarketDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["infoFiSignal"]>;
export type InfoFiSignalSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    marketId?: boolean;
    signalType?: boolean;
    entity?: boolean;
    value?: boolean;
    description?: boolean;
    confidence?: boolean;
    timestamp?: boolean;
    market?: boolean | Prisma.MarketDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["infoFiSignal"]>;
export type InfoFiSignalSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    marketId?: boolean;
    signalType?: boolean;
    entity?: boolean;
    value?: boolean;
    description?: boolean;
    confidence?: boolean;
    timestamp?: boolean;
    market?: boolean | Prisma.MarketDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["infoFiSignal"]>;
export type InfoFiSignalSelectScalar = {
    id?: boolean;
    marketId?: boolean;
    signalType?: boolean;
    entity?: boolean;
    value?: boolean;
    description?: boolean;
    confidence?: boolean;
    timestamp?: boolean;
};
export type InfoFiSignalOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "marketId" | "signalType" | "entity" | "value" | "description" | "confidence" | "timestamp", ExtArgs["result"]["infoFiSignal"]>;
export type InfoFiSignalInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    market?: boolean | Prisma.MarketDefaultArgs<ExtArgs>;
};
export type InfoFiSignalIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    market?: boolean | Prisma.MarketDefaultArgs<ExtArgs>;
};
export type InfoFiSignalIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    market?: boolean | Prisma.MarketDefaultArgs<ExtArgs>;
};
export type $InfoFiSignalPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "InfoFiSignal";
    objects: {
        market: Prisma.$MarketPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        marketId: number;
        signalType: string;
        entity: string;
        value: number;
        description: string;
        confidence: number;
        timestamp: Date;
    }, ExtArgs["result"]["infoFiSignal"]>;
    composites: {};
};
export type InfoFiSignalGetPayload<S extends boolean | null | undefined | InfoFiSignalDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$InfoFiSignalPayload, S>;
export type InfoFiSignalCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<InfoFiSignalFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: InfoFiSignalCountAggregateInputType | true;
};
export interface InfoFiSignalDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['InfoFiSignal'];
        meta: {
            name: 'InfoFiSignal';
        };
    };
    /**
     * Find zero or one InfoFiSignal that matches the filter.
     * @param {InfoFiSignalFindUniqueArgs} args - Arguments to find a InfoFiSignal
     * @example
     * // Get one InfoFiSignal
     * const infoFiSignal = await prisma.infoFiSignal.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InfoFiSignalFindUniqueArgs>(args: Prisma.SelectSubset<T, InfoFiSignalFindUniqueArgs<ExtArgs>>): Prisma.Prisma__InfoFiSignalClient<runtime.Types.Result.GetResult<Prisma.$InfoFiSignalPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one InfoFiSignal that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {InfoFiSignalFindUniqueOrThrowArgs} args - Arguments to find a InfoFiSignal
     * @example
     * // Get one InfoFiSignal
     * const infoFiSignal = await prisma.infoFiSignal.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InfoFiSignalFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, InfoFiSignalFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__InfoFiSignalClient<runtime.Types.Result.GetResult<Prisma.$InfoFiSignalPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first InfoFiSignal that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InfoFiSignalFindFirstArgs} args - Arguments to find a InfoFiSignal
     * @example
     * // Get one InfoFiSignal
     * const infoFiSignal = await prisma.infoFiSignal.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InfoFiSignalFindFirstArgs>(args?: Prisma.SelectSubset<T, InfoFiSignalFindFirstArgs<ExtArgs>>): Prisma.Prisma__InfoFiSignalClient<runtime.Types.Result.GetResult<Prisma.$InfoFiSignalPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first InfoFiSignal that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InfoFiSignalFindFirstOrThrowArgs} args - Arguments to find a InfoFiSignal
     * @example
     * // Get one InfoFiSignal
     * const infoFiSignal = await prisma.infoFiSignal.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InfoFiSignalFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, InfoFiSignalFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__InfoFiSignalClient<runtime.Types.Result.GetResult<Prisma.$InfoFiSignalPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more InfoFiSignals that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InfoFiSignalFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all InfoFiSignals
     * const infoFiSignals = await prisma.infoFiSignal.findMany()
     *
     * // Get first 10 InfoFiSignals
     * const infoFiSignals = await prisma.infoFiSignal.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const infoFiSignalWithIdOnly = await prisma.infoFiSignal.findMany({ select: { id: true } })
     *
     */
    findMany<T extends InfoFiSignalFindManyArgs>(args?: Prisma.SelectSubset<T, InfoFiSignalFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$InfoFiSignalPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a InfoFiSignal.
     * @param {InfoFiSignalCreateArgs} args - Arguments to create a InfoFiSignal.
     * @example
     * // Create one InfoFiSignal
     * const InfoFiSignal = await prisma.infoFiSignal.create({
     *   data: {
     *     // ... data to create a InfoFiSignal
     *   }
     * })
     *
     */
    create<T extends InfoFiSignalCreateArgs>(args: Prisma.SelectSubset<T, InfoFiSignalCreateArgs<ExtArgs>>): Prisma.Prisma__InfoFiSignalClient<runtime.Types.Result.GetResult<Prisma.$InfoFiSignalPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many InfoFiSignals.
     * @param {InfoFiSignalCreateManyArgs} args - Arguments to create many InfoFiSignals.
     * @example
     * // Create many InfoFiSignals
     * const infoFiSignal = await prisma.infoFiSignal.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends InfoFiSignalCreateManyArgs>(args?: Prisma.SelectSubset<T, InfoFiSignalCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many InfoFiSignals and returns the data saved in the database.
     * @param {InfoFiSignalCreateManyAndReturnArgs} args - Arguments to create many InfoFiSignals.
     * @example
     * // Create many InfoFiSignals
     * const infoFiSignal = await prisma.infoFiSignal.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many InfoFiSignals and only return the `id`
     * const infoFiSignalWithIdOnly = await prisma.infoFiSignal.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends InfoFiSignalCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, InfoFiSignalCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$InfoFiSignalPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a InfoFiSignal.
     * @param {InfoFiSignalDeleteArgs} args - Arguments to delete one InfoFiSignal.
     * @example
     * // Delete one InfoFiSignal
     * const InfoFiSignal = await prisma.infoFiSignal.delete({
     *   where: {
     *     // ... filter to delete one InfoFiSignal
     *   }
     * })
     *
     */
    delete<T extends InfoFiSignalDeleteArgs>(args: Prisma.SelectSubset<T, InfoFiSignalDeleteArgs<ExtArgs>>): Prisma.Prisma__InfoFiSignalClient<runtime.Types.Result.GetResult<Prisma.$InfoFiSignalPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one InfoFiSignal.
     * @param {InfoFiSignalUpdateArgs} args - Arguments to update one InfoFiSignal.
     * @example
     * // Update one InfoFiSignal
     * const infoFiSignal = await prisma.infoFiSignal.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends InfoFiSignalUpdateArgs>(args: Prisma.SelectSubset<T, InfoFiSignalUpdateArgs<ExtArgs>>): Prisma.Prisma__InfoFiSignalClient<runtime.Types.Result.GetResult<Prisma.$InfoFiSignalPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more InfoFiSignals.
     * @param {InfoFiSignalDeleteManyArgs} args - Arguments to filter InfoFiSignals to delete.
     * @example
     * // Delete a few InfoFiSignals
     * const { count } = await prisma.infoFiSignal.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends InfoFiSignalDeleteManyArgs>(args?: Prisma.SelectSubset<T, InfoFiSignalDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more InfoFiSignals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InfoFiSignalUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many InfoFiSignals
     * const infoFiSignal = await prisma.infoFiSignal.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends InfoFiSignalUpdateManyArgs>(args: Prisma.SelectSubset<T, InfoFiSignalUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more InfoFiSignals and returns the data updated in the database.
     * @param {InfoFiSignalUpdateManyAndReturnArgs} args - Arguments to update many InfoFiSignals.
     * @example
     * // Update many InfoFiSignals
     * const infoFiSignal = await prisma.infoFiSignal.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more InfoFiSignals and only return the `id`
     * const infoFiSignalWithIdOnly = await prisma.infoFiSignal.updateManyAndReturn({
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
    updateManyAndReturn<T extends InfoFiSignalUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, InfoFiSignalUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$InfoFiSignalPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one InfoFiSignal.
     * @param {InfoFiSignalUpsertArgs} args - Arguments to update or create a InfoFiSignal.
     * @example
     * // Update or create a InfoFiSignal
     * const infoFiSignal = await prisma.infoFiSignal.upsert({
     *   create: {
     *     // ... data to create a InfoFiSignal
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the InfoFiSignal we want to update
     *   }
     * })
     */
    upsert<T extends InfoFiSignalUpsertArgs>(args: Prisma.SelectSubset<T, InfoFiSignalUpsertArgs<ExtArgs>>): Prisma.Prisma__InfoFiSignalClient<runtime.Types.Result.GetResult<Prisma.$InfoFiSignalPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of InfoFiSignals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InfoFiSignalCountArgs} args - Arguments to filter InfoFiSignals to count.
     * @example
     * // Count the number of InfoFiSignals
     * const count = await prisma.infoFiSignal.count({
     *   where: {
     *     // ... the filter for the InfoFiSignals we want to count
     *   }
     * })
    **/
    count<T extends InfoFiSignalCountArgs>(args?: Prisma.Subset<T, InfoFiSignalCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], InfoFiSignalCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a InfoFiSignal.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InfoFiSignalAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends InfoFiSignalAggregateArgs>(args: Prisma.Subset<T, InfoFiSignalAggregateArgs>): Prisma.PrismaPromise<GetInfoFiSignalAggregateType<T>>;
    /**
     * Group by InfoFiSignal.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InfoFiSignalGroupByArgs} args - Group by arguments.
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
    groupBy<T extends InfoFiSignalGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: InfoFiSignalGroupByArgs['orderBy'];
    } : {
        orderBy?: InfoFiSignalGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, InfoFiSignalGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInfoFiSignalGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the InfoFiSignal model
     */
    readonly fields: InfoFiSignalFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for InfoFiSignal.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__InfoFiSignalClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    market<T extends Prisma.MarketDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MarketDefaultArgs<ExtArgs>>): Prisma.Prisma__MarketClient<runtime.Types.Result.GetResult<Prisma.$MarketPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the InfoFiSignal model
 */
export interface InfoFiSignalFieldRefs {
    readonly id: Prisma.FieldRef<"InfoFiSignal", 'Int'>;
    readonly marketId: Prisma.FieldRef<"InfoFiSignal", 'Int'>;
    readonly signalType: Prisma.FieldRef<"InfoFiSignal", 'String'>;
    readonly entity: Prisma.FieldRef<"InfoFiSignal", 'String'>;
    readonly value: Prisma.FieldRef<"InfoFiSignal", 'Float'>;
    readonly description: Prisma.FieldRef<"InfoFiSignal", 'String'>;
    readonly confidence: Prisma.FieldRef<"InfoFiSignal", 'Float'>;
    readonly timestamp: Prisma.FieldRef<"InfoFiSignal", 'DateTime'>;
}
/**
 * InfoFiSignal findUnique
 */
export type InfoFiSignalFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which InfoFiSignal to fetch.
     */
    where: Prisma.InfoFiSignalWhereUniqueInput;
};
/**
 * InfoFiSignal findUniqueOrThrow
 */
export type InfoFiSignalFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which InfoFiSignal to fetch.
     */
    where: Prisma.InfoFiSignalWhereUniqueInput;
};
/**
 * InfoFiSignal findFirst
 */
export type InfoFiSignalFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which InfoFiSignal to fetch.
     */
    where?: Prisma.InfoFiSignalWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of InfoFiSignals to fetch.
     */
    orderBy?: Prisma.InfoFiSignalOrderByWithRelationInput | Prisma.InfoFiSignalOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for InfoFiSignals.
     */
    cursor?: Prisma.InfoFiSignalWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` InfoFiSignals from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` InfoFiSignals.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of InfoFiSignals.
     */
    distinct?: Prisma.InfoFiSignalScalarFieldEnum | Prisma.InfoFiSignalScalarFieldEnum[];
};
/**
 * InfoFiSignal findFirstOrThrow
 */
export type InfoFiSignalFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which InfoFiSignal to fetch.
     */
    where?: Prisma.InfoFiSignalWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of InfoFiSignals to fetch.
     */
    orderBy?: Prisma.InfoFiSignalOrderByWithRelationInput | Prisma.InfoFiSignalOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for InfoFiSignals.
     */
    cursor?: Prisma.InfoFiSignalWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` InfoFiSignals from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` InfoFiSignals.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of InfoFiSignals.
     */
    distinct?: Prisma.InfoFiSignalScalarFieldEnum | Prisma.InfoFiSignalScalarFieldEnum[];
};
/**
 * InfoFiSignal findMany
 */
export type InfoFiSignalFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which InfoFiSignals to fetch.
     */
    where?: Prisma.InfoFiSignalWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of InfoFiSignals to fetch.
     */
    orderBy?: Prisma.InfoFiSignalOrderByWithRelationInput | Prisma.InfoFiSignalOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing InfoFiSignals.
     */
    cursor?: Prisma.InfoFiSignalWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` InfoFiSignals from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` InfoFiSignals.
     */
    skip?: number;
    distinct?: Prisma.InfoFiSignalScalarFieldEnum | Prisma.InfoFiSignalScalarFieldEnum[];
};
/**
 * InfoFiSignal create
 */
export type InfoFiSignalCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to create a InfoFiSignal.
     */
    data: Prisma.XOR<Prisma.InfoFiSignalCreateInput, Prisma.InfoFiSignalUncheckedCreateInput>;
};
/**
 * InfoFiSignal createMany
 */
export type InfoFiSignalCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many InfoFiSignals.
     */
    data: Prisma.InfoFiSignalCreateManyInput | Prisma.InfoFiSignalCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * InfoFiSignal createManyAndReturn
 */
export type InfoFiSignalCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InfoFiSignal
     */
    select?: Prisma.InfoFiSignalSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the InfoFiSignal
     */
    omit?: Prisma.InfoFiSignalOmit<ExtArgs> | null;
    /**
     * The data used to create many InfoFiSignals.
     */
    data: Prisma.InfoFiSignalCreateManyInput | Prisma.InfoFiSignalCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.InfoFiSignalIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * InfoFiSignal update
 */
export type InfoFiSignalUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to update a InfoFiSignal.
     */
    data: Prisma.XOR<Prisma.InfoFiSignalUpdateInput, Prisma.InfoFiSignalUncheckedUpdateInput>;
    /**
     * Choose, which InfoFiSignal to update.
     */
    where: Prisma.InfoFiSignalWhereUniqueInput;
};
/**
 * InfoFiSignal updateMany
 */
export type InfoFiSignalUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update InfoFiSignals.
     */
    data: Prisma.XOR<Prisma.InfoFiSignalUpdateManyMutationInput, Prisma.InfoFiSignalUncheckedUpdateManyInput>;
    /**
     * Filter which InfoFiSignals to update
     */
    where?: Prisma.InfoFiSignalWhereInput;
    /**
     * Limit how many InfoFiSignals to update.
     */
    limit?: number;
};
/**
 * InfoFiSignal updateManyAndReturn
 */
export type InfoFiSignalUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InfoFiSignal
     */
    select?: Prisma.InfoFiSignalSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the InfoFiSignal
     */
    omit?: Prisma.InfoFiSignalOmit<ExtArgs> | null;
    /**
     * The data used to update InfoFiSignals.
     */
    data: Prisma.XOR<Prisma.InfoFiSignalUpdateManyMutationInput, Prisma.InfoFiSignalUncheckedUpdateManyInput>;
    /**
     * Filter which InfoFiSignals to update
     */
    where?: Prisma.InfoFiSignalWhereInput;
    /**
     * Limit how many InfoFiSignals to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.InfoFiSignalIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * InfoFiSignal upsert
 */
export type InfoFiSignalUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The filter to search for the InfoFiSignal to update in case it exists.
     */
    where: Prisma.InfoFiSignalWhereUniqueInput;
    /**
     * In case the InfoFiSignal found by the `where` argument doesn't exist, create a new InfoFiSignal with this data.
     */
    create: Prisma.XOR<Prisma.InfoFiSignalCreateInput, Prisma.InfoFiSignalUncheckedCreateInput>;
    /**
     * In case the InfoFiSignal was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.InfoFiSignalUpdateInput, Prisma.InfoFiSignalUncheckedUpdateInput>;
};
/**
 * InfoFiSignal delete
 */
export type InfoFiSignalDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter which InfoFiSignal to delete.
     */
    where: Prisma.InfoFiSignalWhereUniqueInput;
};
/**
 * InfoFiSignal deleteMany
 */
export type InfoFiSignalDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which InfoFiSignals to delete
     */
    where?: Prisma.InfoFiSignalWhereInput;
    /**
     * Limit how many InfoFiSignals to delete.
     */
    limit?: number;
};
/**
 * InfoFiSignal without action
 */
export type InfoFiSignalDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
export {};
