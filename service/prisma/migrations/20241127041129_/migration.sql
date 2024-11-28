/*
  Warnings:

  - You are about to drop the column `email` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `npub` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the `Relay` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RelayPool` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Relay" DROP CONSTRAINT "Relay_npub_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "email",
DROP COLUMN "npub";

-- DropTable
DROP TABLE "Relay";

-- DropTable
DROP TABLE "RelayPool";
