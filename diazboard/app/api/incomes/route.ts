import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Currency } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  const items = await prisma.income.findMany({ orderBy: { date: "desc" } });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const created = await prisma.income.create({
    data: {
      date: new Date(body.date),
      source: body.source,
      description: body.description || null,
      amountCents: Number(body.amountCents),
      currency: body.currency as Currency,
    },
  });
  return NextResponse.json(created);
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await prisma.income.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
