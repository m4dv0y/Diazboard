import { NextRequest, NextResponse } from "next/server";
import { getExchangeRate } from "@/app/lib/exchange";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const base = searchParams.get("base");
  const target = searchParams.get("target");
  if (!base || !target) return NextResponse.json({ error: "Missing base/target" }, { status: 400 });
  const rate = await getExchangeRate(base, target);
  return NextResponse.json({ rate });
}
