import { API_URL } from "@/lib/utils/constants";
import type { VaultInfo, UserVaultInfo } from "@/lib/stellar/types";

export async function fetchVaultInfo(): Promise<VaultInfo> {
  const res = await fetch(`${API_URL}/api/vault/stats`);
  if (!res.ok) throw new Error(`Failed to fetch vault info: ${res.status}`);
  return res.json();
}

export async function fetchUserVaultInfo(
  address: string,
): Promise<UserVaultInfo> {
  const res = await fetch(`${API_URL}/api/vault/user/${address}`);
  if (!res.ok) throw new Error(`Failed to fetch user vault: ${res.status}`);
  return res.json();
}
