/*
  Warnings:

  - You are about to drop the column `protocols` on the `RelayPool` table. All the data in the column will be lost.
  - You are about to drop the column `relays` on the `RelayPool` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RelayPool" DROP COLUMN "protocols",
DROP COLUMN "relays";

-- CreateTable
CREATE TABLE "Relay" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "protocol" TEXT NOT NULL DEFAULT 'NIP-04',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "npub" TEXT NOT NULL,

    CONSTRAINT "Relay_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Relay_url_key" ON "Relay"("url");

-- CreateIndex
CREATE INDEX "Relay_protocol_idx" ON "Relay"("protocol");

-- CreateIndex
CREATE INDEX "Relay_npub_idx" ON "Relay"("npub");

-- AddForeignKey
ALTER TABLE "Relay" ADD CONSTRAINT "Relay_npub_fkey" FOREIGN KEY ("npub") REFERENCES "RelayPool"("npub") ON DELETE RESTRICT ON UPDATE CASCADE;
