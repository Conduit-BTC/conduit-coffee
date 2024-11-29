const { dbService } = require('../services/dbService');
const prisma = dbService.getPrismaClient();

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
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createSampleProducts = async (_, res) => {
  console.log('Creating sample products...');
  try {
    const products = [
      {
        "sku": "RSST001",
        "name": "Resist.nce",
        "description": "// dark roast // sumatra // dates, brown butter, cashew & vanilla // weight = 12oz / 340.2g",
        "price": 21,
        "weight": 12,
        "size_width": 4,
        "size_length": 4,
        "size_height": 7,
        "image_url": "https://conduit.coffee/images/coffee-bags/demo-coffee-resistance-front.png",
      },
      {
        "sku": "LGHT001",
        "name": "Light.ing",
        "description": "// light roast // el salvador // golden raisin, brown spice & nougat // weight = 12oz / float 340.2g",
        "price": 21,
        "weight": 12,
        "size_width": 4,
        "size_length": 4,
        "size_height": 7,
        "image_url": "https://conduit.coffee/images/coffee-bags/demo-coffee-lightning -front.png",
      },
    ];

    await prisma.product.createMany({
      data: products,
    });

    res.status(200).json({ message: 'Products created successfully' });
  } catch (error) {
    console.error('Error creating products:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
};

exports.deleteProductById = async (req, res) => {
  try {
    const { id: productId } = req.params;
    console.log('Deleting product with ID:', productId);
    await prisma.product.delete({
      where: {
        id: productId,
      },
    });
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
