import { NextRequest, NextResponse } from "next/server";
import { getExchangeRate } from "@/app/lib/exchange";

type Item = { amountCents: number; currency: string };

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || !Array.isArray(body.items) || !body.target) {
    return NextResponse.json({ error: "Expected { items: [{amountCents, currency}], target }" }, { status: 400 });
  }
  const items: Item[] = body.items;
  const target: string = body.target;

  const distinct = Array.from(new Set(items.map((i) => i.currency).filter((c) => c && c !== target)));
  const rates = new Map<string, number>();

  // Fetch needed rates in parallel
  await Promise.all(
    distinct.map(async (from) => {
      const rate = await getExchangeRate(from, target);
      rates.set(from, rate);
    })
  );

  let totalCents = 0;
  const perCurrency: Record<string, number> = {};
  for (const item of items) {
    const base = item.currency;
    const amount = item.amountCents / 100;
    const rate = base === target ? 1 : rates.get(base) || 1;
    const converted = Math.round(amount * rate * 100);
    totalCents += converted;
    perCurrency[base] = (perCurrency[base] || 0) + item.amountCents;
  }

  return NextResponse.json({ totalCents, perCurrency, target });
}

