import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Currency } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  const items = await prisma.investment.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
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
  await prisma.investment.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
