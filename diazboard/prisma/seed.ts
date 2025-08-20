import { PrismaClient, Currency } from "@/app/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  await prisma.expense.createMany({
    data: [
      { date: new Date("2024-06-10"), category: "Food", description: "Groceries", amountCents: 4500, currency: "USD" as Currency },
      { date: new Date("2024-06-12"), category: "Transport", description: "Uber", amountCents: 1200, currency: "USD" as Currency },
    ],
  });
  await prisma.income.createMany({
    data: [
      { date: new Date("2024-06-01"), source: "Salary", description: "Monthly", amountCents: 300000, currency: "USD" as Currency },
    ],
  });
  await prisma.investment.createMany({
    data: [
      { platform: "BrokerX", asset: "ETF SPY", amountCents: 1500000, currency: "USD" as Currency, allocation: 60, performance: 12 },
      { platform: "CryptoY", asset: "BTC", amountCents: 300000, currency: "USD" as Currency, allocation: 40, performance: -5 },
    ],
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

