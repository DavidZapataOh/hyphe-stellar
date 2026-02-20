import cron from "node-cron";
import { prisma } from "../db/client.js";
import { config } from "../config/index.js";
import { logger } from "../utils/logger.js";
import { submitOracleResult } from "../stellar/contracts.js";

interface MatchResult {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: "SCHEDULED" | "IN_PLAY" | "FINISHED" | "POSTPONED";
  utcDate: string;
}

/**
 * Fetch finished matches from football-data.org API.
 */
async function fetchMatchResults(): Promise<MatchResult[]> {
  if (!config.FOOTBALL_DATA_API_KEY) {
    logger.warn("FOOTBALL_DATA_API_KEY not set — skipping oracle ingestion");
    return [];
  }

  const res = await fetch(
    "https://api.football-data.org/v4/competitions/WC/matches?status=FINISHED",
    {
      headers: { "X-Auth-Token": config.FOOTBALL_DATA_API_KEY },
    }
  );

  if (!res.ok) {
    logger.error(
      { status: res.status, body: await res.text() },
      "football-data.org API error"
    );
    return [];
  }

  const data = (await res.json()) as {
    matches: Array<{
      id: number;
      homeTeam: { name: string };
      awayTeam: { name: string };
      score: { fullTime: { home: number; away: number } };
      status: string;
      utcDate: string;
    }>;
  };

  return data.matches.map((m) => ({
    matchId: m.id.toString(),
    homeTeam: m.homeTeam.name,
    awayTeam: m.awayTeam.name,
    homeScore: m.score.fullTime.home,
    awayScore: m.score.fullTime.away,
    status: m.status as MatchResult["status"],
    utcDate: m.utcDate,
  }));
}

/**
 * Map match result to market outcome.
 * YES = 0 (home wins), NO = 1 (home does not win)
 */
function matchResultToOutcome(result: MatchResult): number {
  if (result.homeScore > result.awayScore) {
    return 0; // YES — home team wins
  }
  return 1; // NO — draw or away win
}

/**
 * Submit the oracle result to the on-chain oracle contract.
 */
async function submitToContract(
  submissionId: number,
  marketId: number,
  outcome: number
): Promise<void> {
  try {
    const txHash = await submitOracleResult(marketId, outcome);

    await prisma.oracleSubmission.update({
      where: { id: submissionId },
      data: { status: "SUBMITTED", txHash },
    });

    logger.info(
      { marketId, outcome, txHash },
      "Oracle submitted result to contract"
    );
  } catch (error) {
    await prisma.oracleSubmission.update({
      where: { id: submissionId },
      data: { status: "FAILED" },
    });
    logger.error({ marketId, error }, "Oracle submission failed");
  }
}

/**
 * Core ingestion logic: find closed markets with finished matches,
 * create DB submissions, and submit to on-chain oracle.
 */
async function ingestResults(): Promise<void> {
  logger.info("Oracle ingester: checking for finished matches...");

  const results = await fetchMatchResults();
  if (results.length === 0) return;

  // Find markets that need resolution
  const pendingMarkets = await prisma.market.findMany({
    where: {
      status: "CLOSED",
      externalMatchId: { not: null },
    },
  });

  for (const market of pendingMarkets) {
    const result = results.find((r) => r.matchId === market.externalMatchId);
    if (!result || result.status !== "FINISHED") continue;

    // Check if we already submitted for this market
    const existing = await prisma.oracleSubmission.findFirst({
      where: {
        marketId: market.id,
        status: { in: ["SUBMITTED", "FINALIZED"] },
      },
    });
    if (existing) continue;

    const outcome = matchResultToOutcome(result);

    // Create submission record
    const submission = await prisma.oracleSubmission.create({
      data: {
        marketId: market.id,
        outcome,
        source: "football-data.org",
        rawData: JSON.parse(JSON.stringify(result)),
        status: "PENDING",
      },
    });

    // Submit to on-chain oracle
    await submitToContract(submission.id, market.id, outcome);
  }
}

/**
 * Start the oracle ingester cron job.
 * Runs every 5 minutes to check for finished matches.
 */
export function startOracleIngester(): void {
  cron.schedule("*/5 * * * *", async () => {
    try {
      await ingestResults();
    } catch (error) {
      logger.error({ error }, "Oracle ingester cron error");
    }
  });

  logger.info("Oracle ingester started (every 5 minutes)");
}
