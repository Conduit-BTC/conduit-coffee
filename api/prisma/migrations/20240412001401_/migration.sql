-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "address1" TEXT NOT NULL,
    "address2" TEXT,
    "zip" TEXT NOT NULL,
    "special_instructions" TEXT,
    "email" TEXT NOT NULL,
    "invoiceId" TEXT,
    "invoiceStatus" TEXT,
    "shipstationId" TEXT,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cart" (
    "id" TEXT NOT NULL,
    "sats_price" DOUBLE PRECISION NOT NULL,
    "cart_price" DOUBLE PRECISION NOT NULL,
    "light_roast" INTEGER NOT NULL,
    "dark_roast" INTEGER NOT NULL,
    "orderId" TEXT NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cart_orderId_key" ON "Cart"("orderId");

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
