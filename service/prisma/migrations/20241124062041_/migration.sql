/*
  Warnings:

  - You are about to drop the column `veeqoProductId` on the `Product` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Product_veeqoProductId_key";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "veeqoProductId";
