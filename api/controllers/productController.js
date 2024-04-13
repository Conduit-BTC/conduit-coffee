const getCurrentSatsPrice = require('../utils/getCurrentSatsPrice');
const { addInvoiceToOrder } = require('../utils/invoiceUtils');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllProducts = async (_, res) => {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        sku: true,
        name: true,
        description: true,
        price: true,
        weight: true,
        size_width: true,
        size_length: true,
        size_height: true,
        image_url: true,
      },
    });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createSampleProducts = async (_, res) => {
  try {
    const products = [
      {
        sku: 'LGHT001',
        name: 'Light.ing',
        description:
          'A bright and lively blend of Central and South American beans...',
        price: 19.99,
        quantity: 50,
        weight: 12,
        size_width: 4,
        size_length: 4,
        size_height: 7,
        image_url: 'https://example.com/images/lighting.jpg',
      },
      {
        sku: 'RSST001',
        name: 'Resist.nce',
        description:
          'A bold and robust blend of Indonesian and African beans...',
        price: 21.99,
        quantity: 40,
        weight: 12,
        size_width: 4,
        size_length: 4,
        size_height: 7,
        image_url: 'https://example.com/images/resistance.jpg',
      },
      {
        sku: 'STTC001',
        name: 'Stat.c',
        description:
          'A harmonious blend of South American and African beans...',
        price: 18.99,
        quantity: 60,
        weight: 12,
        size_width: 4,
        size_length: 4,
        size_height: 7,
        image_url: 'https://example.com/images/static.jpg',
      },
    ];

    await prisma.product.createMany({
      data: products,
    });

    res.json({ message: 'Products created successfully' });
  } catch (error) {
    console.error('Error creating products:', error);
  } finally {
    await prisma.$disconnect();
  }
};
