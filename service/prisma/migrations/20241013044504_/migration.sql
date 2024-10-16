/*
  Warnings:

  - You are about to drop the column `shipstationId` on the `Order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[invoiceId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[veeqoProductId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "shipstationId",
ADD COLUMN     "shippingStatus" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "veeqoProductId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Order_invoiceId_key" ON "Order"("invoiceId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_veeqoProductId_key" ON "Product"("veeqoProductId");
