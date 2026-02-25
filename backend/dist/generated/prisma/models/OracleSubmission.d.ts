import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model OracleSubmission
 *
 */
export type OracleSubmissionModel = runtime.Types.Result.DefaultSelection<Prisma.$OracleSubmissionPayload>;
export type AggregateOracleSubmission = {
    _count: OracleSubmissionCountAggregateOutputType | null;
    _avg: OracleSubmissionAvgAggregateOutputType | null;
    _sum: OracleSubmissionSumAggregateOutputType | null;
    _min: OracleSubmissionMinAggregateOutputType | null;
    _max: OracleSubmissionMaxAggregateOutputType | null;
};
export type OracleSubmissionAvgAggregateOutputType = {
    id: number | null;
    marketId: number | null;
    outcome: number | null;
};
export type OracleSubmissionSumAggregateOutputType = {
    id: number | null;
    marketId: number | null;
    outcome: number | null;
};
export type OracleSubmissionMinAggregateOutputType = {
    id: number | null;
    marketId: number | null;
    outcome: number | null;
    source: string | null;
    txHash: string | null;
    status: $Enums.SubmissionStatus | null;
    submittedAt: Date | null;
    finalizedAt: Date | null;
};
export type OracleSubmissionMaxAggregateOutputType = {
    id: number | null;
    marketId: number | null;
    outcome: number | null;
    source: string | null;
    txHash: string | null;
    status: $Enums.SubmissionStatus | null;
    submittedAt: Date | null;
    finalizedAt: Date | null;
};
export type OracleSubmissionCountAggregateOutputType = {
    id: number;
    marketId: number;
    outcome: number;
    source: number;
    rawData: number;
    txHash: number;
    status: number;
    submittedAt: number;
    finalizedAt: number;
    _all: number;
};
export type OracleSubmissionAvgAggregateInputType = {
    id?: true;
    marketId?: true;
    outcome?: true;
};
export type OracleSubmissionSumAggregateInputType = {
    id?: true;
    marketId?: true;
    outcome?: true;
};
export type OracleSubmissionMinAggregateInputType = {
    id?: true;
    marketId?: true;
    outcome?: true;
    source?: true;
    txHash?: true;
    status?: true;
    submittedAt?: true;
    finalizedAt?: true;
};
export type OracleSubmissionMaxAggregateInputType = {
    id?: true;
    marketId?: true;
    outcome?: true;
    source?: true;
    txHash?: true;
    status?: true;
    submittedAt?: true;
    finalizedAt?: true;
};
export type OracleSubmissionCountAggregateInputType = {
    id?: true;
    marketId?: true;
    outcome?: true;
    source?: true;
    rawData?: true;
    txHash?: true;
    status?: true;
    submittedAt?: true;
    finalizedAt?: true;
    _all?: true;
};
export type OracleSubmissionAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which OracleSubmission to aggregate.
     */
    where?: Prisma.OracleSubmissionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of OracleSubmissions to fetch.
     */
    orderBy?: Prisma.OracleSubmissionOrderByWithRelationInput | Prisma.OracleSubmissionOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.OracleSubmissionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` OracleSubmissions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` OracleSubmissions.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned OracleSubmissions
    **/
    _count?: true | OracleSubmissionCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: OracleSubmissionAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: OracleSubmissionSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: OracleSubmissionMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: OracleSubmissionMaxAggregateInputType;
};
export type GetOracleSubmissionAggregateType<T extends OracleSubmissionAggregateArgs> = {
    [P in keyof T & keyof AggregateOracleSubmission]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateOracleSubmission[P]> : Prisma.GetScalarType<T[P], AggregateOracleSubmission[P]>;
};
export type OracleSubmissionGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OracleSubmissionWhereInput;
    orderBy?: Prisma.OracleSubmissionOrderByWithAggregationInput | Prisma.OracleSubmissionOrderByWithAggregationInput[];
    by: Prisma.OracleSubmissionScalarFieldEnum[] | Prisma.OracleSubmissionScalarFieldEnum;
    having?: Prisma.OracleSubmissionScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: OracleSubmissionCountAggregateInputType | true;
    _avg?: OracleSubmissionAvgAggregateInputType;
    _sum?: OracleSubmissionSumAggregateInputType;
    _min?: OracleSubmissionMinAggregateInputType;
    _max?: OracleSubmissionMaxAggregateInputType;
};
export type OracleSubmissionGroupByOutputType = {
    id: number;
    marketId: number;
    outcome: number;
    source: string;
    rawData: runtime.JsonValue;
    txHash: string | null;
    status: $Enums.SubmissionStatus;
    submittedAt: Date;
    finalizedAt: Date | null;
    _count: OracleSubmissionCountAggregateOutputType | null;
    _avg: OracleSubmissionAvgAggregateOutputType | null;
    _sum: OracleSubmissionSumAggregateOutputType | null;
    _min: OracleSubmissionMinAggregateOutputType | null;
    _max: OracleSubmissionMaxAggregateOutputType | null;
};
type GetOracleSubmissionGroupByPayload<T extends OracleSubmissionGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<OracleSubmissionGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof OracleSubmissionGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], OracleSubmissionGroupByOutputType[P]> : Prisma.GetScalarType<T[P], OracleSubmissionGroupByOutputType[P]>;
}>>;
export type OracleSubmissionWhereInput = {
    AND?: Prisma.OracleSubmissionWhereInput | Prisma.OracleSubmissionWhereInput[];
    OR?: Prisma.OracleSubmissionWhereInput[];
    NOT?: Prisma.OracleSubmissionWhereInput | Prisma.OracleSubmissionWhereInput[];
    id?: Prisma.IntFilter<"OracleSubmission"> | number;
    marketId?: Prisma.IntFilter<"OracleSubmission"> | number;
    outcome?: Prisma.IntFilter<"OracleSubmission"> | number;
    source?: Prisma.StringFilter<"OracleSubmission"> | string;
    rawData?: Prisma.JsonFilter<"OracleSubmission">;
    txHash?: Prisma.StringNullableFilter<"OracleSubmission"> | string | null;
    status?: Prisma.EnumSubmissionStatusFilter<"OracleSubmission"> | $Enums.SubmissionStatus;
    submittedAt?: Prisma.DateTimeFilter<"OracleSubmission"> | Date | string;
    finalizedAt?: Prisma.DateTimeNullableFilter<"OracleSubmission"> | Date | string | null;
};
export type OracleSubmissionOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    marketId?: Prisma.SortOrder;
    outcome?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
    rawData?: Prisma.SortOrder;
    txHash?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    submittedAt?: Prisma.SortOrder;
    finalizedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
};
export type OracleSubmissionWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    AND?: Prisma.OracleSubmissionWhereInput | Prisma.OracleSubmissionWhereInput[];
    OR?: Prisma.OracleSubmissionWhereInput[];
    NOT?: Prisma.OracleSubmissionWhereInput | Prisma.OracleSubmissionWhereInput[];
    marketId?: Prisma.IntFilter<"OracleSubmission"> | number;
    outcome?: Prisma.IntFilter<"OracleSubmission"> | number;
    source?: Prisma.StringFilter<"OracleSubmission"> | string;
    rawData?: Prisma.JsonFilter<"OracleSubmission">;
    txHash?: Prisma.StringNullableFilter<"OracleSubmission"> | string | null;
    status?: Prisma.EnumSubmissionStatusFilter<"OracleSubmission"> | $Enums.SubmissionStatus;
    submittedAt?: Prisma.DateTimeFilter<"OracleSubmission"> | Date | string;
    finalizedAt?: Prisma.DateTimeNullableFilter<"OracleSubmission"> | Date | string | null;
}, "id">;
export type OracleSubmissionOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    marketId?: Prisma.SortOrder;
    outcome?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
    rawData?: Prisma.SortOrder;
    txHash?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    submittedAt?: Prisma.SortOrder;
    finalizedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.OracleSubmissionCountOrderByAggregateInput;
    _avg?: Prisma.OracleSubmissionAvgOrderByAggregateInput;
    _max?: Prisma.OracleSubmissionMaxOrderByAggregateInput;
    _min?: Prisma.OracleSubmissionMinOrderByAggregateInput;
    _sum?: Prisma.OracleSubmissionSumOrderByAggregateInput;
};
export type OracleSubmissionScalarWhereWithAggregatesInput = {
    AND?: Prisma.OracleSubmissionScalarWhereWithAggregatesInput | Prisma.OracleSubmissionScalarWhereWithAggregatesInput[];
    OR?: Prisma.OracleSubmissionScalarWhereWithAggregatesInput[];
    NOT?: Prisma.OracleSubmissionScalarWhereWithAggregatesInput | Prisma.OracleSubmissionScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"OracleSubmission"> | number;
    marketId?: Prisma.IntWithAggregatesFilter<"OracleSubmission"> | number;
    outcome?: Prisma.IntWithAggregatesFilter<"OracleSubmission"> | number;
    source?: Prisma.StringWithAggregatesFilter<"OracleSubmission"> | string;
    rawData?: Prisma.JsonWithAggregatesFilter<"OracleSubmission">;
    txHash?: Prisma.StringNullableWithAggregatesFilter<"OracleSubmission"> | string | null;
    status?: Prisma.EnumSubmissionStatusWithAggregatesFilter<"OracleSubmission"> | $Enums.SubmissionStatus;
    submittedAt?: Prisma.DateTimeWithAggregatesFilter<"OracleSubmission"> | Date | string;
    finalizedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"OracleSubmission"> | Date | string | null;
};
export type OracleSubmissionCreateInput = {
    marketId: number;
    outcome: number;
    source: string;
    rawData: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    txHash?: string | null;
    status?: $Enums.SubmissionStatus;
    submittedAt?: Date | string;
    finalizedAt?: Date | string | null;
};
export type OracleSubmissionUncheckedCreateInput = {
    id?: number;
    marketId: number;
    outcome: number;
    source: string;
    rawData: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    txHash?: string | null;
    status?: $Enums.SubmissionStatus;
    submittedAt?: Date | string;
    finalizedAt?: Date | string | null;
};
export type OracleSubmissionUpdateInput = {
    marketId?: Prisma.IntFieldUpdateOperationsInput | number;
    outcome?: Prisma.IntFieldUpdateOperationsInput | number;
    source?: Prisma.StringFieldUpdateOperationsInput | string;
    rawData?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    txHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumSubmissionStatusFieldUpdateOperationsInput | $Enums.SubmissionStatus;
    submittedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    finalizedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type OracleSubmissionUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    marketId?: Prisma.IntFieldUpdateOperationsInput | number;
    outcome?: Prisma.IntFieldUpdateOperationsInput | number;
    source?: Prisma.StringFieldUpdateOperationsInput | string;
    rawData?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    txHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumSubmissionStatusFieldUpdateOperationsInput | $Enums.SubmissionStatus;
    submittedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    finalizedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type OracleSubmissionCreateManyInput = {
    id?: number;
    marketId: number;
    outcome: number;
    source: string;
    rawData: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    txHash?: string | null;
    status?: $Enums.SubmissionStatus;
    submittedAt?: Date | string;
    finalizedAt?: Date | string | null;
};
export type OracleSubmissionUpdateManyMutationInput = {
    marketId?: Prisma.IntFieldUpdateOperationsInput | number;
    outcome?: Prisma.IntFieldUpdateOperationsInput | number;
    source?: Prisma.StringFieldUpdateOperationsInput | string;
    rawData?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    txHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumSubmissionStatusFieldUpdateOperationsInput | $Enums.SubmissionStatus;
    submittedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    finalizedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type OracleSubmissionUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    marketId?: Prisma.IntFieldUpdateOperationsInput | number;
    outcome?: Prisma.IntFieldUpdateOperationsInput | number;
    source?: Prisma.StringFieldUpdateOperationsInput | string;
    rawData?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    txHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumSubmissionStatusFieldUpdateOperationsInput | $Enums.SubmissionStatus;
    submittedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    finalizedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type OracleSubmissionCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    marketId?: Prisma.SortOrder;
    outcome?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
    rawData?: Prisma.SortOrder;
    txHash?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    submittedAt?: Prisma.SortOrder;
    finalizedAt?: Prisma.SortOrder;
};
export type OracleSubmissionAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    marketId?: Prisma.SortOrder;
    outcome?: Prisma.SortOrder;
};
export type OracleSubmissionMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    marketId?: Prisma.SortOrder;
    outcome?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
    txHash?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    submittedAt?: Prisma.SortOrder;
    finalizedAt?: Prisma.SortOrder;
};
export type OracleSubmissionMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    marketId?: Prisma.SortOrder;
    outcome?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
    txHash?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    submittedAt?: Prisma.SortOrder;
    finalizedAt?: Prisma.SortOrder;
};
export type OracleSubmissionSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    marketId?: Prisma.SortOrder;
    outcome?: Prisma.SortOrder;
};
export type EnumSubmissionStatusFieldUpdateOperationsInput = {
    set?: $Enums.SubmissionStatus;
};
export type OracleSubmissionSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    marketId?: boolean;
    outcome?: boolean;
    source?: boolean;
    rawData?: boolean;
    txHash?: boolean;
    status?: boolean;
    submittedAt?: boolean;
    finalizedAt?: boolean;
}, ExtArgs["result"]["oracleSubmission"]>;
export type OracleSubmissionSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    marketId?: boolean;
    outcome?: boolean;
    source?: boolean;
    rawData?: boolean;
    txHash?: boolean;
    status?: boolean;
    submittedAt?: boolean;
    finalizedAt?: boolean;
}, ExtArgs["result"]["oracleSubmission"]>;
export type OracleSubmissionSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    marketId?: boolean;
    outcome?: boolean;
    source?: boolean;
    rawData?: boolean;
    txHash?: boolean;
    status?: boolean;
    submittedAt?: boolean;
    finalizedAt?: boolean;
}, ExtArgs["result"]["oracleSubmission"]>;
export type OracleSubmissionSelectScalar = {
    id?: boolean;
    marketId?: boolean;
    outcome?: boolean;
    source?: boolean;
    rawData?: boolean;
    txHash?: boolean;
    status?: boolean;
    submittedAt?: boolean;
    finalizedAt?: boolean;
};
export type OracleSubmissionOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "marketId" | "outcome" | "source" | "rawData" | "txHash" | "status" | "submittedAt" | "finalizedAt", ExtArgs["result"]["oracleSubmission"]>;
export type $OracleSubmissionPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "OracleSubmission";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        marketId: number;
        outcome: number;
        source: string;
        rawData: runtime.JsonValue;
        txHash: string | null;
        status: $Enums.SubmissionStatus;
        submittedAt: Date;
        finalizedAt: Date | null;
    }, ExtArgs["result"]["oracleSubmission"]>;
    composites: {};
};
export type OracleSubmissionGetPayload<S extends boolean | null | undefined | OracleSubmissionDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$OracleSubmissionPayload, S>;
export type OracleSubmissionCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<OracleSubmissionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: OracleSubmissionCountAggregateInputType | true;
};
export interface OracleSubmissionDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['OracleSubmission'];
        meta: {
            name: 'OracleSubmission';
        };
    };
    /**
     * Find zero or one OracleSubmission that matches the filter.
     * @param {OracleSubmissionFindUniqueArgs} args - Arguments to find a OracleSubmission
     * @example
     * // Get one OracleSubmission
     * const oracleSubmission = await prisma.oracleSubmission.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OracleSubmissionFindUniqueArgs>(args: Prisma.SelectSubset<T, OracleSubmissionFindUniqueArgs<ExtArgs>>): Prisma.Prisma__OracleSubmissionClient<runtime.Types.Result.GetResult<Prisma.$OracleSubmissionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one OracleSubmission that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OracleSubmissionFindUniqueOrThrowArgs} args - Arguments to find a OracleSubmission
     * @example
     * // Get one OracleSubmission
     * const oracleSubmission = await prisma.oracleSubmission.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OracleSubmissionFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, OracleSubmissionFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__OracleSubmissionClient<runtime.Types.Result.GetResult<Prisma.$OracleSubmissionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first OracleSubmission that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OracleSubmissionFindFirstArgs} args - Arguments to find a OracleSubmission
     * @example
     * // Get one OracleSubmission
     * const oracleSubmission = await prisma.oracleSubmission.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OracleSubmissionFindFirstArgs>(args?: Prisma.SelectSubset<T, OracleSubmissionFindFirstArgs<ExtArgs>>): Prisma.Prisma__OracleSubmissionClient<runtime.Types.Result.GetResult<Prisma.$OracleSubmissionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first OracleSubmission that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OracleSubmissionFindFirstOrThrowArgs} args - Arguments to find a OracleSubmission
     * @example
     * // Get one OracleSubmission
     * const oracleSubmission = await prisma.oracleSubmission.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OracleSubmissionFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, OracleSubmissionFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__OracleSubmissionClient<runtime.Types.Result.GetResult<Prisma.$OracleSubmissionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more OracleSubmissions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OracleSubmissionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OracleSubmissions
     * const oracleSubmissions = await prisma.oracleSubmission.findMany()
     *
     * // Get first 10 OracleSubmissions
     * const oracleSubmissions = await prisma.oracleSubmission.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const oracleSubmissionWithIdOnly = await prisma.oracleSubmission.findMany({ select: { id: true } })
     *
     */
    findMany<T extends OracleSubmissionFindManyArgs>(args?: Prisma.SelectSubset<T, OracleSubmissionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OracleSubmissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a OracleSubmission.
     * @param {OracleSubmissionCreateArgs} args - Arguments to create a OracleSubmission.
     * @example
     * // Create one OracleSubmission
     * const OracleSubmission = await prisma.oracleSubmission.create({
     *   data: {
     *     // ... data to create a OracleSubmission
     *   }
     * })
     *
     */
    create<T extends OracleSubmissionCreateArgs>(args: Prisma.SelectSubset<T, OracleSubmissionCreateArgs<ExtArgs>>): Prisma.Prisma__OracleSubmissionClient<runtime.Types.Result.GetResult<Prisma.$OracleSubmissionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many OracleSubmissions.
     * @param {OracleSubmissionCreateManyArgs} args - Arguments to create many OracleSubmissions.
     * @example
     * // Create many OracleSubmissions
     * const oracleSubmission = await prisma.oracleSubmission.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends OracleSubmissionCreateManyArgs>(args?: Prisma.SelectSubset<T, OracleSubmissionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many OracleSubmissions and returns the data saved in the database.
     * @param {OracleSubmissionCreateManyAndReturnArgs} args - Arguments to create many OracleSubmissions.
     * @example
     * // Create many OracleSubmissions
     * const oracleSubmission = await prisma.oracleSubmission.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many OracleSubmissions and only return the `id`
     * const oracleSubmissionWithIdOnly = await prisma.oracleSubmission.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends OracleSubmissionCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, OracleSubmissionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OracleSubmissionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a OracleSubmission.
     * @param {OracleSubmissionDeleteArgs} args - Arguments to delete one OracleSubmission.
     * @example
     * // Delete one OracleSubmission
     * const OracleSubmission = await prisma.oracleSubmission.delete({
     *   where: {
     *     // ... filter to delete one OracleSubmission
     *   }
     * })
     *
     */
    delete<T extends OracleSubmissionDeleteArgs>(args: Prisma.SelectSubset<T, OracleSubmissionDeleteArgs<ExtArgs>>): Prisma.Prisma__OracleSubmissionClient<runtime.Types.Result.GetResult<Prisma.$OracleSubmissionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one OracleSubmission.
     * @param {OracleSubmissionUpdateArgs} args - Arguments to update one OracleSubmission.
     * @example
     * // Update one OracleSubmission
     * const oracleSubmission = await prisma.oracleSubmission.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends OracleSubmissionUpdateArgs>(args: Prisma.SelectSubset<T, OracleSubmissionUpdateArgs<ExtArgs>>): Prisma.Prisma__OracleSubmissionClient<runtime.Types.Result.GetResult<Prisma.$OracleSubmissionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more OracleSubmissions.
     * @param {OracleSubmissionDeleteManyArgs} args - Arguments to filter OracleSubmissions to delete.
     * @example
     * // Delete a few OracleSubmissions
     * const { count } = await prisma.oracleSubmission.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends OracleSubmissionDeleteManyArgs>(args?: Prisma.SelectSubset<T, OracleSubmissionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more OracleSubmissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OracleSubmissionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OracleSubmissions
     * const oracleSubmission = await prisma.oracleSubmission.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends OracleSubmissionUpdateManyArgs>(args: Prisma.SelectSubset<T, OracleSubmissionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more OracleSubmissions and returns the data updated in the database.
     * @param {OracleSubmissionUpdateManyAndReturnArgs} args - Arguments to update many OracleSubmissions.
     * @example
     * // Update many OracleSubmissions
     * const oracleSubmission = await prisma.oracleSubmission.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more OracleSubmissions and only return the `id`
     * const oracleSubmissionWithIdOnly = await prisma.oracleSubmission.updateManyAndReturn({
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
    updateManyAndReturn<T extends OracleSubmissionUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, OracleSubmissionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OracleSubmissionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one OracleSubmission.
     * @param {OracleSubmissionUpsertArgs} args - Arguments to update or create a OracleSubmission.
     * @example
     * // Update or create a OracleSubmission
     * const oracleSubmission = await prisma.oracleSubmission.upsert({
     *   create: {
     *     // ... data to create a OracleSubmission
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OracleSubmission we want to update
     *   }
     * })
     */
    upsert<T extends OracleSubmissionUpsertArgs>(args: Prisma.SelectSubset<T, OracleSubmissionUpsertArgs<ExtArgs>>): Prisma.Prisma__OracleSubmissionClient<runtime.Types.Result.GetResult<Prisma.$OracleSubmissionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of OracleSubmissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OracleSubmissionCountArgs} args - Arguments to filter OracleSubmissions to count.
     * @example
     * // Count the number of OracleSubmissions
     * const count = await prisma.oracleSubmission.count({
     *   where: {
     *     // ... the filter for the OracleSubmissions we want to count
     *   }
     * })
    **/
    count<T extends OracleSubmissionCountArgs>(args?: Prisma.Subset<T, OracleSubmissionCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], OracleSubmissionCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a OracleSubmission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OracleSubmissionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends OracleSubmissionAggregateArgs>(args: Prisma.Subset<T, OracleSubmissionAggregateArgs>): Prisma.PrismaPromise<GetOracleSubmissionAggregateType<T>>;
    /**
     * Group by OracleSubmission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OracleSubmissionGroupByArgs} args - Group by arguments.
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
    groupBy<T extends OracleSubmissionGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: OracleSubmissionGroupByArgs['orderBy'];
    } : {
        orderBy?: OracleSubmissionGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, OracleSubmissionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOracleSubmissionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the OracleSubmission model
     */
    readonly fields: OracleSubmissionFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for OracleSubmission.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__OracleSubmissionClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
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
 * Fields of the OracleSubmission model
 */
export interface OracleSubmissionFieldRefs {
    readonly id: Prisma.FieldRef<"OracleSubmission", 'Int'>;
    readonly marketId: Prisma.FieldRef<"OracleSubmission", 'Int'>;
    readonly outcome: Prisma.FieldRef<"OracleSubmission", 'Int'>;
    readonly source: Prisma.FieldRef<"OracleSubmission", 'String'>;
    readonly rawData: Prisma.FieldRef<"OracleSubmission", 'Json'>;
    readonly txHash: Prisma.FieldRef<"OracleSubmission", 'String'>;
    readonly status: Prisma.FieldRef<"OracleSubmission", 'SubmissionStatus'>;
    readonly submittedAt: Prisma.FieldRef<"OracleSubmission", 'DateTime'>;
    readonly finalizedAt: Prisma.FieldRef<"OracleSubmission", 'DateTime'>;
}
/**
 * OracleSubmission findUnique
 */
export type OracleSubmissionFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OracleSubmission
     */
    select?: Prisma.OracleSubmissionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the OracleSubmission
     */
    omit?: Prisma.OracleSubmissionOmit<ExtArgs> | null;
    /**
     * Filter, which OracleSubmission to fetch.
     */
    where: Prisma.OracleSubmissionWhereUniqueInput;
};
/**
 * OracleSubmission findUniqueOrThrow
 */
export type OracleSubmissionFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OracleSubmission
     */
    select?: Prisma.OracleSubmissionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the OracleSubmission
     */
    omit?: Prisma.OracleSubmissionOmit<ExtArgs> | null;
    /**
     * Filter, which OracleSubmission to fetch.
     */
    where: Prisma.OracleSubmissionWhereUniqueInput;
};
/**
 * OracleSubmission findFirst
 */
export type OracleSubmissionFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OracleSubmission
     */
    select?: Prisma.OracleSubmissionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the OracleSubmission
     */
    omit?: Prisma.OracleSubmissionOmit<ExtArgs> | null;
    /**
     * Filter, which OracleSubmission to fetch.
     */
    where?: Prisma.OracleSubmissionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of OracleSubmissions to fetch.
     */
    orderBy?: Prisma.OracleSubmissionOrderByWithRelationInput | Prisma.OracleSubmissionOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for OracleSubmissions.
     */
    cursor?: Prisma.OracleSubmissionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` OracleSubmissions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` OracleSubmissions.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of OracleSubmissions.
     */
    distinct?: Prisma.OracleSubmissionScalarFieldEnum | Prisma.OracleSubmissionScalarFieldEnum[];
};
/**
 * OracleSubmission findFirstOrThrow
 */
export type OracleSubmissionFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OracleSubmission
     */
    select?: Prisma.OracleSubmissionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the OracleSubmission
     */
    omit?: Prisma.OracleSubmissionOmit<ExtArgs> | null;
    /**
     * Filter, which OracleSubmission to fetch.
     */
    where?: Prisma.OracleSubmissionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of OracleSubmissions to fetch.
     */
    orderBy?: Prisma.OracleSubmissionOrderByWithRelationInput | Prisma.OracleSubmissionOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for OracleSubmissions.
     */
    cursor?: Prisma.OracleSubmissionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` OracleSubmissions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` OracleSubmissions.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of OracleSubmissions.
     */
    distinct?: Prisma.OracleSubmissionScalarFieldEnum | Prisma.OracleSubmissionScalarFieldEnum[];
};
/**
 * OracleSubmission findMany
 */
export type OracleSubmissionFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OracleSubmission
     */
    select?: Prisma.OracleSubmissionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the OracleSubmission
     */
    omit?: Prisma.OracleSubmissionOmit<ExtArgs> | null;
    /**
     * Filter, which OracleSubmissions to fetch.
     */
    where?: Prisma.OracleSubmissionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of OracleSubmissions to fetch.
     */
    orderBy?: Prisma.OracleSubmissionOrderByWithRelationInput | Prisma.OracleSubmissionOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing OracleSubmissions.
     */
    cursor?: Prisma.OracleSubmissionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` OracleSubmissions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` OracleSubmissions.
     */
    skip?: number;
    distinct?: Prisma.OracleSubmissionScalarFieldEnum | Prisma.OracleSubmissionScalarFieldEnum[];
};
/**
 * OracleSubmission create
 */
export type OracleSubmissionCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OracleSubmission
     */
    select?: Prisma.OracleSubmissionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the OracleSubmission
     */
    omit?: Prisma.OracleSubmissionOmit<ExtArgs> | null;
    /**
     * The data needed to create a OracleSubmission.
     */
    data: Prisma.XOR<Prisma.OracleSubmissionCreateInput, Prisma.OracleSubmissionUncheckedCreateInput>;
};
/**
 * OracleSubmission createMany
 */
export type OracleSubmissionCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many OracleSubmissions.
     */
    data: Prisma.OracleSubmissionCreateManyInput | Prisma.OracleSubmissionCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * OracleSubmission createManyAndReturn
 */
export type OracleSubmissionCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OracleSubmission
     */
    select?: Prisma.OracleSubmissionSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the OracleSubmission
     */
    omit?: Prisma.OracleSubmissionOmit<ExtArgs> | null;
    /**
     * The data used to create many OracleSubmissions.
     */
    data: Prisma.OracleSubmissionCreateManyInput | Prisma.OracleSubmissionCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * OracleSubmission update
 */
export type OracleSubmissionUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OracleSubmission
     */
    select?: Prisma.OracleSubmissionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the OracleSubmission
     */
    omit?: Prisma.OracleSubmissionOmit<ExtArgs> | null;
    /**
     * The data needed to update a OracleSubmission.
     */
    data: Prisma.XOR<Prisma.OracleSubmissionUpdateInput, Prisma.OracleSubmissionUncheckedUpdateInput>;
    /**
     * Choose, which OracleSubmission to update.
     */
    where: Prisma.OracleSubmissionWhereUniqueInput;
};
/**
 * OracleSubmission updateMany
 */
export type OracleSubmissionUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update OracleSubmissions.
     */
    data: Prisma.XOR<Prisma.OracleSubmissionUpdateManyMutationInput, Prisma.OracleSubmissionUncheckedUpdateManyInput>;
    /**
     * Filter which OracleSubmissions to update
     */
    where?: Prisma.OracleSubmissionWhereInput;
    /**
     * Limit how many OracleSubmissions to update.
     */
    limit?: number;
};
/**
 * OracleSubmission updateManyAndReturn
 */
export type OracleSubmissionUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OracleSubmission
     */
    select?: Prisma.OracleSubmissionSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the OracleSubmission
     */
    omit?: Prisma.OracleSubmissionOmit<ExtArgs> | null;
    /**
     * The data used to update OracleSubmissions.
     */
    data: Prisma.XOR<Prisma.OracleSubmissionUpdateManyMutationInput, Prisma.OracleSubmissionUncheckedUpdateManyInput>;
    /**
     * Filter which OracleSubmissions to update
     */
    where?: Prisma.OracleSubmissionWhereInput;
    /**
     * Limit how many OracleSubmissions to update.
     */
    limit?: number;
};
/**
 * OracleSubmission upsert
 */
export type OracleSubmissionUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OracleSubmission
     */
    select?: Prisma.OracleSubmissionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the OracleSubmission
     */
    omit?: Prisma.OracleSubmissionOmit<ExtArgs> | null;
    /**
     * The filter to search for the OracleSubmission to update in case it exists.
     */
    where: Prisma.OracleSubmissionWhereUniqueInput;
    /**
     * In case the OracleSubmission found by the `where` argument doesn't exist, create a new OracleSubmission with this data.
     */
    create: Prisma.XOR<Prisma.OracleSubmissionCreateInput, Prisma.OracleSubmissionUncheckedCreateInput>;
    /**
     * In case the OracleSubmission was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.OracleSubmissionUpdateInput, Prisma.OracleSubmissionUncheckedUpdateInput>;
};
/**
 * OracleSubmission delete
 */
export type OracleSubmissionDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OracleSubmission
     */
    select?: Prisma.OracleSubmissionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the OracleSubmission
     */
    omit?: Prisma.OracleSubmissionOmit<ExtArgs> | null;
    /**
     * Filter which OracleSubmission to delete.
     */
    where: Prisma.OracleSubmissionWhereUniqueInput;
};
/**
 * OracleSubmission deleteMany
 */
export type OracleSubmissionDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which OracleSubmissions to delete
     */
    where?: Prisma.OracleSubmissionWhereInput;
    /**
     * Limit how many OracleSubmissions to delete.
     */
    limit?: number;
};
/**
 * OracleSubmission without action
 */
export type OracleSubmissionDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OracleSubmission
     */
    select?: Prisma.OracleSubmissionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the OracleSubmission
     */
    omit?: Prisma.OracleSubmissionOmit<ExtArgs> | null;
};
export {};
