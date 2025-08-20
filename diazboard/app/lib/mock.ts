import { Currency } from "@/app/generated/prisma";
export const mockExpenses = [
  { id: "e10_1", date: new Date("2024-06-01"), category: "Food", description: "Groceries", amountCents: 5000, currency: "USD" as Currency, createdAt: new Date(), updatedAt: new Date() },
  { id: "e10_2", date: new Date("2024-06-02"), category: "Transport", description: "Bus ticket", amountCents: 800, currency: "CLP" as Currency, createdAt: new Date(), updatedAt: new Date() },
  { id: "e10_3", date: new Date("2024-06-03"), category: "Entertainment", description: "Movie", amountCents: 1500, currency: "QAR" as Currency, createdAt: new Date(), updatedAt: new Date() },
  { id: "e10_4", date: new Date("2024-06-04"), category: "Utilities", description: "Electricity bill", amountCents: 7000, currency: "PHP" as Currency, createdAt: new Date(), updatedAt: new Date() },
  { id: "e10_5", date: new Date("2024-06-05"), category: "Health", description: "Pharmacy", amountCents: 2200, currency: "USD" as Currency, createdAt: new Date(), updatedAt: new Date() },
  { id: "e10_6", date: new Date("2024-06-06"), category: "Food", description: "Restaurant", amountCents: 3500, currency: "CLP" as Currency, createdAt: new Date(), updatedAt: new Date() },
  { id: "e10_7", date: new Date("2024-06-07"), category: "Transport", description: "Taxi", amountCents: 2000, currency: "QAR" as Currency, createdAt: new Date(), updatedAt: new Date() },
  { id: "e10_8", date: new Date("2024-06-08"), category: "Shopping", description: "Clothes", amountCents: 9000, currency: "PHP" as Currency, createdAt: new Date(), updatedAt: new Date() },
  { id: "e10_9", date: new Date("2024-06-09"), category: "Entertainment", description: "Concert", amountCents: 12000, currency: "USD" as Currency, createdAt: new Date(), updatedAt: new Date() },
  { id: "e10_10", date: new Date("2024-06-10"), category: "Utilities", description: "Water bill", amountCents: 1800, currency: "CLP" as Currency, createdAt: new Date(), updatedAt: new Date() },
];

export const mockIncomes = [
  { id: "i10_1", date: new Date("2024-06-01"), source: "Salary", description: "Monthly salary", amountCents: 320000, currency: "USD" as Currency, createdAt: new Date(), updatedAt: new Date() },
  { id: "i10_2", date: new Date("2024-06-02"), source: "Freelance", description: "Web project", amountCents: 50000, currency: "CLP" as Currency, createdAt: new Date(), updatedAt: new Date() },
  { id: "i10_3", date: new Date("2024-06-03"), source: "Gift", description: "Birthday", amountCents: 10000, currency: "QAR" as Currency, createdAt: new Date(), updatedAt: new Date() },
  { id: "i10_4", date: new Date("2024-06-04"), source: "Investment", description: "Dividends", amountCents: 15000, currency: "PHP" as Currency, createdAt: new Date(), updatedAt: new Date() },
  { id: "i10_5", date: new Date("2024-06-05"), source: "Bonus", description: "Performance", amountCents: 20000, currency: "USD" as Currency, createdAt: new Date(), updatedAt: new Date() },
  { id: "i10_6", date: new Date("2024-06-06"), source: "Freelance", description: "Design", amountCents: 25000, currency: "CLP" as Currency, createdAt: new Date(), updatedAt: new Date() },
  { id: "i10_7", date: new Date("2024-06-07"), source: "Gift", description: "Anniversary", amountCents: 8000, currency: "QAR" as Currency, createdAt: new Date(), updatedAt: new Date() },
  { id: "i10_8", date: new Date("2024-06-08"), source: "Investment", description: "Interest", amountCents: 12000, currency: "PHP" as Currency, createdAt: new Date(), updatedAt: new Date() },
  { id: "i10_9", date: new Date("2024-06-09"), source: "Salary", description: "Part-time", amountCents: 40000, currency: "USD" as Currency, createdAt: new Date(), updatedAt: new Date() },
  { id: "i10_10", date: new Date("2024-06-10"), source: "Bonus", description: "Referral", amountCents: 6000, currency: "CLP" as Currency, createdAt: new Date(), updatedAt: new Date() },
];

export const mockInvestments = [
  { id: "v10_1", platform: "BrokerA", asset: "AAPL", amountCents: 200000, currency: "USD" as Currency, allocation: 25, performance: 8, createdAt: new Date(), updatedAt: new Date() },
  { id: "v10_2", platform: "BrokerB", asset: "TSLA", amountCents: 150000, currency: "CLP" as Currency, allocation: 15, performance: 12, createdAt: new Date(), updatedAt: new Date() },
  { id: "v10_3", platform: "BrokerC", asset: "GOOGL", amountCents: 180000, currency: "QAR" as Currency, allocation: 10, performance: 5, createdAt: new Date(), updatedAt: new Date() },
  { id: "v10_4", platform: "BrokerD", asset: "AMZN", amountCents: 220000, currency: "PHP" as Currency, allocation: 20, performance: 10, createdAt: new Date(), updatedAt: new Date() },
  { id: "v10_5", platform: "CryptoA", asset: "BTC", amountCents: 300000, currency: "USD" as Currency, allocation: 10, performance: -2, createdAt: new Date(), updatedAt: new Date() },
  { id: "v10_6", platform: "CryptoB", asset: "ETH", amountCents: 120000, currency: "CLP" as Currency, allocation: 5, performance: 7, createdAt: new Date(), updatedAt: new Date() },
  { id: "v10_7", platform: "BrokerE", asset: "MSFT", amountCents: 160000, currency: "QAR" as Currency, allocation: 5, performance: 6, createdAt: new Date(), updatedAt: new Date() },
  { id: "v10_8", platform: "BrokerF", asset: "VTI", amountCents: 140000, currency: "PHP" as Currency, allocation: 5, performance: 4, createdAt: new Date(), updatedAt: new Date() },
  { id: "v10_9", platform: "BrokerG", asset: "BND", amountCents: 100000, currency: "USD" as Currency, allocation: 3, performance: 2, createdAt: new Date(), updatedAt: new Date() },
  { id: "v10_10", platform: "CryptoC", asset: "SOL", amountCents: 90000, currency: "CLP" as Currency, allocation: 2, performance: 9, createdAt: new Date(), updatedAt: new Date() },
];

