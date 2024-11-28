-- CreateTable
CREATE TABLE "RelayPool" (
    "npub" TEXT NOT NULL,
    "relays" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RelayPool_pkey" PRIMARY KEY ("npub")
);
