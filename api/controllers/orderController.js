const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { cart: true },
    });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      address,
      zip,
      special_instructions,
      email,
      cart,
    } = req.body;
    const order = await prisma.order.create({
      data: {
        first_name,
        last_name,
        address,
        zip,
        special_instructions,
        email,
        cart: {
          create: cart,
        },
      },
      include: { cart: true },
    });
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
