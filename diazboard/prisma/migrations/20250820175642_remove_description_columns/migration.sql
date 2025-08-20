/*
  Warnings:

  - You are about to drop the column `description` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Income` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Expense" DROP COLUMN "description";

-- AlterTable
ALTER TABLE "public"."Income" DROP COLUMN "description";
