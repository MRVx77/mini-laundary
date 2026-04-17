const Order = require("../models/Order");

const dahshboardController = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();

    const revenueData = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    const statusData = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        totalRevenue: revenueData[0]?.total || 0,
        statusBreakdown: statusData,
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

module.exports = { dahshboardController };
