const express = require("express");
const { dahshboardController } = require("../controllers/dashboard-controller");
const { authMiddleaware } = require("../middleware/auth-middleware");

const router = express.Router();

router.get("/", authMiddleaware, dahshboardController);

module.exports = router;
