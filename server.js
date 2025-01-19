require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");
const connectMongo = require("./config/mongo");

const app = express();

// Enable CORS for the specific frontend domain
const corsOptions = {
  origin: 'http://localhost:5173', // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  credentials: true, // Allow cookies to be sent with requests (if needed)
};

app.use(cors(corsOptions)); // Apply CORS middleware

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
