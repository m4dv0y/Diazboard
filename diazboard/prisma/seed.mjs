import { PrismaClient } from "../app/generated/prisma/index.js";

const prisma = new PrismaClient();

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDateWithin(daysBack) {
  const now = Date.now();
  const past = now - randomInt(0, daysBack) * 24 * 60 * 60 * 1000;
  return new Date(past);
}

const currencies = ["USD", "CLP", "QAR", "PHP"];
const expenseCategories = ["Food", "Transport", "Rent", "Utilities", "Shopping", "Health", "Travel", "Entertainment"];
const incomeSources = ["Salary", "Freelance", "Bonus", "Gift", "Dividends", "Interest"];
const platforms = ["BrokerX", "BrokerY", "CryptoY", "RoboZ"];
const assets = ["ETF SPY", "AAPL", "MSFT", "BTC", "ETH", "Bond Fund"];

async function main() {
  const expenses = Array.from({ length: 100 }, () => ({
    date: randomDateWithin(120),
    category: expenseCategories[randomInt(0, expenseCategories.length - 1)],
    description: Math.random() > 0.6 ? "" : null,
    amountCents: randomInt(200, 50000),
    currency: currencies[randomInt(0, currencies.length - 1)],
  }));

  const incomes = Array.from({ length: 100 }, () => ({
    date: randomDateWithin(180),
    source: incomeSources[randomInt(0, incomeSources.length - 1)],
    description: Math.random() > 0.6 ? "" : null,
    amountCents: randomInt(10000, 500000),
    currency: currencies[randomInt(0, currencies.length - 1)],
  }));

  const investments = Array.from({ length: 100 }, () => ({
    platform: platforms[randomInt(0, platforms.length - 1)],
    asset: assets[randomInt(0, assets.length - 1)],
    amountCents: randomInt(10000, 5_000_000),
    currency: currencies[randomInt(0, currencies.length - 1)],
    allocation: randomInt(1, 100),
    performance: randomInt(-50, 150),
  }));

  await prisma.expense.createMany({ data: expenses });
  await prisma.income.createMany({ data: incomes });
  await prisma.investment.createMany({ data: investments });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

