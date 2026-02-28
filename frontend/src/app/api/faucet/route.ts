import {
  Keypair,
  rpc,
  TransactionBuilder,
  Contract,
  Address,
  nativeToScVal,
  Networks,
} from "@stellar/stellar-sdk";
import { NextResponse } from "next/server";

const SOROBAN_RPC_URL =
  process.env.NEXT_PUBLIC_SOROBAN_RPC_URL ||
  "https://soroban-testnet.stellar.org";
const NETWORK_PASSPHRASE = Networks.TESTNET;
const USDC_SAC = process.env.NEXT_PUBLIC_USDC_SAC!;
const FAUCET_AMOUNT = 50_0000000n; // 50 USDC (7 decimals)

// Rate limiting: address → timestamp
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_MS = 10 * 60 * 1000; // 10 minutes

export async function POST(request: Request) {
  try {
    const { address } = await request.json();

    // Validate address
    if (
      !address ||
      typeof address !== "string" ||
      !address.startsWith("G") ||
      address.length !== 56
    ) {
      return NextResponse.json(
        { error: "Invalid Stellar address" },
        { status: 400 },
      );
    }

    // Rate limit check
    const lastRequest = rateLimitMap.get(address);
    if (lastRequest && Date.now() - lastRequest < RATE_LIMIT_MS) {
      const waitMin = Math.ceil(
        (RATE_LIMIT_MS - (Date.now() - lastRequest)) / 60_000,
      );
      return NextResponse.json(
        { error: `Please wait ${waitMin} minute${waitMin > 1 ? "s" : ""} before requesting again` },
        { status: 429 },
      );
    }

    // Load faucet keypair
    const faucetSecret = process.env.FAUCET_SECRET;
    if (!faucetSecret) {
      return NextResponse.json(
        { error: "Faucet not configured" },
        { status: 503 },
      );
    }

    const faucetKeypair = Keypair.fromSecret(faucetSecret);
    const faucetPub = faucetKeypair.publicKey();

    // Build transaction
    const server = new rpc.Server(SOROBAN_RPC_URL);
    const account = await server.getAccount(faucetPub);
    const contract = new Contract(USDC_SAC);

    const tx = new TransactionBuilder(account, {
      fee: "100",
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        contract.call(
          "transfer",
          new Address(faucetPub).toScVal(),
          new Address(address).toScVal(),
          nativeToScVal(FAUCET_AMOUNT, { type: "i128" }),
        ),
      )
      .setTimeout(30)
      .build();

    // Simulate
    const simResult = await server.simulateTransaction(tx);
    if (rpc.Api.isSimulationError(simResult)) {
      return NextResponse.json(
        { error: `Simulation failed: ${JSON.stringify(simResult.error)}` },
        { status: 500 },
      );
    }

    // Assemble and sign
    const assembled = rpc.assembleTransaction(tx, simResult).build();
    assembled.sign(faucetKeypair);

    // Submit
    const sendResult = await server.sendTransaction(assembled);
    if (sendResult.status === "ERROR") {
      return NextResponse.json(
        {
          error: `Transaction send failed: ${sendResult.errorResult?.toXDR("base64") ?? "unknown"}`,
        },
        { status: 500 },
      );
    }

    // Poll for confirmation
    const hash = sendResult.hash;
    let getResult = await server.getTransaction(hash);
    while (getResult.status === "NOT_FOUND") {
      await new Promise((r) => setTimeout(r, 1000));
      getResult = await server.getTransaction(hash);
    }

    if (getResult.status === "FAILED") {
      return NextResponse.json(
        {
          error: `Transaction failed: ${getResult.resultXdr?.toXDR("base64") ?? "unknown"}`,
        },
        { status: 500 },
      );
    }

    // Update rate limit only on success
    rateLimitMap.set(address, Date.now());

    return NextResponse.json({ success: true, hash });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Faucet request failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
