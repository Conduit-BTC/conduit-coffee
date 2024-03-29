/*
  Warnings:

  - You are about to drop the `Item` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_cartId_fkey";

-- DropTable
DROP TABLE "Item";

-- CreateTable
CREATE TABLE "Product" (
    "id" STRING NOT NULL,
    "sku" STRING NOT NULL,
    "quantity" INT4 NOT NULL,
    "name" STRING NOT NULL,
    "description" STRING NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "image" STRING NOT NULL,
    "cartId" STRING,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE SET NULL ON UPDATE CASCADE;
