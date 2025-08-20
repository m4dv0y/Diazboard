type CacheEntry = { rate: number; timestamp: number };
const memoryCache = new Map<string, CacheEntry>();
const TEN_MINUTES = 10 * 60 * 1000;

export async function getExchangeRate(base: string, target: string): Promise<number> {
  const key = `${base}_${target}`;
  const cached = memoryCache.get(key);
  if (cached && Date.now() - cached.timestamp < TEN_MINUTES) {
    return cached.rate;
  }

  const url = `https://api.exchangerate.host/latest?base=${encodeURIComponent(base)}&symbols=${encodeURIComponent(target)}`;
  const res = await fetch(url, { next: { revalidate: 600 } });
  if (!res.ok) throw new Error("Failed to fetch exchange rate");
  const json = await res.json();
  const rate = json?.rates?.[target];
  if (!rate) throw new Error("Invalid exchange data");
  memoryCache.set(key, { rate, timestamp: Date.now() });
  return rate;
}

export async function convertCents(amountCents: number, from: string, to: string): Promise<number> {
  if (from === to) return amountCents;
  const rate = await getExchangeRate(from, to);
  const amount = (amountCents / 100) * rate;
  return Math.round(amount * 100);
}
