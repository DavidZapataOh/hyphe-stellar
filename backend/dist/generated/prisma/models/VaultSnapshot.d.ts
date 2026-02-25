import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model VaultSnapshot
 *
 */
export type VaultSnapshotModel = runtime.Types.Result.DefaultSelection<Prisma.$VaultSnapshotPayload>;
export type AggregateVaultSnapshot = {
    _count: VaultSnapshotCountAggregateOutputType | null;
    _avg: VaultSnapshotAvgAggregateOutputType | null;
    _sum: VaultSnapshotSumAggregateOutputType | null;
    _min: VaultSnapshotMinAggregateOutputType | null;
    _max: VaultSnapshotMaxAggregateOutputType | null;
};
export type VaultSnapshotAvgAggregateOutputType = {
    id: number | null;
    tvl: number | null;
    blendBalance: number | null;
    bufferBalance: number | null;
    yieldGenerated: number | null;
    yieldCumulative: number | null;
    apyEstimate: number | null;
};
export type VaultSnapshotSumAggregateOutputType = {
    id: number | null;
    tvl: bigint | null;
    blendBalance: bigint | null;
    bufferBalance: bigint | null;
    yieldGenerated: bigint | null;
    yieldCumulative: bigint | null;
    apyEstimate: number | null;
};
export type VaultSnapshotMinAggregateOutputType = {
    id: number | null;
    tvl: bigint | null;
    blendBalance: bigint | null;
    bufferBalance: bigint | null;
    yieldGenerated: bigint | null;
    yieldCumulative: bigint | null;
    apyEstimate: number | null;
    timestamp: Date | null;
};
export type VaultSnapshotMaxAggregateOutputType = {
    id: number | null;
    tvl: bigint | null;
    blendBalance: bigint | null;
    bufferBalance: bigint | null;
    yieldGenerated: bigint | null;
    yieldCumulative: bigint | null;
    apyEstimate: number | null;
    timestamp: Date | null;
};
export type VaultSnapshotCountAggregateOutputType = {
    id: number;
    tvl: number;
    blendBalance: number;
    bufferBalance: number;
    yieldGenerated: number;
    yieldCumulative: number;
    apyEstimate: number;
    timestamp: number;
    _all: number;
};
export type VaultSnapshotAvgAggregateInputType = {
    id?: true;
    tvl?: true;
    blendBalance?: true;
    bufferBalance?: true;
    yieldGenerated?: true;
    yieldCumulative?: true;
    apyEstimate?: true;
};
export type VaultSnapshotSumAggregateInputType = {
    id?: true;
    tvl?: true;
    blendBalance?: true;
    bufferBalance?: true;
    yieldGenerated?: true;
    yieldCumulative?: true;
    apyEstimate?: true;
};
export type VaultSnapshotMinAggregateInputType = {
    id?: true;
    tvl?: true;
    blendBalance?: true;
    bufferBalance?: true;
    yieldGenerated?: true;
    yieldCumulative?: true;
    apyEstimate?: true;
    timestamp?: true;
};
export type VaultSnapshotMaxAggregateInputType = {
    id?: true;
    tvl?: true;
    blendBalance?: true;
    bufferBalance?: true;
    yieldGenerated?: true;
    yieldCumulative?: true;
    apyEstimate?: true;
    timestamp?: true;
};
export type VaultSnapshotCountAggregateInputType = {
    id?: true;
    tvl?: true;
    blendBalance?: true;
    bufferBalance?: true;
    yieldGenerated?: true;
    yieldCumulative?: true;
    apyEstimate?: true;
    timestamp?: true;
    _all?: true;
};
export type VaultSnapshotAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which VaultSnapshot to aggregate.
     */
    where?: Prisma.VaultSnapshotWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of VaultSnapshots to fetch.
     */
    orderBy?: Prisma.VaultSnapshotOrderByWithRelationInput | Prisma.VaultSnapshotOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.VaultSnapshotWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` VaultSnapshots from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` VaultSnapshots.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned VaultSnapshots
    **/
    _count?: true | VaultSnapshotCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: VaultSnapshotAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: VaultSnapshotSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: VaultSnapshotMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: VaultSnapshotMaxAggregateInputType;
};
export type GetVaultSnapshotAggregateType<T extends VaultSnapshotAggregateArgs> = {
    [P in keyof T & keyof AggregateVaultSnapshot]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateVaultSnapshot[P]> : Prisma.GetScalarType<T[P], AggregateVaultSnapshot[P]>;
};
export type VaultSnapshotGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.VaultSnapshotWhereInput;
    orderBy?: Prisma.VaultSnapshotOrderByWithAggregationInput | Prisma.VaultSnapshotOrderByWithAggregationInput[];
    by: Prisma.VaultSnapshotScalarFieldEnum[] | Prisma.VaultSnapshotScalarFieldEnum;
    having?: Prisma.VaultSnapshotScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: VaultSnapshotCountAggregateInputType | true;
    _avg?: VaultSnapshotAvgAggregateInputType;
    _sum?: VaultSnapshotSumAggregateInputType;
    _min?: VaultSnapshotMinAggregateInputType;
    _max?: VaultSnapshotMaxAggregateInputType;
};
export type VaultSnapshotGroupByOutputType = {
    id: number;
    tvl: bigint;
    blendBalance: bigint;
    bufferBalance: bigint;
    yieldGenerated: bigint;
    yieldCumulative: bigint;
    apyEstimate: number;
    timestamp: Date;
    _count: VaultSnapshotCountAggregateOutputType | null;
    _avg: VaultSnapshotAvgAggregateOutputType | null;
    _sum: VaultSnapshotSumAggregateOutputType | null;
    _min: VaultSnapshotMinAggregateOutputType | null;
    _max: VaultSnapshotMaxAggregateOutputType | null;
};
type GetVaultSnapshotGroupByPayload<T extends VaultSnapshotGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<VaultSnapshotGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof VaultSnapshotGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], VaultSnapshotGroupByOutputType[P]> : Prisma.GetScalarType<T[P], VaultSnapshotGroupByOutputType[P]>;
}>>;
export type VaultSnapshotWhereInput = {
    AND?: Prisma.VaultSnapshotWhereInput | Prisma.VaultSnapshotWhereInput[];
    OR?: Prisma.VaultSnapshotWhereInput[];
    NOT?: Prisma.VaultSnapshotWhereInput | Prisma.VaultSnapshotWhereInput[];
    id?: Prisma.IntFilter<"VaultSnapshot"> | number;
    tvl?: Prisma.BigIntFilter<"VaultSnapshot"> | bigint | number;
    blendBalance?: Prisma.BigIntFilter<"VaultSnapshot"> | bigint | number;
    bufferBalance?: Prisma.BigIntFilter<"VaultSnapshot"> | bigint | number;
    yieldGenerated?: Prisma.BigIntFilter<"VaultSnapshot"> | bigint | number;
    yieldCumulative?: Prisma.BigIntFilter<"VaultSnapshot"> | bigint | number;
    apyEstimate?: Prisma.FloatFilter<"VaultSnapshot"> | number;
    timestamp?: Prisma.DateTimeFilter<"VaultSnapshot"> | Date | string;
};
export type VaultSnapshotOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    tvl?: Prisma.SortOrder;
    blendBalance?: Prisma.SortOrder;
    bufferBalance?: Prisma.SortOrder;
    yieldGenerated?: Prisma.SortOrder;
    yieldCumulative?: Prisma.SortOrder;
    apyEstimate?: Prisma.SortOrder;
    timestamp?: Prisma.SortOrder;
};
export type VaultSnapshotWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    AND?: Prisma.VaultSnapshotWhereInput | Prisma.VaultSnapshotWhereInput[];
    OR?: Prisma.VaultSnapshotWhereInput[];
    NOT?: Prisma.VaultSnapshotWhereInput | Prisma.VaultSnapshotWhereInput[];
    tvl?: Prisma.BigIntFilter<"VaultSnapshot"> | bigint | number;
    blendBalance?: Prisma.BigIntFilter<"VaultSnapshot"> | bigint | number;
    bufferBalance?: Prisma.BigIntFilter<"VaultSnapshot"> | bigint | number;
    yieldGenerated?: Prisma.BigIntFilter<"VaultSnapshot"> | bigint | number;
    yieldCumulative?: Prisma.BigIntFilter<"VaultSnapshot"> | bigint | number;
    apyEstimate?: Prisma.FloatFilter<"VaultSnapshot"> | number;
    timestamp?: Prisma.DateTimeFilter<"VaultSnapshot"> | Date | string;
}, "id">;
export type VaultSnapshotOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    tvl?: Prisma.SortOrder;
    blendBalance?: Prisma.SortOrder;
    bufferBalance?: Prisma.SortOrder;
    yieldGenerated?: Prisma.SortOrder;
    yieldCumulative?: Prisma.SortOrder;
    apyEstimate?: Prisma.SortOrder;
    timestamp?: Prisma.SortOrder;
    _count?: Prisma.VaultSnapshotCountOrderByAggregateInput;
    _avg?: Prisma.VaultSnapshotAvgOrderByAggregateInput;
    _max?: Prisma.VaultSnapshotMaxOrderByAggregateInput;
    _min?: Prisma.VaultSnapshotMinOrderByAggregateInput;
    _sum?: Prisma.VaultSnapshotSumOrderByAggregateInput;
};
export type VaultSnapshotScalarWhereWithAggregatesInput = {
    AND?: Prisma.VaultSnapshotScalarWhereWithAggregatesInput | Prisma.VaultSnapshotScalarWhereWithAggregatesInput[];
    OR?: Prisma.VaultSnapshotScalarWhereWithAggregatesInput[];
    NOT?: Prisma.VaultSnapshotScalarWhereWithAggregatesInput | Prisma.VaultSnapshotScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"VaultSnapshot"> | number;
    tvl?: Prisma.BigIntWithAggregatesFilter<"VaultSnapshot"> | bigint | number;
    blendBalance?: Prisma.BigIntWithAggregatesFilter<"VaultSnapshot"> | bigint | number;
    bufferBalance?: Prisma.BigIntWithAggregatesFilter<"VaultSnapshot"> | bigint | number;
    yieldGenerated?: Prisma.BigIntWithAggregatesFilter<"VaultSnapshot"> | bigint | number;
    yieldCumulative?: Prisma.BigIntWithAggregatesFilter<"VaultSnapshot"> | bigint | number;
    apyEstimate?: Prisma.FloatWithAggregatesFilter<"VaultSnapshot"> | number;
    timestamp?: Prisma.DateTimeWithAggregatesFilter<"VaultSnapshot"> | Date | string;
};
export type VaultSnapshotCreateInput = {
    tvl: bigint | number;
    blendBalance: bigint | number;
    bufferBalance: bigint | number;
    yieldGenerated: bigint | number;
    yieldCumulative: bigint | number;
    apyEstimate: number;
    timestamp?: Date | string;
};
export type VaultSnapshotUncheckedCreateInput = {
    id?: number;
    tvl: bigint | number;
    blendBalance: bigint | number;
    bufferBalance: bigint | number;
    yieldGenerated: bigint | number;
    yieldCumulative: bigint | number;
    apyEstimate: number;
    timestamp?: Date | string;
};
export type VaultSnapshotUpdateInput = {
    tvl?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    blendBalance?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    bufferBalance?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    yieldGenerated?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    yieldCumulative?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    apyEstimate?: Prisma.FloatFieldUpdateOperationsInput | number;
    timestamp?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VaultSnapshotUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    tvl?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    blendBalance?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    bufferBalance?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    yieldGenerated?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    yieldCumulative?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    apyEstimate?: Prisma.FloatFieldUpdateOperationsInput | number;
    timestamp?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VaultSnapshotCreateManyInput = {
    id?: number;
    tvl: bigint | number;
    blendBalance: bigint | number;
    bufferBalance: bigint | number;
    yieldGenerated: bigint | number;
    yieldCumulative: bigint | number;
    apyEstimate: number;
    timestamp?: Date | string;
};
export type VaultSnapshotUpdateManyMutationInput = {
    tvl?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    blendBalance?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    bufferBalance?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    yieldGenerated?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    yieldCumulative?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    apyEstimate?: Prisma.FloatFieldUpdateOperationsInput | number;
    timestamp?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VaultSnapshotUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    tvl?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    blendBalance?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    bufferBalance?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    yieldGenerated?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    yieldCumulative?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    apyEstimate?: Prisma.FloatFieldUpdateOperationsInput | number;
    timestamp?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type VaultSnapshotCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tvl?: Prisma.SortOrder;
    blendBalance?: Prisma.SortOrder;
    bufferBalance?: Prisma.SortOrder;
    yieldGenerated?: Prisma.SortOrder;
    yieldCumulative?: Prisma.SortOrder;
    apyEstimate?: Prisma.SortOrder;
    timestamp?: Prisma.SortOrder;
};
export type VaultSnapshotAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tvl?: Prisma.SortOrder;
    blendBalance?: Prisma.SortOrder;
    bufferBalance?: Prisma.SortOrder;
    yieldGenerated?: Prisma.SortOrder;
    yieldCumulative?: Prisma.SortOrder;
    apyEstimate?: Prisma.SortOrder;
};
export type VaultSnapshotMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tvl?: Prisma.SortOrder;
    blendBalance?: Prisma.SortOrder;
    bufferBalance?: Prisma.SortOrder;
    yieldGenerated?: Prisma.SortOrder;
    yieldCumulative?: Prisma.SortOrder;
    apyEstimate?: Prisma.SortOrder;
    timestamp?: Prisma.SortOrder;
};
export type VaultSnapshotMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tvl?: Prisma.SortOrder;
    blendBalance?: Prisma.SortOrder;
    bufferBalance?: Prisma.SortOrder;
    yieldGenerated?: Prisma.SortOrder;
    yieldCumulative?: Prisma.SortOrder;
    apyEstimate?: Prisma.SortOrder;
    timestamp?: Prisma.SortOrder;
};
export type VaultSnapshotSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tvl?: Prisma.SortOrder;
    blendBalance?: Prisma.SortOrder;
    bufferBalance?: Prisma.SortOrder;
    yieldGenerated?: Prisma.SortOrder;
    yieldCumulative?: Prisma.SortOrder;
    apyEstimate?: Prisma.SortOrder;
};
export type VaultSnapshotSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tvl?: boolean;
    blendBalance?: boolean;
    bufferBalance?: boolean;
    yieldGenerated?: boolean;
    yieldCumulative?: boolean;
    apyEstimate?: boolean;
    timestamp?: boolean;
}, ExtArgs["result"]["vaultSnapshot"]>;
export type VaultSnapshotSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tvl?: boolean;
    blendBalance?: boolean;
    bufferBalance?: boolean;
    yieldGenerated?: boolean;
    yieldCumulative?: boolean;
    apyEstimate?: boolean;
    timestamp?: boolean;
}, ExtArgs["result"]["vaultSnapshot"]>;
export type VaultSnapshotSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tvl?: boolean;
    blendBalance?: boolean;
    bufferBalance?: boolean;
    yieldGenerated?: boolean;
    yieldCumulative?: boolean;
    apyEstimate?: boolean;
    timestamp?: boolean;
}, ExtArgs["result"]["vaultSnapshot"]>;
export type VaultSnapshotSelectScalar = {
    id?: boolean;
    tvl?: boolean;
    blendBalance?: boolean;
    bufferBalance?: boolean;
    yieldGenerated?: boolean;
    yieldCumulative?: boolean;
    apyEstimate?: boolean;
    timestamp?: boolean;
};
export type VaultSnapshotOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "tvl" | "blendBalance" | "bufferBalance" | "yieldGenerated" | "yieldCumulative" | "apyEstimate" | "timestamp", ExtArgs["result"]["vaultSnapshot"]>;
export type $VaultSnapshotPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "VaultSnapshot";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        tvl: bigint;
        blendBalance: bigint;
        bufferBalance: bigint;
        yieldGenerated: bigint;
        yieldCumulative: bigint;
        apyEstimate: number;
        timestamp: Date;
    }, ExtArgs["result"]["vaultSnapshot"]>;
    composites: {};
};
export type VaultSnapshotGetPayload<S extends boolean | null | undefined | VaultSnapshotDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$VaultSnapshotPayload, S>;
export type VaultSnapshotCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<VaultSnapshotFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: VaultSnapshotCountAggregateInputType | true;
};
export interface VaultSnapshotDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['VaultSnapshot'];
        meta: {
            name: 'VaultSnapshot';
        };
    };
    /**
     * Find zero or one VaultSnapshot that matches the filter.
     * @param {VaultSnapshotFindUniqueArgs} args - Arguments to find a VaultSnapshot
     * @example
     * // Get one VaultSnapshot
     * const vaultSnapshot = await prisma.vaultSnapshot.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VaultSnapshotFindUniqueArgs>(args: Prisma.SelectSubset<T, VaultSnapshotFindUniqueArgs<ExtArgs>>): Prisma.Prisma__VaultSnapshotClient<runtime.Types.Result.GetResult<Prisma.$VaultSnapshotPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one VaultSnapshot that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VaultSnapshotFindUniqueOrThrowArgs} args - Arguments to find a VaultSnapshot
     * @example
     * // Get one VaultSnapshot
     * const vaultSnapshot = await prisma.vaultSnapshot.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VaultSnapshotFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, VaultSnapshotFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__VaultSnapshotClient<runtime.Types.Result.GetResult<Prisma.$VaultSnapshotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first VaultSnapshot that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VaultSnapshotFindFirstArgs} args - Arguments to find a VaultSnapshot
     * @example
     * // Get one VaultSnapshot
     * const vaultSnapshot = await prisma.vaultSnapshot.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VaultSnapshotFindFirstArgs>(args?: Prisma.SelectSubset<T, VaultSnapshotFindFirstArgs<ExtArgs>>): Prisma.Prisma__VaultSnapshotClient<runtime.Types.Result.GetResult<Prisma.$VaultSnapshotPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first VaultSnapshot that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VaultSnapshotFindFirstOrThrowArgs} args - Arguments to find a VaultSnapshot
     * @example
     * // Get one VaultSnapshot
     * const vaultSnapshot = await prisma.vaultSnapshot.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VaultSnapshotFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, VaultSnapshotFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__VaultSnapshotClient<runtime.Types.Result.GetResult<Prisma.$VaultSnapshotPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more VaultSnapshots that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VaultSnapshotFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all VaultSnapshots
     * const vaultSnapshots = await prisma.vaultSnapshot.findMany()
     *
     * // Get first 10 VaultSnapshots
     * const vaultSnapshots = await prisma.vaultSnapshot.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const vaultSnapshotWithIdOnly = await prisma.vaultSnapshot.findMany({ select: { id: true } })
     *
     */
    findMany<T extends VaultSnapshotFindManyArgs>(args?: Prisma.SelectSubset<T, VaultSnapshotFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$VaultSnapshotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a VaultSnapshot.
     * @param {VaultSnapshotCreateArgs} args - Arguments to create a VaultSnapshot.
     * @example
     * // Create one VaultSnapshot
     * const VaultSnapshot = await prisma.vaultSnapshot.create({
     *   data: {
     *     // ... data to create a VaultSnapshot
     *   }
     * })
     *
     */
    create<T extends VaultSnapshotCreateArgs>(args: Prisma.SelectSubset<T, VaultSnapshotCreateArgs<ExtArgs>>): Prisma.Prisma__VaultSnapshotClient<runtime.Types.Result.GetResult<Prisma.$VaultSnapshotPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many VaultSnapshots.
     * @param {VaultSnapshotCreateManyArgs} args - Arguments to create many VaultSnapshots.
     * @example
     * // Create many VaultSnapshots
     * const vaultSnapshot = await prisma.vaultSnapshot.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends VaultSnapshotCreateManyArgs>(args?: Prisma.SelectSubset<T, VaultSnapshotCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many VaultSnapshots and returns the data saved in the database.
     * @param {VaultSnapshotCreateManyAndReturnArgs} args - Arguments to create many VaultSnapshots.
     * @example
     * // Create many VaultSnapshots
     * const vaultSnapshot = await prisma.vaultSnapshot.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many VaultSnapshots and only return the `id`
     * const vaultSnapshotWithIdOnly = await prisma.vaultSnapshot.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends VaultSnapshotCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, VaultSnapshotCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$VaultSnapshotPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a VaultSnapshot.
     * @param {VaultSnapshotDeleteArgs} args - Arguments to delete one VaultSnapshot.
     * @example
     * // Delete one VaultSnapshot
     * const VaultSnapshot = await prisma.vaultSnapshot.delete({
     *   where: {
     *     // ... filter to delete one VaultSnapshot
     *   }
     * })
     *
     */
    delete<T extends VaultSnapshotDeleteArgs>(args: Prisma.SelectSubset<T, VaultSnapshotDeleteArgs<ExtArgs>>): Prisma.Prisma__VaultSnapshotClient<runtime.Types.Result.GetResult<Prisma.$VaultSnapshotPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one VaultSnapshot.
     * @param {VaultSnapshotUpdateArgs} args - Arguments to update one VaultSnapshot.
     * @example
     * // Update one VaultSnapshot
     * const vaultSnapshot = await prisma.vaultSnapshot.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends VaultSnapshotUpdateArgs>(args: Prisma.SelectSubset<T, VaultSnapshotUpdateArgs<ExtArgs>>): Prisma.Prisma__VaultSnapshotClient<runtime.Types.Result.GetResult<Prisma.$VaultSnapshotPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more VaultSnapshots.
     * @param {VaultSnapshotDeleteManyArgs} args - Arguments to filter VaultSnapshots to delete.
     * @example
     * // Delete a few VaultSnapshots
     * const { count } = await prisma.vaultSnapshot.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends VaultSnapshotDeleteManyArgs>(args?: Prisma.SelectSubset<T, VaultSnapshotDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more VaultSnapshots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VaultSnapshotUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many VaultSnapshots
     * const vaultSnapshot = await prisma.vaultSnapshot.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends VaultSnapshotUpdateManyArgs>(args: Prisma.SelectSubset<T, VaultSnapshotUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more VaultSnapshots and returns the data updated in the database.
     * @param {VaultSnapshotUpdateManyAndReturnArgs} args - Arguments to update many VaultSnapshots.
     * @example
     * // Update many VaultSnapshots
     * const vaultSnapshot = await prisma.vaultSnapshot.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more VaultSnapshots and only return the `id`
     * const vaultSnapshotWithIdOnly = await prisma.vaultSnapshot.updateManyAndReturn({
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
    updateManyAndReturn<T extends VaultSnapshotUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, VaultSnapshotUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$VaultSnapshotPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one VaultSnapshot.
     * @param {VaultSnapshotUpsertArgs} args - Arguments to update or create a VaultSnapshot.
     * @example
     * // Update or create a VaultSnapshot
     * const vaultSnapshot = await prisma.vaultSnapshot.upsert({
     *   create: {
     *     // ... data to create a VaultSnapshot
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the VaultSnapshot we want to update
     *   }
     * })
     */
    upsert<T extends VaultSnapshotUpsertArgs>(args: Prisma.SelectSubset<T, VaultSnapshotUpsertArgs<ExtArgs>>): Prisma.Prisma__VaultSnapshotClient<runtime.Types.Result.GetResult<Prisma.$VaultSnapshotPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of VaultSnapshots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VaultSnapshotCountArgs} args - Arguments to filter VaultSnapshots to count.
     * @example
     * // Count the number of VaultSnapshots
     * const count = await prisma.vaultSnapshot.count({
     *   where: {
     *     // ... the filter for the VaultSnapshots we want to count
     *   }
     * })
    **/
    count<T extends VaultSnapshotCountArgs>(args?: Prisma.Subset<T, VaultSnapshotCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], VaultSnapshotCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a VaultSnapshot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VaultSnapshotAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends VaultSnapshotAggregateArgs>(args: Prisma.Subset<T, VaultSnapshotAggregateArgs>): Prisma.PrismaPromise<GetVaultSnapshotAggregateType<T>>;
    /**
     * Group by VaultSnapshot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VaultSnapshotGroupByArgs} args - Group by arguments.
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
    groupBy<T extends VaultSnapshotGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: VaultSnapshotGroupByArgs['orderBy'];
    } : {
        orderBy?: VaultSnapshotGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, VaultSnapshotGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVaultSnapshotGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the VaultSnapshot model
     */
    readonly fields: VaultSnapshotFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for VaultSnapshot.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__VaultSnapshotClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
 * Fields of the VaultSnapshot model
 */
export interface VaultSnapshotFieldRefs {
    readonly id: Prisma.FieldRef<"VaultSnapshot", 'Int'>;
    readonly tvl: Prisma.FieldRef<"VaultSnapshot", 'BigInt'>;
    readonly blendBalance: Prisma.FieldRef<"VaultSnapshot", 'BigInt'>;
    readonly bufferBalance: Prisma.FieldRef<"VaultSnapshot", 'BigInt'>;
    readonly yieldGenerated: Prisma.FieldRef<"VaultSnapshot", 'BigInt'>;
    readonly yieldCumulative: Prisma.FieldRef<"VaultSnapshot", 'BigInt'>;
    readonly apyEstimate: Prisma.FieldRef<"VaultSnapshot", 'Float'>;
    readonly timestamp: Prisma.FieldRef<"VaultSnapshot", 'DateTime'>;
}
/**
 * VaultSnapshot findUnique
 */
export type VaultSnapshotFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VaultSnapshot
     */
    select?: Prisma.VaultSnapshotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the VaultSnapshot
     */
    omit?: Prisma.VaultSnapshotOmit<ExtArgs> | null;
    /**
     * Filter, which VaultSnapshot to fetch.
     */
    where: Prisma.VaultSnapshotWhereUniqueInput;
};
/**
 * VaultSnapshot findUniqueOrThrow
 */
export type VaultSnapshotFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VaultSnapshot
     */
    select?: Prisma.VaultSnapshotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the VaultSnapshot
     */
    omit?: Prisma.VaultSnapshotOmit<ExtArgs> | null;
    /**
     * Filter, which VaultSnapshot to fetch.
     */
    where: Prisma.VaultSnapshotWhereUniqueInput;
};
/**
 * VaultSnapshot findFirst
 */
export type VaultSnapshotFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VaultSnapshot
     */
    select?: Prisma.VaultSnapshotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the VaultSnapshot
     */
    omit?: Prisma.VaultSnapshotOmit<ExtArgs> | null;
    /**
     * Filter, which VaultSnapshot to fetch.
     */
    where?: Prisma.VaultSnapshotWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of VaultSnapshots to fetch.
     */
    orderBy?: Prisma.VaultSnapshotOrderByWithRelationInput | Prisma.VaultSnapshotOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for VaultSnapshots.
     */
    cursor?: Prisma.VaultSnapshotWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` VaultSnapshots from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` VaultSnapshots.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of VaultSnapshots.
     */
    distinct?: Prisma.VaultSnapshotScalarFieldEnum | Prisma.VaultSnapshotScalarFieldEnum[];
};
/**
 * VaultSnapshot findFirstOrThrow
 */
export type VaultSnapshotFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VaultSnapshot
     */
    select?: Prisma.VaultSnapshotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the VaultSnapshot
     */
    omit?: Prisma.VaultSnapshotOmit<ExtArgs> | null;
    /**
     * Filter, which VaultSnapshot to fetch.
     */
    where?: Prisma.VaultSnapshotWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of VaultSnapshots to fetch.
     */
    orderBy?: Prisma.VaultSnapshotOrderByWithRelationInput | Prisma.VaultSnapshotOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for VaultSnapshots.
     */
    cursor?: Prisma.VaultSnapshotWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` VaultSnapshots from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` VaultSnapshots.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of VaultSnapshots.
     */
    distinct?: Prisma.VaultSnapshotScalarFieldEnum | Prisma.VaultSnapshotScalarFieldEnum[];
};
/**
 * VaultSnapshot findMany
 */
export type VaultSnapshotFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VaultSnapshot
     */
    select?: Prisma.VaultSnapshotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the VaultSnapshot
     */
    omit?: Prisma.VaultSnapshotOmit<ExtArgs> | null;
    /**
     * Filter, which VaultSnapshots to fetch.
     */
    where?: Prisma.VaultSnapshotWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of VaultSnapshots to fetch.
     */
    orderBy?: Prisma.VaultSnapshotOrderByWithRelationInput | Prisma.VaultSnapshotOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing VaultSnapshots.
     */
    cursor?: Prisma.VaultSnapshotWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` VaultSnapshots from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` VaultSnapshots.
     */
    skip?: number;
    distinct?: Prisma.VaultSnapshotScalarFieldEnum | Prisma.VaultSnapshotScalarFieldEnum[];
};
/**
 * VaultSnapshot create
 */
export type VaultSnapshotCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VaultSnapshot
     */
    select?: Prisma.VaultSnapshotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the VaultSnapshot
     */
    omit?: Prisma.VaultSnapshotOmit<ExtArgs> | null;
    /**
     * The data needed to create a VaultSnapshot.
     */
    data: Prisma.XOR<Prisma.VaultSnapshotCreateInput, Prisma.VaultSnapshotUncheckedCreateInput>;
};
/**
 * VaultSnapshot createMany
 */
export type VaultSnapshotCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many VaultSnapshots.
     */
    data: Prisma.VaultSnapshotCreateManyInput | Prisma.VaultSnapshotCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * VaultSnapshot createManyAndReturn
 */
export type VaultSnapshotCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VaultSnapshot
     */
    select?: Prisma.VaultSnapshotSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the VaultSnapshot
     */
    omit?: Prisma.VaultSnapshotOmit<ExtArgs> | null;
    /**
     * The data used to create many VaultSnapshots.
     */
    data: Prisma.VaultSnapshotCreateManyInput | Prisma.VaultSnapshotCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * VaultSnapshot update
 */
export type VaultSnapshotUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VaultSnapshot
     */
    select?: Prisma.VaultSnapshotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the VaultSnapshot
     */
    omit?: Prisma.VaultSnapshotOmit<ExtArgs> | null;
    /**
     * The data needed to update a VaultSnapshot.
     */
    data: Prisma.XOR<Prisma.VaultSnapshotUpdateInput, Prisma.VaultSnapshotUncheckedUpdateInput>;
    /**
     * Choose, which VaultSnapshot to update.
     */
    where: Prisma.VaultSnapshotWhereUniqueInput;
};
/**
 * VaultSnapshot updateMany
 */
export type VaultSnapshotUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update VaultSnapshots.
     */
    data: Prisma.XOR<Prisma.VaultSnapshotUpdateManyMutationInput, Prisma.VaultSnapshotUncheckedUpdateManyInput>;
    /**
     * Filter which VaultSnapshots to update
     */
    where?: Prisma.VaultSnapshotWhereInput;
    /**
     * Limit how many VaultSnapshots to update.
     */
    limit?: number;
};
/**
 * VaultSnapshot updateManyAndReturn
 */
export type VaultSnapshotUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VaultSnapshot
     */
    select?: Prisma.VaultSnapshotSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the VaultSnapshot
     */
    omit?: Prisma.VaultSnapshotOmit<ExtArgs> | null;
    /**
     * The data used to update VaultSnapshots.
     */
    data: Prisma.XOR<Prisma.VaultSnapshotUpdateManyMutationInput, Prisma.VaultSnapshotUncheckedUpdateManyInput>;
    /**
     * Filter which VaultSnapshots to update
     */
    where?: Prisma.VaultSnapshotWhereInput;
    /**
     * Limit how many VaultSnapshots to update.
     */
    limit?: number;
};
/**
 * VaultSnapshot upsert
 */
export type VaultSnapshotUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VaultSnapshot
     */
    select?: Prisma.VaultSnapshotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the VaultSnapshot
     */
    omit?: Prisma.VaultSnapshotOmit<ExtArgs> | null;
    /**
     * The filter to search for the VaultSnapshot to update in case it exists.
     */
    where: Prisma.VaultSnapshotWhereUniqueInput;
    /**
     * In case the VaultSnapshot found by the `where` argument doesn't exist, create a new VaultSnapshot with this data.
     */
    create: Prisma.XOR<Prisma.VaultSnapshotCreateInput, Prisma.VaultSnapshotUncheckedCreateInput>;
    /**
     * In case the VaultSnapshot was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.VaultSnapshotUpdateInput, Prisma.VaultSnapshotUncheckedUpdateInput>;
};
/**
 * VaultSnapshot delete
 */
export type VaultSnapshotDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VaultSnapshot
     */
    select?: Prisma.VaultSnapshotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the VaultSnapshot
     */
    omit?: Prisma.VaultSnapshotOmit<ExtArgs> | null;
    /**
     * Filter which VaultSnapshot to delete.
     */
    where: Prisma.VaultSnapshotWhereUniqueInput;
};
/**
 * VaultSnapshot deleteMany
 */
export type VaultSnapshotDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which VaultSnapshots to delete
     */
    where?: Prisma.VaultSnapshotWhereInput;
    /**
     * Limit how many VaultSnapshots to delete.
     */
    limit?: number;
};
/**
 * VaultSnapshot without action
 */
export type VaultSnapshotDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VaultSnapshot
     */
    select?: Prisma.VaultSnapshotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the VaultSnapshot
     */
    omit?: Prisma.VaultSnapshotOmit<ExtArgs> | null;
};
export {};
