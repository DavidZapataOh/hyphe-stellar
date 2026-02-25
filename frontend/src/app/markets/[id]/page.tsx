"use client";

import { use, useEffect } from "react";
import {
  ArrowLeft,
  Clock,
  BarChart3,
  Activity,
  ShieldCheck,
  Database,
  Gavel,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { MarketStatusBadge } from "@/components/markets/MarketStatus";
import { OddsChart } from "@/components/markets/OddsChart";
import { TradingPanel } from "@/components/markets/TradingPanel";
import { TradeHistory } from "@/components/markets/TradeHistory";
import { Countdown } from "@/components/shared/Countdown";
import { Footer } from "@/components/layout/Footer";
import {
  useMarket,
  useMarketHistory,
  useRecentTrades,
} from "@/hooks/useMarket";
import { useOddsStream } from "@/hooks/useOddsStream";
import { useMarketsStore } from "@/stores/markets";
import { formatCompact, formatPercent } from "@/lib/utils/format";
import { USDC_DECIMALS } from "@/lib/utils/constants";

export default function MarketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const marketId = parseInt(id, 10);

  const { data: market, isLoading } = useMarket(marketId);
  const { data: history } = useMarketHistory(marketId);
  const { data: trades } = useRecentTrades(marketId);
  const odds = useOddsStream(marketId);

  // Seed odds store from API response so prices show before WebSocket connects
  useEffect(() => {
    if (market?.yesPrice != null) {
      useMarketsStore.getState().updateOdds(marketId, {
        yes: market.yesPrice,
        no: market.noPrice,
      });
    }
  }, [market, marketId]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1400px] px-8 py-10">
        <Skeleton className="mb-3 h-4 w-32" />
        <Skeleton className="mb-2 h-12 w-[600px]" />
        <Skeleton className="mb-10 h-6 w-[300px]" />
        <div className="grid gap-10 grid-cols-12">
          <div className="space-y-6 col-span-8">
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-[400px] rounded-xl" />
          </div>
          <div className="col-span-4">
            <Skeleton className="h-[500px] rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!market) {
    return (
      <div className="mx-auto max-w-[1400px] px-8 py-20 text-center">
        <p className="text-lg text-muted-foreground">Market not found.</p>
        <Link
          href="/"
          className="mt-4 inline-flex items-center gap-1.5 text-base font-medium text-primary hover:text-primary/80"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Markets
        </Link>
      </div>
    );
  }

  const volume = Number(market.total_volume) / 10 ** USDC_DECIMALS;
  const yesPct = Math.round(odds.yes * 100);
  const change = ((odds.yes - 0.5) * 20).toFixed(1);
  const isPositive = Number(change) >= 0;

  return (
    <>
      <main className="mx-auto max-w-[1400px] w-full px-8 py-10">
        {/* Breadcrumbs */}
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary">
          <TrendingUp className="h-3.5 w-3.5" />
          {market.category} &bull; Active Market
        </div>

        {/* HUGE Title */}
        <h1 className="mb-6 max-w-3xl text-5xl font-black leading-tight tracking-tight">
          {market.question}
        </h1>

        {/* Stats row */}
        <div className="mb-10 flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-base font-medium text-muted-foreground">
              Current Probability
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold tracking-tighter">
                {yesPct}%
              </span>
              <span
                className={`flex items-center gap-0.5 text-xl font-bold ${isPositive ? "text-yes" : "text-no"}`}
              >
                {isPositive ? "+" : ""}
                {change}%
                <TrendingUp className="h-4 w-4" />
              </span>
            </div>
          </div>
          <div className="mx-2 h-10 w-px bg-border" />
          <div className="flex flex-col">
            <span className="text-base font-medium text-muted-foreground">
              Market Volume
            </span>
            <span className="text-3xl font-semibold">
              {formatCompact(volume)}
            </span>
          </div>
        </div>

        {/* Grid: 8 + 4 */}
        <div className="grid gap-10 grid-cols-12">
          {/* ═══ Left Column ═══ */}
          <div className="flex flex-col gap-8 col-span-8">
            {/* Chart card */}
            <div className="overflow-hidden rounded-xl border border-border bg-card/30 p-8">
              <div className="mb-8 flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-semibold">
                  <Activity className="h-4 w-4 text-primary" />
                  Market Sentiment (30D)
                </h3>
                <div className="flex rounded-lg border border-border bg-background p-1">
                  {["1H", "1D", "1W", "ALL"].map((label) => (
                    <button
                      key={label}
                      className="rounded-md px-3 py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[active]:bg-card data-[active]:text-foreground data-[active]:shadow-sm"
                      data-active={label === "ALL" ? "" : undefined}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-[320px]">
                <OddsChart data={history ?? []} />
              </div>
            </div>

            {/* Info cards */}
            <div className="grid grid-cols-2 gap-6">
              <div className="rounded-xl border border-border bg-card/30 p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Gavel className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-bold">Resolution Rules</h3>
                </div>
                <p className="text-base leading-relaxed text-muted-foreground">
                  Market resolves YES if the event occurs before the end date.
                  Resolution is determined by the designated oracle source and
                  verified through the Hyphe protocol. Official filings and
                  verified data sources serve as primary resolution sources.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card/30 p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-lg bg-yes/10 p-2">
                    <Database className="h-5 w-5 text-yes" />
                  </div>
                  <h3 className="font-bold">Oracle Source</h3>
                </div>
                <p className="mb-4 text-base leading-relaxed text-muted-foreground">
                  Primary: Verified on-chain oracle data feeds. Secondary: Major
                  news outlets confirming the event status.
                </p>
                <div className="flex items-center justify-between border-t border-border pt-4 text-sm">
                  <span className="font-bold uppercase tracking-wider text-muted-foreground">
                    Resolution Method
                  </span>
                  <span className="rounded bg-primary/10 px-2 py-1 font-mono text-primary">
                    DECENTRALIZED_ORACLE_V2
                  </span>
                </div>
              </div>
            </div>

            {/* Social Signals & Activity */}
            {trades && trades.length > 0 && (
              <div className="overflow-hidden rounded-xl border border-border bg-card/30">
                <div className="flex items-center justify-between border-b border-border p-6">
                  <h3 className="flex items-center gap-2 font-bold">
                    <Activity className="h-4 w-4 text-primary" />
                    Social Signals &amp; Activity
                  </h3>
                  <span className="flex items-center gap-1 text-sm font-bold uppercase tracking-widest text-yes">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yes opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-yes" />
                    </span>
                    Live
                  </span>
                </div>
                <div className="p-4">
                  <TradeHistory trades={trades} />
                </div>
              </div>
            )}
          </div>

          {/* ═══ Right Column: Smart Trade ═══ */}
          <div className="col-span-4">
            <TradingPanel marketId={marketId} odds={odds} />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
