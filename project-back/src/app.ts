import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import { trader } from "./traders/route";
import { training } from "./trainings/route";
import { loginAdmin } from "./auth/loginAdmin/route";
import { loginTrader } from "./auth/loginTrader/route";


dotenv.config();

mongoose
  .connect("mongodb://localhost:27017/traderDB?authSource=traderDB")
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log("MongoDB connection error:", error));

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

app.use("/traders", trader)
app.use("/training", training)
app.use("/loginAdmin", loginAdmin);
app.use("/loginTrader", loginTrader);




const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
