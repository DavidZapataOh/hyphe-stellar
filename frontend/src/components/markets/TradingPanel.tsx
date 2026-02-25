"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { PresetAmounts } from "@/components/shared/PresetAmounts";
import { cn } from "@/lib/utils";
import { useWallet } from "@/hooks/useWallet";
import { useTrade } from "@/hooks/useTrade";
import { txPending, txSuccess, txError } from "@/components/shared/TxToast";
import Decimal from "decimal.js";
import { toast } from "sonner";
import { Wallet, ArrowRight, Loader2 } from "lucide-react";
import type { MarketOdds } from "@/lib/stellar/types";

interface TradingPanelProps {
  marketId: number;
  odds: MarketOdds;
  className?: string;
}

export function TradingPanel({
  marketId,
  odds,
  className,
}: TradingPanelProps) {
  const { connected, connect } = useWallet();
  const { buy, sell, isBuying, isSelling } = useTrade();
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [outcome, setOutcome] = useState<0 | 1>(0);
  const [amount, setAmount] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);


  const isLoading = isBuying || isSelling;
  const parsedAmount = parseFloat(amount) || 0;
  const currentOdds = outcome === 0 ? odds.yes : odds.no;
  const estimatedReturn =
    parsedAmount > 0 ? parsedAmount / currentOdds - parsedAmount : 0;
  const returnPct =
    parsedAmount > 0 ? ((1 / currentOdds - 1) * 100).toFixed(0) : "0";

  function handlePresetSelect(preset: number) {
    setSelectedPreset(preset);
    setAmount(preset.toString());
  }

  async function handleTrade() {
    if (!connected) {
      connect();
      return;
    }
    if (!amount || parsedAmount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    // Convert USDC amount → shares in 18-decimal fixed-point.
    // The contract's buy(shares) uses LMSR math in 18-decimal scale (SCALE = 10^18).
    // shares_to_buy ≈ usdc_amount / current_price, then scaled to 18 decimals.
    const price = outcome === 0 ? odds.yes : odds.no;
    const shares = BigInt(
      new Decimal(amount).div(Math.max(price, 0.01)).mul("1000000000000000000").toFixed(0)
    );
    const toastId = txPending(
      `${side === "buy" ? "Buying" : "Selling"} ${outcome === 0 ? "YES" : "NO"}...`,
    );
    try {
      const fn = side === "buy" ? buy : sell;
      const result = await fn({ marketId, outcome, shares });
      toast.dismiss(toastId);
      txSuccess(
        result.hash,
        `${side === "buy" ? "Bought" : "Sold"} ${outcome === 0 ? "YES" : "NO"} tokens`,
      );
      setAmount("");
      setSelectedPreset(null);
    } catch (err) {
      toast.dismiss(toastId);
      txError(err instanceof Error ? err.message : "Transaction failed");
    }
  }

  const panelContent = (
    <div className="space-y-8 p-6">
      {/* Outcome toggle */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setOutcome(0)}
          className={cn(
            "flex flex-col items-center justify-center rounded-xl border-2 p-4 transition-all",
            outcome === 0
              ? "border-primary bg-primary/10"
              : "border-border hover:border-muted-foreground/30 bg-background/50",
          )}
        >
          <span
            className={cn(
              "mb-1 text-sm font-bold uppercase tracking-widest",
              outcome === 0 ? "text-primary" : "text-muted-foreground",
            )}
          >
            Predict
          </span>
          <span className="text-xl font-black">YES</span>
        </button>

        <button
          onClick={() => setOutcome(1)}
          className={cn(
            "flex flex-col items-center justify-center rounded-xl border-2 p-4 transition-all",
            outcome === 1
              ? "border-primary bg-primary/10"
              : "border-border hover:border-muted-foreground/30 bg-background/50",
          )}
        >
          <span
            className={cn(
              "mb-1 text-sm font-bold uppercase tracking-widest",
              outcome === 1 ? "text-primary" : "text-muted-foreground",
            )}
          >
            Predict
          </span>
          <span className="text-xl font-black">NO</span>
        </button>
      </div>

      {/* Position Size */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-base font-semibold text-foreground/80">
            Position Size
          </label>
        </div>
        <div className="relative">
          <Input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setSelectedPreset(null);
            }}
            min="0"
            step="0.01"
            className="h-14 border-border bg-background text-xl font-black tabular-nums placeholder:text-muted-foreground/60"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground/70">
            USDC
          </span>
        </div>
        <PresetAmounts
          amounts={[5, 10, 25, 50]}
          selected={selectedPreset}
          onSelect={handlePresetSelect}
        />
      </div>

      {/* Summary stats */}
      <div className="space-y-3 rounded-xl border border-border/50 bg-background/50 p-5">
        <div className="flex justify-between text-base">
          <span className="text-muted-foreground">Position Size</span>
          <span className="font-medium">
            ${parsedAmount > 0 ? parsedAmount.toFixed(2) : "0.00"}
          </span>
        </div>
        <div className="flex justify-between text-base">
          <span className="text-muted-foreground">Potential Return</span>
          <span className="font-bold text-yes">
            ${estimatedReturn > 0 ? estimatedReturn.toFixed(2) : "0.00"}{" "}
            {parsedAmount > 0 && (
              <span className="text-yes/70">(+{returnPct}%)</span>
            )}
          </span>
        </div>
        <div className="flex justify-between text-base">
          <span className="text-muted-foreground">Slippage</span>
          <span className="font-medium">0.15%</span>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={handleTrade}
        disabled={isLoading}
        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-black text-white shadow-xl shadow-primary/30 transition-all hover:bg-primary/90 disabled:opacity-50"
      >
        {!connected ? (
          <>
            <Wallet className="h-4 w-4" />
            Connect Wallet
          </>
        ) : isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Confirming...
          </>
        ) : (
          <>
            Confirm Position
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </button>

      <p className="text-center text-xs uppercase tracking-widest font-semibold text-muted-foreground/70">
        Resolved by Hyphe Protocol &bull; Instant Liquidity
      </p>
    </div>
  );

  return (
    <div
      className={cn(
        "sticky top-28 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl",
        className,
      )}
    >
      <div className="flex items-center justify-between px-6 py-5">
        <h3 className="text-xl font-bold">Smart Trade</h3>
        <button className="text-sm font-bold uppercase tracking-widest text-primary hover:underline">
          Switch to Pro
        </button>
      </div>
      {panelContent}
    </div>
  );
}
