const express = require("express");
const cors = require("cors");
const connectDb = require("./config/db");
require("dotenv").config();
const authRoutes = require("./routes/auth-routes");
const orderRoutes = require("./routes/order-routes");
const dashboardRoute = require("./routes/dashboard-route");

const app = express();
const port = process.env.PORT || 3000;

connectDb();

//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());

app.use("/api/auth", authRoutes);

app.use("/api/order", orderRoutes);

app.use("/api/dashboard", dashboardRoute);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
