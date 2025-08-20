import { Currency } from "@/app/generated/prisma";

export const mockExpenses = [
  { id: "e1", date: new Date("2024-06-10"), category: "Food", description: "Groceries", amountCents: 4500, currency: "USD" as Currency, createdAt: new Date(), updatedAt: new Date() },
  { id: "e2", date: new Date("2024-06-12"), category: "Transport", description: "Uber", amountCents: 1200, currency: "USD" as Currency, createdAt: new Date(), updatedAt: new Date() },
];

export const mockIncomes = [
  { id: "i1", date: new Date("2024-06-01"), source: "Salary", description: "Monthly", amountCents: 300000, currency: "USD" as Currency, createdAt: new Date(), updatedAt: new Date() },
];

export const mockInvestments = [
  { id: "v1", platform: "BrokerX", asset: "ETF SPY", amountCents: 1500000, currency: "USD" as Currency, allocation: 60, performance: 12, createdAt: new Date(), updatedAt: new Date() },
  { id: "v2", platform: "CryptoY", asset: "BTC", amountCents: 300000, currency: "USD" as Currency, allocation: 40, performance: -5, createdAt: new Date(), updatedAt: new Date() },
];

