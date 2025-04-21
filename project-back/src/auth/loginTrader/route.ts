import express, { Request, Response } from "express";
import mongoose from "mongoose";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const loginTrader = express();

const traderSchema = new mongoose.Schema({
  trader_id: String,
  company_name: String,
  dealer_name: String,
  national_id: String,
  email: String,
  phone_number: String,
  start_date: Date,
  end_date: Date,
  training_info: [
    {
      training_date: String,
      training_course_name: String,
      training_location: String,
      training_hours: String,
    },
  ],
  status: String,
});

mongoose
  .connect("mongodb://localhost:27017/traderDB?authSource=traderDB")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

const Traders = mongoose.model("traders", traderSchema);

loginTrader.post("/login", async (req, res) => {
  const { email, national_id } = req.body;

  try {
    const traders = await Traders.findOne({ email });

    if (!traders) {
      return res.status(400).json({ message: "อีเมลไม่ถูกต้อง" });
    }

    if (traders.national_id !== national_id) {
      return res.status(400).json({ message: "รหัสผ่านไม่ถูกต้อง" });
    }
    console.log("Traders ที่ส่งกลับไปยัง Frontend:", traders);

    // สร้าง JWT Token
    const token = jwt.sign(
      {
        id: traders.national_id,
        email: traders.email,
      },
      "SECRET_KEY",
      { expiresIn: "1h" }
    );

    res.json({
      token,
      trader: traders,
    });
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
  }
});

export { loginTrader };
