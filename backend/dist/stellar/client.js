import { rpc } from "@stellar/stellar-sdk";
import { config } from "../config/index.js";
let server = null;
export function getSorobanServer() {
    if (!server) {
        server = new rpc.Server(config.SOROBAN_RPC_URL);
    }
    return server;
}
//# sourceMappingURL=client.js.map