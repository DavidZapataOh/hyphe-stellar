-- CreateEnum
CREATE TYPE "MarketStatus" AS ENUM ('OPEN', 'CLOSED', 'RESOLVED', 'DISPUTED');

-- CreateEnum
CREATE TYPE "TradeSide" AS ENUM ('BUY', 'SELL', 'SPLIT', 'MERGE', 'REDEEM');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('PENDING', 'SUBMITTED', 'FINALIZED', 'DISPUTED', 'FAILED');

-- CreateTable
CREATE TABLE "markets" (
    "id" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "num_outcomes" INTEGER NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "status" "MarketStatus" NOT NULL DEFAULT 'OPEN',
    "winning_outcome" INTEGER,
    "total_collateral" BIGINT NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMP(3),
    "sport_type" TEXT,
    "home_team" TEXT,
    "away_team" TEXT,
    "match_date" TIMESTAMP(3),
    "external_match_id" TEXT,

    CONSTRAINT "markets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "price_snapshots" (
    "id" SERIAL NOT NULL,
    "market_id" INTEGER NOT NULL,
    "yes_price" DOUBLE PRECISION NOT NULL,
    "no_price" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "price_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trades" (
    "id" SERIAL NOT NULL,
    "market_id" INTEGER NOT NULL,
    "user" TEXT NOT NULL,
    "outcome" INTEGER NOT NULL,
    "side" "TradeSide" NOT NULL,
    "shares" BIGINT NOT NULL,
    "cost" BIGINT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "tx_hash" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vault_snapshots" (
    "id" SERIAL NOT NULL,
    "tvl" BIGINT NOT NULL,
    "blend_balance" BIGINT NOT NULL,
    "buffer_balance" BIGINT NOT NULL,
    "yield_generated" BIGINT NOT NULL,
    "yield_cumulative" BIGINT NOT NULL,
    "apy_estimate" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vault_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oracle_submissions" (
    "id" SERIAL NOT NULL,
    "market_id" INTEGER NOT NULL,
    "outcome" INTEGER NOT NULL,
    "source" TEXT NOT NULL,
    "raw_data" JSONB NOT NULL,
    "tx_hash" TEXT,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'PENDING',
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finalized_at" TIMESTAMP(3),

    CONSTRAINT "oracle_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "infofi_signals" (
    "id" SERIAL NOT NULL,
    "market_id" INTEGER NOT NULL,
    "signal_type" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "infofi_signals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "price_snapshots_market_id_timestamp_idx" ON "price_snapshots"("market_id", "timestamp");

-- CreateIndex
CREATE INDEX "trades_market_id_timestamp_idx" ON "trades"("market_id", "timestamp");

-- CreateIndex
CREATE INDEX "trades_user_idx" ON "trades"("user");

-- CreateIndex
CREATE INDEX "vault_snapshots_timestamp_idx" ON "vault_snapshots"("timestamp");

-- CreateIndex
CREATE INDEX "oracle_submissions_market_id_idx" ON "oracle_submissions"("market_id");

-- CreateIndex
CREATE INDEX "infofi_signals_signal_type_idx" ON "infofi_signals"("signal_type");

-- CreateIndex
CREATE INDEX "infofi_signals_market_id_idx" ON "infofi_signals"("market_id");

-- AddForeignKey
ALTER TABLE "price_snapshots" ADD CONSTRAINT "price_snapshots_market_id_fkey" FOREIGN KEY ("market_id") REFERENCES "markets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trades" ADD CONSTRAINT "trades_market_id_fkey" FOREIGN KEY ("market_id") REFERENCES "markets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "infofi_signals" ADD CONSTRAINT "infofi_signals_market_id_fkey" FOREIGN KEY ("market_id") REFERENCES "markets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
