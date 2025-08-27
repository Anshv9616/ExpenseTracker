
require("dotenv").config();

const express = require("express");
const cors = require("cors");      
const path = require("path");    
const connectDB = require("./config/db");
const authRoutes =require("./routes/authRoutes")
const app = express(); 
const incomeRoutes =require("./routes/incomeRoutes")
const expenseRoutes =require("./routes/expenseRoutes");
const dashboard =require("./routes/dashboardRoutes")

app.use(
  cors({
    origin:"https://expense-tracker-htol.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use(express.json());


connectDB();


app.use("/api/v1/auth",authRoutes)


app.use("/uploads",express.static(path.join(__dirname,"uploads")));

app.use("/api/v1/income",incomeRoutes)
app.use("/api/v1/expense",expenseRoutes)
app.use("/api/v1/dashboard",dashboard);


const PORT = process.env.PORT || 5000;


app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
