// server.js

import express from 'express';
import cors from 'cors';
import connectDB from './src/config/db.js';
import dotenv from 'dotenv';
import userRouter from './src/routes/user.route.js';
import  AllInsurance  from './src/routes/allInsurance.route.js';
import insuranceRouter from './src/routes/insurance.route.js';
import cookieParser from 'cookie-parser';


dotenv.config({ path: "./.env" });

const app = express();


app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:8080",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.static("public"));

// Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/insurance", insuranceRouter);
app.use('/api/v1/allinsurance', AllInsurance);

// Database connection and server start
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 4000, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed:", err);
  });
