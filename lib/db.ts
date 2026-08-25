import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaPg } from "@prisma/adapter-pg";
import ws from "ws";

import { PrismaClient } from "@/app/generated/prisma/client";

neonConfig.webSocketConstructor = ws;

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

// Neon (staging/production) speaks its own wire protocol over WebSockets;
// local dev runs a plain Postgres container, which needs the standard `pg`
// driver instead - branch on the connection string rather than an extra
// env flag so there's one less thing to keep in sync per environment.
function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  const adapter = connectionString?.includes("neon.tech")
    ? new PrismaNeon({ connectionString })
    : new PrismaPg({ connectionString });

  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
