const jwt = require("jsonwebtoken");

const authMiddleaware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Login to create order",
    });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    //console.log(decodedToken);
    req.userInfo = decodedToken;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      success: false,
      message: "an error has occurred your token has expired login again.",
    });
  }
};

module.exports = {
  authMiddleaware,
};
