require("dotenv").config();
console.log(
  process.env.MYSQL_DB,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  process.env.MYSQL_HOST
);
const express = require("express");
const sequelize = require("./config/database");
const connectMongo = require("./config/mongo");

const app = express();
app.use(express.json());

// Routes
app.use("/auth", require("./routes/authRoutes"));
app.use("/books", require("./routes/bookRoutes"));

// Initialize connections
const startServer = async () => {
  try {
    await sequelize.sync(); // MySQL Sync
    await connectMongo(); // MongoDB Connection
    app.listen(3000, () => console.log("Server running on port 3000"));
  } catch (error) {
    console.error("Error starting the server:", error);
  }
};

startServer();
