const { v4: uuidv4 } = require("uuid");
const Order = require("../models/Order");

const PRICE_LIST = {
  shirt: 10,
  pants: 15,
  saree: 20,
};

const createOrder = async (req, res) => {
  try {
    const { customerName, phone, garments } = req.body;

    if (!customerName || !phone || !garments) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    let garmentsData =
      typeof garments === "string" ? JSON.parse(garments) : garments;

    if (!Array.isArray(garmentsData) || garmentsData.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Garments must be a non-empty array",
      });
    }

    let total = 0;

    for (const g of garmentsData) {
      if (g.quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid quantity",
        });
      }

      const price = PRICE_LIST[g.garmentType?.toLowerCase()];
      if (!price) {
        return res.status(400).json({
          success: false,
          message: `Invalid garment type: ${g.garmentType}`,
        });
      }
    }

    const updatedGarments = garmentsData.map((g) => {
      const price = PRICE_LIST[g.garmentType.toLowerCase()];
      total += price * g.quantity;

      return {
        ...g,
        price,
      };
    });

    const deliveryDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

    const order = await Order.create({
      orderId: uuidv4(),
      customerName,
      phone,
      garments: updatedGarments,
      totalAmount: total,
      estimatedDelivery: deliveryDate,
    });

    const formattedDate = deliveryDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: {
        ...order.toObject(),
        estimatedDelivery: formattedDate,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error has occurred",
    });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );
    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error has occurred",
    });
  }
};

const getOrderWithFilter = async (req, res) => {
  try {
    const { status, customerName, phone, garment } = req.query;

    let query = {};

    if (status) query.status = status;
    if (customerName) query.customerName = new RegExp(customerName, "i");
    if (phone) query.phone = phone;
    if (garment) query["garments.garmentType"] = garment;

    const orders = await Order.find(query);
    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error has occurred",
    });
  }
};

module.exports = { createOrder, updateOrder, getOrderWithFilter };
