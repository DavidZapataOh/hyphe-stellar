export interface Market {
  id: number;
  question: string;
  category: string;
  creator: string;
  outcome_tokens: string[];
  end_time: number;
  status: MarketStatus;
  total_volume: string;
  liquidity: string;
  created_at: number;
  trade_count: number;
  yesPrice: number;
  noPrice: number;
}

export type MarketStatus = "Open" | "Closed" | "Resolved";

export interface MarketOdds {
  yes: number;
  no: number;
}

export interface Position {
  marketId: number;
  outcome: number;
  shares: bigint;
  avgEntry: number;
  currentPrice: number;
}

export interface VaultInfo {
  tvl: string;
  blendBalance: string;
  bufferBalance: string;
  yieldCumulative: string;
  apyEstimate: number;
  lastUpdated: string | null;
}

export interface UserVaultInfo {
  deposit: string;
  pendingYield: string;
}

export interface TradeEvent {
  user: string;
  marketId: number;
  outcome: number;
  side: "buy" | "sell";
  shares: bigint;
  cost: bigint;
  timestamp: number;
  txHash: string;
}

export interface InfoFiSignal {
  type: "odds_shift" | "momentum" | "volume_spike" | "whale_alert";
  marketId: number;
  marketQuestion: string;
  description: string;
  value: number;
  confidence: "high" | "medium" | "low";
  timestamp: number;
}

export interface PlayerValue {
  name: string;
  marketId: number;
  marginalValue: number;
  change24h: number;
  confidence: "high" | "medium" | "low";
}

export interface PriceHistoryPoint {
  time: number;
  yes: number;
  no: number;
}
