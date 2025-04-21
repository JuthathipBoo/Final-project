import express, { request, Request, Response } from "express";
import mongoose from "mongoose";
import { Trader } from '../traders/route';

const training = express();

const trainingSchema = new mongoose.Schema({
  course_id: String,
  course_level: String,
  course_name: String,
  course_details: String,
  course_date: Date,
  course_place: String,
  course_hour: Number,
  course_minute: Number,
  course_image: String,
  course_seat: Number,
});
const Training = mongoose.model("training", trainingSchema);

mongoose
  .connect("mongodb://localhost:27017/traderDB?authSource=traderDB")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

const registrationSchema = new mongoose.Schema({
  user_id: {
    trader_id: String,
    company_name: String,
    dealer_name: String,
    email: String,
    phone_number: String,
  },
  course: {
    course_id: String,
    course_level: String,
    course_name: String,
    course_details: String,
    course_date: String,
    course_place: String,
    course_hour: Number,
    course_minute: Number,
    course_seat: Number,
  },
  status: {
    type: String,
    enum: ["รออนุมัติ", "ยืนยันการลงทะเบียน", "ไม่อนุมัติ"],
    default: "รออนุมัติ",
  },
  statusCourse: {
    type: String,
    enum: ["รอยืนยันการผ่านอบรม", "ยืนยันการผ่านอบรม", "ไม่ผ่านการอบรม"],
    default: "รอยืนยันการผ่านอบรม",
  },
  registered_at: { type: Date, default: Date.now },
});

const Registration = mongoose.model("registration", registrationSchema);

training.get("/getList", async (req: Request, res: Response) => {
  try {
    const dbResponse = await Training.find().lean();
    const formattedData = dbResponse.map((training) => ({
      course_id: training.course_id,
      course_level: training.course_level,
      course_name: training.course_name,
      course_date: training.course_date,
      course_place: training.course_place,
      course_hour: training.course_hour,
      course_minute: training.course_minute,
      course_seat: training.course_seat,
    }));
    res.status(200).json({
      code: "Success-01-0001",
      status: "Success",
      message: "Successfully fetched Triaging List",
      data: dbResponse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

training.post("/add", async (req: Request, res: Response) => {
  const {
    course_name,
    course_level,
    course_details,
    course_date,
    course_place,
    course_hour,
    course_minute,
    course_seat,
  } = req.body;

  // กำหนด Prefix ตามประเภทของหลักสูตร
  let prefix = "";
  switch (course_level) {
    case "หลักสูตรพื้นฐาน":
      prefix = "FI-01";
      break;
    case "หลักสูตรระดับกลาง":
      prefix = "FI-02";
      break;
    case "หลักสูตรขั้นสูง":
      prefix = "FI-03";
      break;
    default:
      return res.status(400).json({ message: "ประเภทหลักสูตรไม่ถูกต้อง" });
  }

  try {
    // ค้นหาหลักสูตรที่มีประเภทเดียวกัน
    const coursesInLevel = await Training.find({ course_level });

    // คำนวณจำนวนหลักสูตรในประเภทนั้นๆ แล้วสร้างรหัสใหม่
    const nextCourseId = `${prefix}${String(coursesInLevel.length + 1).padStart(
      2,
      "0"
    )}`;

    // สร้างเอกสารใหม่
    const newTraining = new Training({
      course_id: nextCourseId,
      course_name,
      course_level,
      course_details,
      course_date,
      course_place,
      course_hour,
      course_minute,
      course_seat,
    });

    // บันทึกข้อมูลลงในฐานข้อมูล
    await newTraining.save();
    res
      .status(200)
      .json({ message: "หลักสูตรถูกเพิ่มแล้ว", course_id: nextCourseId });
  } catch (err) {
    console.error("Error adding training:", err);
    res
      .status(500)
      .json({ message: "เกิดข้อผิดพลาดในการเพิ่มหลักสูตร", error: err });
  }
});

training.get("/:trainingId", async (req: Request, res: Response) => {
  const { trainingId } = req.params;
  console.log("📌 ค้นหา Training ID:", trainingId);

  try {
    const training = await Training.findOne({ course_id: trainingId });

    if (!training) {
      return res.status(404).json({ status: "Error", message: "ไม่พบข้อมูล" });
    }

    res.json({ status: "Success", data: training });
  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาด:", error);
    res.status(500).json({ status: "Error", message: "Server Error" });
  }
});

training.put("/:trainingId", async (req: Request, res: Response) => {
  try {
    console.log("📌 Training ID:", req.params.course_id);
    const { trainingId } = req.params;

    const updatedTraining = await Training.findOneAndUpdate(
      { course_id: trainingId },
      { $set: req.body },
      { new: true }
    );

    if (!updatedTraining) {
      return res.status(404).json({ status: "Error", message: "ไม่พบข้อมูล" });
    }

    res.json({ status: "Success", data: updatedTraining });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ status: "Error", message: "Internal Server Error" });
  }
});

training.get("/level/:courseLevel", async (req, res) => {
  const db = mongoose.connection;
  try {
    const { courseLevel } = req.params; // รับค่า courseLevel จาก URL params
    console.log("Received courseLevel:", courseLevel); // ตรวจสอบค่าที่ได้รับ

    // เช็คว่ามีการกรอกค่า `courseLevel` หรือไม่
    if (!courseLevel) {
      return res.status(400).json({ message: "กรุณาระบุ course_level" });
    }

    const courses = await db
      .collection("trainings")
      .find({ course_level: courseLevel })
      .toArray();

    if (courses.length === 0) {
      return res
        .status(404)
        .json({ message: `ไม่พบหลักสูตรในระดับ ${courseLevel}` });
    }

    res.json(courses);
  } catch (error) {
    console.error("Error fetching trainings:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาด" });
  }
});

// ✅ ลงทะเบียนหลักสูตร

training.post("/create", async (req: Request, res: Response) => {
  try {
    const { user_id, course } = req.body;

    if (!user_id || !course?.course_id) {
      return res.status(400).json({ message: "Missing user_id or course_id" });
    }

    const exists = await Registration.findOne({
      user_id,
      "course.course_id": course.course_id,
    });

    if (exists) {
      return res
        .status(409)
        .json({ message: "ผู้ใช้นี้ลงทะเบียนหลักสูตรนี้แล้ว" });
    }

    const registration = await Registration.create({
      user_id,
      course: {
        course_id: course.course_id,
        course_name: course.course_name,
        course_level: course.course_level,
        course_details: course.course_details,
        course_date: course.course_date,
        course_place: course.course_place,
        course_hour: course.course_hour,
        course_minute: course.course_minute,
      },
      status: "รออนุมัติ",
      registered_at: new Date(),
    });

    res.status(200).json({ message: "ลงทะเบียนสำเร็จ", data: registration });
  } catch (err) {
    console.error("❌ Error creating registration:", err);
    res.status(500).json({ message: "Server error" });
  }
});

training.get("/registered/:trader_id", async (req: Request, res: Response) => {
  const { trader_id } = req.params;
  console.log("Received trader_id:", trader_id);

  try {
    const registrations = await Registration.find({
      "user_id.trader_id": trader_id,
    });
    console.log("Registrations:", registrations);
    const registeredCourses = registrations.map((reg) => ({
      ...reg.course,
      status: reg.status, // ✅ เพิ่มสถานะลงไป
      statusCourse: reg.statusCourse,
    }));

    res.status(200).json(registeredCourses); // ✅ ส่ง array ตรง
  } catch (err) {
    console.error("❌ Error fetching registered courses:", err);
    res.status(500).json({ message: "Server error" });
  }
});

training.get("/registereds/list", async (req: Request, res: Response) => {
  try {
    const registrations = await Registration.find();
    console.log("Registrations:", registrations);
    // const registeredCourses = registrations.map(reg => reg.course); // ✅ ดึงเฉพาะ course

    res.status(200).json({ data: registrations }); // ✅ ส่ง array ตรง
  } catch (err) {
    console.error("❌ Error fetching registered courses:", err);
    res.status(500).json({ message: "Server error" });
  }
});

training.put("/update/:id", async (req, res) => {
  const { id } = req.params; // ดึง ID จาก URL
  const { status } = req.body; // ดึง status ใหม่จาก body

  // ตรวจสอบว่ามี status ที่ต้องการหรือไม่
  if (
    !status ||
    !["ยืนยันการลงทะเบียน", "ไม่อนุมัติ", "รออนุมัติ"].includes(status)
  ) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    // ค้นหาข้อมูลการลงทะเบียน
    const registration = await Registration.findById(id);

    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    // อัปเดตสถานะ
    registration.status = status;
    await registration.save(); // บันทึกการอัปเดต

    res.status(200).json({
      message: `Registration status updated to ${status}`,
      data: registration,
    });
  } catch (err) {
    console.error("❌ Error updating registration:", err);
    res.status(500).json({ message: "Server error" });
  }
});

training.put("/updateCourse/:id", async (req, res) => {
  const { id } = req.params; // ดึง ID จาก URL
  const { statusCourse } = req.body; // ดึง status ใหม่จาก body

  // ตรวจสอบว่ามี status ที่ต้องการหรือไม่
  if (
    !statusCourse ||
    !["ยืนยันการผ่านอบรม", "ไม่ผ่านการอบรม","รอการยืนยันการผ่านอบรม"].includes(statusCourse)
  ) {
    return res.status(400).json({ message: "Invalid statusCourse" });
  }

  try {
    // ค้นหาข้อมูลการลงทะเบียน
    const registration = await Registration.findById(id);

    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    // อัปเดตสถานะ
    registration.statusCourse = statusCourse;
    await registration.save(); // บันทึกการอัปเดต

    res.status(200).json({
      message: `Registration status updated to ${statusCourse}`,
      data: registration,
    });
  } catch (err) {
    console.error("❌ Error updating registration:", err);
    res.status(500).json({ message: "Server error" });
  }
});



// training.post("/confirm/:trader_id", async (req: Request, res: Response) => {
//   const { trader_id } = req.params;
//   const { training_info } = req.body;

//   // ตรวจสอบว่า training_info มีข้อมูลที่จำเป็น
//   if (!training_info || !training_info.training_date || !training_info.training_course_name) {
//     return res.status(400).json({ message: "ข้อมูลการอบรมไม่ครบถ้วน" });
//   }

//   try {
//     // อัปเดตข้อมูลการอบรมของผู้ค้า
//     const updatedTrader = await Trader.findOneAndUpdate(
//       { trader_id },
//       { $set: { training_info } },
//       { new: true, runValidators: true } // ใช้ runValidators เพื่อให้ Mongoose ตรวจสอบความถูกต้อง
//     );

//     if (!updatedTrader) {
//       return res.status(404).json({ message: "ไม่พบข้อมูลผู้ค้า" });
//     }

//     res.status(200).json({
//       message: "ข้อมูลการอบรมอัปเดตสำเร็จ",
//       trader: updatedTrader,
//     });
//   } catch (err) {
//     console.error("Error confirming training:", err);
//     res.status(500).json({ message: "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์" });
//   }
// });

export { training };
