-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "npub" TEXT,
ALTER COLUMN "email" DROP NOT NULL;
