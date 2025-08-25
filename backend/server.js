// Load environment variables from .env file into process.env
require("dotenv").config();

const express = require("express"); // Import Express framework
const cors = require("cors");       // Import CORS middleware
const path = require("path");       // Import path utility (built-in Node module)
const connectDB = require("./config/db"); // Import the MongoDB connection function
const authRoutes =require("./routes/authRoutes")
const app = express(); // Create an Express application
const incomeRoutes =require("./routes/incomeRoutes")
const expenseRoutes =require("./routes/expenseRoutes");
const dashboard =require("./routes/dashboardRoutes")
// Enable Cross-Origin Resource Sharing (CORS)
// This allows your backend to accept requests from your frontend (different origin/port)
app.use(
  cors({
    origin:"https://expense-tracker-htol.vercel.app", // Allow specific frontend URL or any origin ("*")
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed request headers
  })
);

// Middleware to parse incoming JSON data from request body
app.use(express.json());

// Connect to MongoDB database
connectDB();

//mounting
app.use("/api/v1/auth",authRoutes)

//serve upload folder

app.use("/uploads",express.static(path.join(__dirname,"uploads")));

app.use("/api/v1/income",incomeRoutes)
app.use("/api/v1/expense",expenseRoutes)
app.use("/api/v1/dashboard",dashboard);

// Get the server port from .env or use 5000 as a default
const PORT = process.env.PORT || 5000;

// Start the server and listen for incoming requests
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
