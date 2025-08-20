import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Currency } from "@/app/generated/prisma";
import { isDatabaseEnabled, getPrismaClient } from "@/app/lib/db";
import { mockExpenses } from "@/app/lib/mock";

const prisma = getPrismaClient();

export async function GET() {
  if (!isDatabaseEnabled()) return NextResponse.json(mockExpenses);
  const items = await prisma.expense.findMany({ orderBy: { date: "desc" } });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!isDatabaseEnabled()) {
    const created = {
      id: `e_${Date.now()}`,
      date: new Date(body.date),
      category: body.category,
      description: body.description || null,
      amountCents: Number(body.amountCents),
      currency: body.currency as Currency,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return NextResponse.json(created);
  }
  const created = await prisma.expense.create({
    data: {
      date: new Date(body.date),
      category: body.category,
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
  if (!isDatabaseEnabled()) return NextResponse.json({ ok: true });
  await prisma.expense.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  if (!body?.id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  if (!isDatabaseEnabled()) return NextResponse.json({ ok: true });
  const updated = await prisma.expense.update({
    where: { id: body.id },
    data: {
      date: body.date ? new Date(body.date) : undefined,
      category: body.category,
      description: body.description ?? undefined,
      amountCents: body.amountCents != null ? Number(body.amountCents) : undefined,
      currency: body.currency as Currency,
    },
  });
  return NextResponse.json(updated);
}