import cron from "node-cron";
import { prisma } from "../db/client.js";
import { logger } from "../utils/logger.js";
/**
 * Analyze price history for a market and detect significant odds shifts.
 */
function analyzeMarketSignals(market) {
    const signals = [];
    const prices = market.priceHistory;
    if (prices.length < 2)
        return signals;
    // Detect significant price changes (>2% between consecutive snapshots)
    for (let i = 1; i < prices.length; i++) {
        const priceDiff = prices[i - 1].yesPrice - prices[i].yesPrice;
        if (Math.abs(priceDiff) > 0.02) {
            const direction = priceDiff > 0 ? "increased" : "decreased";
            const entity = market.homeTeam || market.question;
            signals.push({
                type: "odds_shift",
                entity,
                value: priceDiff,
                description: `${entity} odds ${direction} by ${(Math.abs(priceDiff) * 100).toFixed(1)}%`,
                confidence: Math.min(Math.abs(priceDiff) * 10, 1.0),
            });
        }
    }
    // Detect momentum (sustained movement over last 10 snapshots)
    if (prices.length >= 10) {
        const recent = prices.slice(0, 10);
        const oldPrice = recent[recent.length - 1].yesPrice;
        const newPrice = recent[0].yesPrice;
        const totalShift = newPrice - oldPrice;
        if (Math.abs(totalShift) > 0.05) {
            const entity = market.homeTeam || market.question;
            signals.push({
                type: "momentum",
                entity,
                value: totalShift,
                description: `${entity} showing ${totalShift > 0 ? "bullish" : "bearish"} momentum: ${(totalShift * 100).toFixed(1)}% shift over last 10 snapshots`,
                confidence: Math.min(Math.abs(totalShift) * 5, 1.0),
            });
        }
    }
    // Detect convergence to 50/50 (uncertainty signal)
    if (prices.length >= 5) {
        const latest = prices[0].yesPrice;
        if (Math.abs(latest - 0.5) < 0.03) {
            signals.push({
                type: "high_uncertainty",
                entity: market.homeTeam || market.question,
                value: latest,
                description: `Market near 50/50 — high uncertainty for ${market.homeTeam || market.question}`,
                confidence: 0.8,
            });
        }
    }
    return signals;
}
/**
 * Compute and store InfoFi signals for all open football markets.
 */
async function computeSignals() {
    const teamMarkets = await prisma.market.findMany({
        where: { sportType: "football", status: "OPEN" },
        include: {
            priceHistory: {
                orderBy: { timestamp: "desc" },
                take: 100,
            },
        },
    });
    let totalSignals = 0;
    for (const market of teamMarkets) {
        const signals = analyzeMarketSignals(market);
        for (const signal of signals) {
            await prisma.infoFiSignal.create({
                data: {
                    marketId: market.id,
                    signalType: signal.type,
                    entity: signal.entity,
                    value: signal.value,
                    description: signal.description,
                    confidence: signal.confidence,
                },
            });
            totalSignals++;
        }
    }
    if (totalSignals > 0) {
        logger.info({ signals: totalSignals, markets: teamMarkets.length }, "InfoFi engine: signals computed");
    }
}
/**
 * Start the InfoFi engine cron job.
 * Runs every 30 minutes.
 */
export function startInfoFiEngine() {
    cron.schedule("*/30 * * * *", async () => {
        try {
            await computeSignals();
        }
        catch (error) {
            logger.error({ error }, "InfoFi engine cron error");
        }
    });
    logger.info("InfoFi engine started (every 30 minutes)");
}
//# sourceMappingURL=infofi-engine.js.map