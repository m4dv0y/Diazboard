type CacheEntry = { rate: number; timestamp: number };
const memoryCache = new Map<string, CacheEntry>();
const TEN_MINUTES = 10 * 60 * 1000;

// Fallback exchange rates (approximate)
const FALLBACK_RATES: Record<string, Record<string, number>> = {
  USD: { CLP: 950, QAR: 3.64, PHP: 56.5 },
  CLP: { USD: 0.00105, QAR: 0.00383, PHP: 0.0595 },
  QAR: { USD: 0.275, CLP: 261, PHP: 15.5 },
  PHP: { USD: 0.0177, CLP: 16.8, QAR: 0.0645 },
};

export async function getExchangeRate(base: string, target: string): Promise<number> {
  const key = `${base}_${target}`;
  const cached = memoryCache.get(key);
  if (cached && Date.now() - cached.timestamp < TEN_MINUTES) {
    return cached.rate;
  }

  try {
    // Try multiple exchange rate APIs for better reliability
    const apis = [
      `https://api.exchangerate.host/latest?base=${encodeURIComponent(base)}&symbols=${encodeURIComponent(target)}`,
      `https://api.frankfurter.app/latest?from=${encodeURIComponent(base)}&to=${encodeURIComponent(target)}`,
    ];

    for (const apiUrl of apis) {
      try {
        const res = await fetch(apiUrl, { 
          next: { revalidate: 600 },
          headers: {
            'User-Agent': 'DiazBoard/1.0'
          }
        });
        
        if (res.ok) {
          const json = await res.json();
          let rate: number | undefined;
          
          // Handle different API response formats
          if (json.rates && json.rates[target]) {
            rate = json.rates[target];
          } else if (json.rates && Object.keys(json.rates).length > 0) {
            rate = Object.values(json.rates)[0] as number;
          }
          
          if (rate && rate > 0) {
            memoryCache.set(key, { rate, timestamp: Date.now() });
            return rate;
          }
        }
      } catch (error) {
        console.warn(`Exchange rate API failed for ${apiUrl}:`, error);
        continue;
      }
    }

    // Fallback to hardcoded rates
    if (FALLBACK_RATES[base] && FALLBACK_RATES[base][target]) {
      const fallbackRate = FALLBACK_RATES[base][target];
      memoryCache.set(key, { rate: fallbackRate, timestamp: Date.now() });
      console.warn(`Using fallback rate for ${base} to ${target}: ${fallbackRate}`);
      return fallbackRate;
    }

    // If no fallback available, return 1 (no conversion)
    console.warn(`No exchange rate available for ${base} to ${target}, using 1:1`);
    return 1;
    
  } catch (error) {
    console.error('Exchange rate error:', error);
    
    // Fallback to hardcoded rates
    if (FALLBACK_RATES[base] && FALLBACK_RATES[base][target]) {
      const fallbackRate = FALLBACK_RATES[base][target];
      memoryCache.set(key, { rate: fallbackRate, timestamp: Date.now() });
      return fallbackRate;
    }
    
    return 1; // Default to 1:1 conversion
  }
}

export async function convertCents(amountCents: number, from: string, to: string): Promise<number> {
  if (from === to) return amountCents;
  const rate = await getExchangeRate(from, to);
  const amount = (amountCents / 100) * rate;
  return Math.round(amount * 100);
}
