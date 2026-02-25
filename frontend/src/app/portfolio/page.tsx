"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/layout/Footer";
import { EmptyState } from "@/components/shared/EmptyState";
import { UsdcAmount } from "@/components/shared/UsdcAmount";
import { DepositForm } from "@/components/vault/DepositForm";
import { WithdrawForm } from "@/components/vault/WithdrawForm";
import { useWallet } from "@/hooks/useWallet";
import { useUserVault } from "@/hooks/useVault";
import { useTrade } from "@/hooks/useTrade";
import { fetchAllUserPositions, type MarketPosition } from "@/lib/api/history";
import { VaultContract } from "@/lib/stellar/contracts";
import { txPending, txSuccess, txError } from "@/components/shared/TxToast";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function MyPredictionsPage() {
  const { connected, address } = useWallet();
  const { redeem, isRedeeming } = useTrade();
  const { data: userVault } = useUserVault();

  const { data: positions, isLoading } = useQuery({
    queryKey: ["all-positions", address],
    queryFn: () => fetchAllUserPositions(address!),
    enabled: !!address,
    refetchInterval: 15_000,
  });

  if (!connected) {
    return (
      <>
        <div className="mx-auto max-w-[1400px] px-8 pb-8">
          <PageHeader />
          <EmptyState
            icon={Briefcase}
            title="Connect your wallet"
            description="Connect a Stellar wallet to see your predictions and earnings."
          />
        </div>
        <Footer />
      </>
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1400px] px-8 py-10">
        <Skeleton className="mb-3 h-4 w-24" />
        <Skeleton className="mb-10 h-8 w-48" />
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-36 rounded-2xl" />
        </div>
      </div>
    );
  }

  const positionList = positions ?? [];
  const hasYield = userVault && BigInt(userVault.pendingYield) > 0n;
  const hasDeposit = userVault && BigInt(userVault.deposit) > 0n;

  return (
    <>
    <div className="mx-auto max-w-[1400px] px-8 pb-8">
      <PageHeader />

      <div className="grid grid-cols-[1fr_340px] gap-8">
        {/* Left: Predictions */}
        <div>
          {/* Yield banner — only if user has yield */}
          {(hasYield || hasDeposit) && userVault && (
            <YieldBanner
              deposit={userVault.deposit}
              pendingYield={userVault.pendingYield}
            />
          )}

          {/* Positions */}
          {positionList.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="No predictions yet"
              description="You haven't made any predictions yet. Browse markets to get started."
              actionLabel="Browse Markets"
              actionHref="/markets"
              tips={[
                "Start small — try a $5 trade to learn how it works",
                "Your funds earn yield automatically when you trade",
              ]}
            />
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                Your Positions
              </p>
              <div className="grid grid-cols-2 gap-4">
                {positionList.map((pos) => (
                  <PositionCard
                    key={pos.marketId}
                    position={pos}
                    onRedeem={() => redeem(pos.marketId)}
                    isRedeeming={isRedeeming}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar: Deposit/Withdraw */}
        <div className="space-y-6">
          <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/80">
            <div className="border-b border-border/50 px-6 py-4">
              <h3 className="text-base font-semibold tracking-tight">
                Deposit & Withdraw
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Your USDC earns yield automatically
              </p>
            </div>
            <div className="p-6">
              <Tabs defaultValue="deposit">
                <TabsList className="mb-5 w-full">
                  <TabsTrigger value="deposit" className="flex-1">
                    Deposit
                  </TabsTrigger>
                  <TabsTrigger value="withdraw" className="flex-1">
                    Withdraw
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="deposit">
                  <DepositForm />
                </TabsContent>
                <TabsContent value="withdraw">
                  <WithdrawForm />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}

function PageHeader() {
  return (
    <div className="py-14">
      <h1 className="text-3xl font-bold tracking-tight">
        My Predictions
      </h1>
      <p className="mt-2 max-w-lg text-base leading-relaxed text-muted-foreground">
        Your positions and earnings in one place.
      </p>
    </div>
  );
}

function YieldBanner({
  deposit,
  pendingYield,
}: {
  deposit: string;
  pendingYield: string;
}) {
  const yieldAmount = BigInt(pendingYield);
  const depositAmount = BigInt(deposit);
  const { address } = useWallet();
  const [claiming, setClaiming] = useState(false);

  async function handleClaim() {
    if (!address) return;
    setClaiming(true);
    const toastId = txPending("Claiming yield...");
    try {
      const result = await VaultContract.claimYield(address);
      toast.dismiss(toastId);
      txSuccess(result.hash, "Yield claimed!");
    } catch (err) {
      toast.dismiss(toastId);
      txError(err instanceof Error ? err.message : "Claim failed");
    } finally {
      setClaiming(false);
    }
  }

  return (
    <div className="mb-6 flex flex-wrap items-center gap-4 rounded-2xl border border-yes/10 bg-yes/[0.03] px-6 py-4">
      <Sparkles className="h-5 w-5 text-yes" />

      <div className="flex flex-1 flex-wrap items-center gap-x-8 gap-y-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
            Deposited
          </p>
          <UsdcAmount
            raw={depositAmount}
            className="text-base font-bold tracking-tight"
          />
        </div>

        {yieldAmount > 0n && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-yes/60">
              Yield Earned
            </p>
            <UsdcAmount
              raw={yieldAmount}
              className="text-base font-bold tracking-tight text-yes"
            />
          </div>
        )}
      </div>

      {yieldAmount > 0n && (
        <Button
          onClick={handleClaim}
          disabled={claiming}
          size="sm"
          className="btn-depth"
        >
          {claiming ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            "Claim Yield"
          )}
        </Button>
      )}
    </div>
  );
}

function PositionCard({
  position,
  onRedeem,
  isRedeeming,
}: {
  position: MarketPosition;
  onRedeem: () => void;
  isRedeeming: boolean;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/80 p-5 transition-all duration-300 hover:border-primary/20 card-hover">
      <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-b from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative">
        <Link
          href={`/markets/${position.marketId}`}
          className="mb-4 block text-base font-semibold leading-snug tracking-tight transition-colors hover:text-primary"
        >
          {position.question}
        </Link>

        <div className="space-y-2">
          {position.outcomes.map((o) => {
            const balance = BigInt(o.balance);
            if (balance <= 0n) return null;
            return (
              <div
                key={o.outcome}
                className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2 text-base"
              >
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 font-semibold",
                    o.outcome === 0 ? "text-yes" : "text-no"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-1.5 w-1.5 rounded-full",
                      o.outcome === 0 ? "bg-yes" : "bg-no"
                    )}
                  />
                  {o.outcome === 0 ? "YES" : "NO"}
                </span>
                <UsdcAmount
                  raw={balance}
                  decimals={2}
                  className="font-mono font-bold"
                />
              </div>
            );
          })}
        </div>

        <Button
          onClick={onRedeem}
          disabled={isRedeeming}
          variant="outline"
          size="sm"
          className="mt-4 w-full"
        >
          {isRedeeming ? (
            <>
              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
              Redeeming...
            </>
          ) : (
            "Redeem"
          )}
        </Button>
      </div>
    </div>
  );
}
