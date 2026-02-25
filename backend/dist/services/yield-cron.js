import cron from "node-cron";
import { prisma } from "../db/client.js";
import { logger } from "../utils/logger.js";
import { accrueYield, getVaultTvl, getVaultBalance, getBlendPosition, getVaultTotalYield, } from "../stellar/contracts.js";
/**
 * Estimate APY from TVL and hourly yield.
 */
function calculateAPY(tvl, yieldPerHour) {
    if (tvl === 0n)
        return 0;
    const hourlyRate = Number(yieldPerHour) / Number(tvl);
    const apy = (1 + hourlyRate) ** (24 * 365) - 1;
    return apy * 100; // percentage
}
/**
 * Call accrue_yield on the vault contract and save a snapshot.
 */
async function runAccrual() {
    logger.info("Yield cron: calling accrue_yield()...");
    // 1. Call vault.accrue_yield() on-chain
    const txHash = await accrueYield();
    logger.info({ txHash }, "Yield cron: accrue_yield() submitted");
    // 2. Read fresh vault state
    const tvl = await getVaultTvl();
    const balance = await getVaultBalance();
    const { principal: blendPrincipal } = await getBlendPosition();
    const totalYield = await getVaultTotalYield();
    const bufferBalance = balance;
    const blendBalance = blendPrincipal;
    // 3. Calculate yield generated since last snapshot
    const lastSnapshot = await prisma.vaultSnapshot.findFirst({
        orderBy: { timestamp: "desc" },
    });
    const previousCumulative = lastSnapshot?.yieldCumulative ?? 0n;
    const yieldGenerated = totalYield - previousCumulative;
    // 4. Save snapshot
    await prisma.vaultSnapshot.create({
        data: {
            tvl,
            blendBalance,
            bufferBalance,
            yieldGenerated,
            yieldCumulative: totalYield,
            apyEstimate: calculateAPY(tvl, yieldGenerated),
        },
    });
    logger.info({
        tvl: tvl.toString(),
        yieldGenerated: yieldGenerated.toString(),
        totalYield: totalYield.toString(),
    }, "Yield cron: snapshot saved");
}
/**
 * Start the yield accrual cron job.
 * Runs every hour at minute 0.
 */
export function startYieldCron() {
    cron.schedule("0 * * * *", async () => {
        try {
            await runAccrual();
        }
        catch (error) {
            logger.error({ error }, "Yield cron error");
        }
    });
    logger.info("Yield cron started (every hour)");
}
//# sourceMappingURL=yield-cron.js.map