import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Currency } from "@/app/generated/prisma";
import { isDatabaseEnabled, getPrismaClient } from "@/app/lib/db";
import { mockInvestments } from "@/app/lib/mock";

const prisma = getPrismaClient();

export async function GET() {
  if (!isDatabaseEnabled()) return NextResponse.json(mockInvestments);
  const items = await prisma.investment.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!isDatabaseEnabled()) {
    const created = {
      id: `v_${Date.now()}`,
      platform: body.platform,
      asset: body.asset,
      amountCents: Number(body.amountCents),
      currency: body.currency as Currency,
      allocation: Number(body.allocation),
      performance: Number(body.performance),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return NextResponse.json(created);
  }
  const created = await prisma.investment.create({
    data: {
      platform: body.platform,
      asset: body.asset,
      amountCents: Number(body.amountCents),
      currency: body.currency as Currency,
      allocation: Number(body.allocation),
      performance: Number(body.performance),
    },
  });
  return NextResponse.json(created);
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  if (!isDatabaseEnabled()) return NextResponse.json({ ok: true });
  await prisma.investment.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
