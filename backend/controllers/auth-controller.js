const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const registerUser = async (req, res) => {
  try {
    const { userName, email = "", password = "" } = req.body;
    if (!email || !password || !userName) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }
    const lowerEmail = email.toLowerCase().trim();

    const existUser = await User.findOne({ email: lowerEmail });

    if (existUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with same email",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const created = await User.create({
      userName,
      email: lowerEmail,
      password: hashedPassword,
    });
    if (created) {
      res.status(201).json({
        success: true,
        message: "New Account created Successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Error whiel creating new Account",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "an error has occured",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const lowerEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: lowerEmail });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid user email or password",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid user password",
      });
    }

    const accessToken = jwt.sign(
      {
        userId: user._id,
        userName: user.userName,
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "an error has occurred",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
