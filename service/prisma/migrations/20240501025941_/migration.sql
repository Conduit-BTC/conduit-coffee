/*
  Warnings:

  - Added the required column `shipping_cost_sats` to the `Cart` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "shipping_cost_sats" DOUBLE PRECISION NOT NULL;
