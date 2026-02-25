"use client";

import {
  StellarWalletsKit,
  WalletNetwork,
  allowAllModules,
  type ISupportedWallet,
} from "@creit.tech/stellar-wallets-kit";
import { NETWORK } from "@/lib/utils/constants";

const network =
  NETWORK === "mainnet" ? WalletNetwork.PUBLIC : WalletNetwork.TESTNET;

let kit: StellarWalletsKit | null = null;

function getKit(): StellarWalletsKit {
  if (kit) return kit;
  kit = new StellarWalletsKit({
    network,
    modules: allowAllModules(),
    modalTheme: {
      bgColor: "#1A1A26",
      textColor: "#A0A0BA",
      solidTextColor: "#EDEDF4",
      headerButtonColor: "#7C3AED",
      dividerColor: "#2A2A3C",
      helpBgColor: "#111119",
      notAvailableTextColor: "#6B6B84",
      notAvailableBgColor: "#111119",
      notAvailableBorderColor: "#2A2A3C",
    },
  });
  return kit;
}

export interface WalletState {
  connected: boolean;
  address: string | null;
}

/**
 * Opens the wallet selection modal and returns the connected address.
 */
export function connectWallet(): Promise<WalletState> {
  const walletKit = getKit();

  return new Promise((resolve, reject) => {
    walletKit.openModal({
      onWalletSelected: async (option: ISupportedWallet) => {
        try {
          walletKit.setWallet(option.id);
          const { address } = await walletKit.getAddress();
          resolve({ connected: true, address });
        } catch (err) {
          reject(err);
        }
      },
      onClosed: (err: Error) => {
        reject(err);
      },
    });
  });
}

/**
 * Get the currently connected address.
 */
export async function getAddress(): Promise<string> {
  const walletKit = getKit();
  const { address } = await walletKit.getAddress();
  return address;
}

/**
 * Sign a transaction XDR using the connected wallet.
 */
export async function signTransaction(xdr: string): Promise<string> {
  const walletKit = getKit();
  const address = await getAddress();
  const { signedTxXdr } = await walletKit.signTransaction(xdr, {
    networkPassphrase: network,
    address,
  });
  return signedTxXdr;
}

/**
 * Sign an auth entry (for Soroban multi-party auth like Blend).
 */
export async function signAuthEntry(authEntry: string): Promise<string> {
  const walletKit = getKit();
  const address = await getAddress();
  const { signedAuthEntry } = await walletKit.signAuthEntry(authEntry, {
    networkPassphrase: network,
    address,
  });
  return signedAuthEntry;
}

/**
 * Disconnect the wallet.
 */
export async function disconnectWallet(): Promise<void> {
  const walletKit = getKit();
  await walletKit.disconnect();
}
