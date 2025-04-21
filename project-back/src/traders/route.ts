import express, { Request, Response } from "express";
import mongoose from "mongoose";

const trader = express();

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

export const Trader = mongoose.model("trader", traderSchema);
trader.get("/getList", async (req: Request, res: Response) => {
  try {
    mongoose.connect("mongodb://localhost:27017/traderDB?authSource=traderDB");
    const dbResponse = await Trader.find().lean();
    const formattedData = dbResponse.map((trader) => ({
      trader_id: trader.trader_id,
      company_name: trader.company_name,
      dealer_name: trader.dealer_name,
      national_id: trader.national_id,
      email: trader.email,
      phone_number: trader.phone_number,
      start_date: trader.start_date,
      training_info: trader.training_info,
      status: trader.status,
    }));
    res.status(200).json({
      code: "Success-01-0001",
      status: "Success",
      message: "Successfully fetched Traders",
      data: dbResponse,
    });
  } catch (error) {
    res.status(500).json({
      code: "Error-01-0001",
      status: "Error",
      message: "Failed to fetch Traders",
    });
  }
});

// trader.get("/:traderId", async (req: Request, res: Response) => {
//   try {
//     mongoose.connect("mongodb://localhost:27017/traderDB?authSource=traderDB");
//     console.log("Trader ID received:", req.params.traderId); // ลองเช็คค่า traderId
//     const traderId = await Trader.findOne({ trader_id: req.params.traderId });
//     if (!traderId) return res.status(404).json({ message: "ไม่พบข้อมูล" });
//     res.status(200).json({
//       code: "Success-01-0001",
//       status: "Success",
//       message: "Successfully fetched Traders",
//       data: traderId,
//     });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({
//       code: "Error-01-0001",
//       status: "Error",
//       message: "Failed to fetch Traders",
//     });
//   }
// });

trader.get('/:traderId', async (req, res) => {
  const { traderId } = req.params;
console.log("📌 ค้นหา Trader ID:", traderId);
  
  try {
      const trader = await Trader.findOne({ trader_id: traderId });
      
      if (!trader) {
          return res.status(404).json({ status: "Error", message: "ไม่พบข้อมูล" });
      }

      res.json({ status: "Success", data: trader });
  } catch (error) {
      console.error("❌ เกิดข้อผิดพลาด:", error);
      res.status(500).json({ status: "Error", message: "Server Error" });
  }
});


const moment = require("moment");
trader.post("/addTrader", async (req: Request, res: Response) => {
  const {
    dealer_name,
    national_id,
    company_name,
    email,
    phone_number,
    start_date,
  } = req.body;

  try {
    await mongoose.connect(
      "mongodb://localhost:27017/traderDB?authSource=traderDB"
    );

    const lastTrader = await Trader.findOne().sort({ trader_id: -1 }).exec();

    let newTraderId = "TRD-0001";

    if (lastTrader && lastTrader.trader_id) {
      const lastIdNumber = parseInt(
        lastTrader.trader_id.replace("TRD-", ""),
        10
      );
      const nextId = lastIdNumber + 1;
      newTraderId = `TRD-${String(nextId).padStart(4, "0")}`;
    }

    const startDate = moment(start_date);
    const expiryDate = startDate.add(2, "years");
    const end_date = expiryDate.format("YYYY-MM-DD");
    const status = moment().isBefore(expiryDate)
      ? "กำลังใช้งาน"
      : "หมดอายุการใช้งาน";

    const newTrader = new Trader({
      trader_id: newTraderId,
      dealer_name,
      national_id,
      company_name,
      email,
      phone_number,
      start_date,
      end_date,
      status,
    });

    const dbResponse = await newTrader.save();

    res.status(200).json({
      code: "Success-01-0001",
      status: "Success",
      message: "Successfully added Trader",
      data: dbResponse,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      code: "Error-01-0001",
      status: "Error",
      message: "Error adding trader: " + error,
    });
  }
});

trader.put("/:traderId", async (req: Request, res: Response) => {
  try {
    console.log("📌 Trader ID:", req.params.trader_id);
    const { traderId } = req.params;

    const updatedTrader = await Trader.findOneAndUpdate(
      { trader_id: traderId },
      { $set: req.body },
      { new: true }
    );

    if (!updatedTrader) {
      return res.status(404).json({ status: "Error", message: "ไม่พบข้อมูล" });
    }

    res.json({ status: "Success", data: updatedTrader });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ status: "Error", message: "Internal Server Error" });
  }
});

export { trader };
