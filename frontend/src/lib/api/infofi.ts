import { API_URL } from "@/lib/utils/constants";
import type { InfoFiSignal, PlayerValue } from "@/lib/stellar/types";

export async function fetchSignals(limit = 50): Promise<InfoFiSignal[]> {
  const res = await fetch(`${API_URL}/api/infofi/signals?limit=${limit}`);
  if (!res.ok) throw new Error(`Failed to fetch signals: ${res.status}`);
  return res.json();
}

export async function fetchPlayerValues(): Promise<PlayerValue[]> {
  const res = await fetch(`${API_URL}/api/infofi/players`);
  if (!res.ok) throw new Error(`Failed to fetch player values: ${res.status}`);
  return res.json();
}

export async function fetchMomentum(): Promise<
  { marketId: number; question: string; momentum: number }[]
> {
  const res = await fetch(`${API_URL}/api/infofi/momentum`);
  if (!res.ok) throw new Error(`Failed to fetch momentum: ${res.status}`);
  return res.json();
}
