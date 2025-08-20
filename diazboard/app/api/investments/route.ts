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

export async function PUT(req: NextRequest) {
  const body = await req.json();
  if (!body?.id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  if (!isDatabaseEnabled()) return NextResponse.json({ ok: true });
  const updated = await prisma.investment.update({
    where: { id: body.id },
    data: {
      platform: body.platform,
      asset: body.asset,
      amountCents: body.amountCents != null ? Number(body.amountCents) : undefined,
      currency: body.currency as Currency,
      allocation: body.allocation != null ? Number(body.allocation) : undefined,
      performance: body.performance != null ? Number(body.performance) : undefined,
    },
  });
  return NextResponse.json(updated);
}
