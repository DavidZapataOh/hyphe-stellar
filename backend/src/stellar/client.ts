import { rpc } from "@stellar/stellar-sdk";
import { config } from "../config/index.js";

let server: rpc.Server | null = null;

export function getSorobanServer(): rpc.Server {
  if (!server) {
    server = new rpc.Server(config.SOROBAN_RPC_URL);
  }
  return server;
}
