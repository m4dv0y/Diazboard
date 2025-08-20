-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."Currency" AS ENUM ('USD', 'CLP', 'QAR', 'PHP');

-- CreateTable
CREATE TABLE "public"."Expense" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "amountCents" INTEGER NOT NULL,
    "currency" "public"."Currency" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Income" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "source" TEXT NOT NULL,
    "description" TEXT,
    "amountCents" INTEGER NOT NULL,
    "currency" "public"."Currency" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Income_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Investment" (
    "id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "asset" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "currency" "public"."Currency" NOT NULL,
    "allocation" INTEGER NOT NULL,
    "performance" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Investment_pkey" PRIMARY KEY ("id")
);

