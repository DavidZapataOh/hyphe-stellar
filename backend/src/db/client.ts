import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env["DATABASE_URL"] || "postgresql://user:pass@localhost:5432/hyphe",
});

export const prisma = new PrismaClient({ adapter });
