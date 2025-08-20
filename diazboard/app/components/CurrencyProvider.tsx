"use client";
import { createContext, useCallback, useContext, useMemo, useState } from "react";

export type CurrencyCode = "USD" | "CLP" | "QAR" | "PHP";

type CurrencyContextValue = {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  getRate: (from: CurrencyCode, to: CurrencyCode) => Promise<number>;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}

const rateCache = new Map<string, { rate: number; ts: number }>();

export default function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const defaultCurrency = (process.env.NEXT_PUBLIC_DEFAULT_CURRENCY as CurrencyCode) || "USD";
  const [currency, setCurrency] = useState<CurrencyCode>(defaultCurrency);

  const getRate = useCallback(async (from: CurrencyCode, to: CurrencyCode) => {
    if (from === to) return 1;
    const key = `${from}_${to}`;
    const cached = rateCache.get(key);
    if (cached && Date.now() - cached.ts < 10 * 60 * 1000) return cached.rate;
    const res = await fetch(`/api/exchange?base=${from}&target=${to}`, { cache: "force-cache" });
    const json = await res.json();
    rateCache.set(key, { rate: json.rate, ts: Date.now() });
    return json.rate as number;
  }, []);

  const value = useMemo(() => ({ currency, setCurrency, getRate }), [currency, setCurrency, getRate]);
  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

