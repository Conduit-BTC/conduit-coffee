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
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cart" (
    "id" TEXT NOT NULL,
    "sats_cart_price" DOUBLE PRECISION NOT NULL,
    "usd_cart_price" DOUBLE PRECISION NOT NULL,
    "shipping_cost_usd" DOUBLE PRECISION NOT NULL,
    "items" TEXT[],
    "orderId" TEXT NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "size_width" DOUBLE PRECISION NOT NULL,
    "size_length" DOUBLE PRECISION NOT NULL,
    "size_height" DOUBLE PRECISION NOT NULL,
    "image_url" TEXT,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cart_orderId_key" ON "Cart"("orderId");

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
