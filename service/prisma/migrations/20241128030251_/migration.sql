/*
  Warnings:

  - A unique constraint covering the columns `[lightningInvoice]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "lightningInvoice" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Order_lightningInvoice_key" ON "Order"("lightningInvoice");
