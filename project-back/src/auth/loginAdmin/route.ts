import express, { Request, Response } from "express";
import mongoose from "mongoose";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// import Swal from 'sweetalert2';

const loginAdmin = express();

const adminSchema = new mongoose.Schema({
  admin_id: String,
  admin_name: String,
  admin_email: String,
  admin_phone: String,
  admin_cardId: String,
  admin_createdAt: Date,
  admin_status: String,
});

const Admins = mongoose.model("admins", adminSchema);

mongoose
  .connect("mongodb://localhost:27017/traderDB?authSource=traderDB")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

loginAdmin.post("/login", async (req, res) => {
  const { admin_email, admin_cardId } = req.body;

  try {
    const admins = await Admins.findOne({ admin_email });

    if (!admins) {
      return res.status(400).json({
        message: "อีเมลไม่ถูกต้องหรือไม่มีผู้ใช้ในระบบ",
      });
    }

    if (admins.admin_cardId !== admin_cardId) {
      return res.status(400).json({ message: "รหัสผ่านไม่ถูกต้อง" });
    }

    // สร้าง JWT Token
    const token = jwt.sign(
      {
        id: admins.admin_id,
        email: admins.admin_email,
      },
      "SECRET_KEY",
      { expiresIn: "1h" }
    );

    res.json({ token, admin: admins });
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
  }
});

export { loginAdmin };
