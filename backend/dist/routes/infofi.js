import { prisma } from "../db/client.js";
export async function infofiRoutes(app) {
    // GET /api/infofi/signals — recent InfoFi signals
    app.get("/api/infofi/signals", async (request) => {
        const { type, limit, marketId } = request.query;
        const signals = await prisma.infoFiSignal.findMany({
            where: {
                ...(type ? { signalType: type } : {}),
                ...(marketId ? { marketId: parseInt(marketId, 10) } : {}),
            },
            orderBy: { timestamp: "desc" },
            take: parseInt(limit || "50", 10),
            include: { market: true },
        });
        return signals;
    });
    // GET /api/infofi/players — top player value signals
    app.get("/api/infofi/players", async () => {
        const playerSignals = await prisma.infoFiSignal.findMany({
            where: { signalType: "player_value" },
            orderBy: { value: "desc" },
            take: 20,
        });
        return playerSignals;
    });
    // GET /api/infofi/momentum — markets with strongest momentum
    app.get("/api/infofi/momentum", async () => {
        const momentumSignals = await prisma.infoFiSignal.findMany({
            where: { signalType: "momentum" },
            orderBy: [{ confidence: "desc" }, { timestamp: "desc" }],
            take: 10,
            include: { market: true },
        });
        return momentumSignals;
    });
}
//# sourceMappingURL=infofi.js.map