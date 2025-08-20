import { PrismaClient } from "@/app/generated/prisma";

declare global {
  // eslint-disable-next-line no-var
  var __prisma__: PrismaClient | undefined;
}

export function isDatabaseEnabled(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export function getPrismaClient(): PrismaClient {
  if (!globalThis.__prisma__) {
    globalThis.__prisma__ = new PrismaClient();
  }
  return globalThis.__prisma__;
}

