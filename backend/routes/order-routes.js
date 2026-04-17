const express = require("express");
const {
  createOrder,
  updateOrder,
  getOrderWithFilter,
} = require("../controllers/order-controller");
const { authMiddleaware } = require("../middleware/auth-middleware");

const router = express.Router();

router.post("/create", authMiddleaware, createOrder);

router.post("/update-status/:id", authMiddleaware, updateOrder);

router.get("/get-order", authMiddleaware, getOrderWithFilter);

module.exports = router;
