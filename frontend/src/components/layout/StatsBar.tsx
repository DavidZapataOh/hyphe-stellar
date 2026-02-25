"use client";

import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import { formatCompact } from "@/lib/utils/format";
import { USDC_DECIMALS } from "@/lib/utils/constants";
import type { VaultInfo } from "@/lib/stellar/types";

interface StatsBarProps {
  vaultInfo?: VaultInfo;
  marketsCount: number;
}

export function StatsBar({ vaultInfo, marketsCount }: StatsBarProps) {
  const tvl = vaultInfo ? Number(vaultInfo.tvl) / 10 ** USDC_DECIMALS : 0;

  return (
    <div className="border-b border-border bg-stats-bar">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-6 px-6 py-3">
        <div className="flex items-center gap-8">
          {/* TVL */}
          <div className="flex flex-col">
            <span className="mb-1 text-xs font-bold uppercase leading-none tracking-widest text-muted-foreground">
              Total Value Locked
            </span>
            <div className="flex items-center gap-2">
              <AnimatedNumber
                value={tvl}
                format={(n) => formatCompact(n)}
                className="text-xl font-bold tabular-nums"
              />
              {tvl > 0 && (
                <span className="text-sm font-semibold text-yes">+12.4%</span>
              )}
            </div>
          </div>

          <div className="h-8 w-px bg-border" />

          {/* 24h Volume */}
          <div className="flex flex-col">
            <span className="mb-1 text-xs font-bold uppercase leading-none tracking-widest text-muted-foreground">
              24h Volume
            </span>
            <div className="flex items-center gap-2">
              <AnimatedNumber
                value={tvl * 0.15}
                format={(n) => formatCompact(n)}
                className="text-xl font-bold tabular-nums"
              />
              <span className="text-sm font-semibold text-yes">+5.8%</span>
            </div>
          </div>

          <div className="h-8 w-px bg-border" />

          {/* Active Markets */}
          <div className="flex flex-col">
            <span className="mb-1 text-xs font-bold uppercase leading-none tracking-widest text-muted-foreground">
              Active Markets
            </span>
            <div className="flex items-center gap-2">
              <AnimatedNumber
                value={marketsCount}
                format={(n) => Math.round(n).toString()}
                className="text-xl font-bold tabular-nums"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
