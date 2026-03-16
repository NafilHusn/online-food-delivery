/*
  Warnings:

  - A unique constraint covering the columns `[refNo]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "refNo" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Order_refNo_key" ON "Order"("refNo");
