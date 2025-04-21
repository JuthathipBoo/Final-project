"use client";

import NavbarTrader from "@/app/components/NavbarTrader/NavbarTrader";
import "./page.css";
import Link from "next/link";
// import CourseCardTrader from "@/app/components/CourseCardTrader/CourseCardTrader";
import { useEffect, useState } from "react";
import CourseCardTrader from "@/app/components/CourseCardTrader/CourseCardTrader";


const TrainingRegis = () => {
  interface Training {
    course_id: string;
    course_level: string;
    course_name: string;
    course_details: string;
    course_date: string;
    course_place: string;
    course_hour: number;
    course_minute: number;
    course_seat: number;
    status: "รออนุมัติ" | "ยืนยันการลงทะเบียน" | "ไม่อนุมัติ";
    statusCourse: "รอยืนยันการผ่านอบรม" | "ยืนยันการผ่านอบรม" | "ไม่ผ่านการอบรม";
  }

  interface Trader {
    trader_id: string;
    company_name: string;
    dealer_name: string;
    email: string;
    phone_number: string;
  }

  const [registeredCourses, setRegisteredCourses] = useState<Training[]>([]);
  const [isLoading, setIsLoading] = useState(true);



  useEffect(() => {
    const getTrader = (): Trader | null => {
      const raw = localStorage.getItem("trader");
      console.log("Raw trader data from localStorage:", raw); // ตรวจสอบข้อมูล raw ใน localStorage
      if (!raw) return null;
  
      try {
        return JSON.parse(raw);
      } catch (err) {
        console.error("❌ ไม่สามารถ parse trader JSON:", err);
        return null;
      }
    };

    const fetchRegisteredCourses = async () => {
      const trader = getTrader();
      if (!trader) {
        return alert("กรุณาเข้าสู่ระบบก่อน");
      }

      const traderId = trader.trader_id; // ดึง trader_id จาก trader object ที่ได้จาก getTrader()
      if (!traderId) {
        return alert("ไม่พบ traderId ในข้อมูลผู้ใช้");
      }

      try {
        // const traderId = localStorage.getItem("traderId"); // ดึง trader_id จาก localStorage หรือ state
        const response = await fetch(
          `http://localhost:8750/training/registered/${traderId}`
        );

        if (!response.ok) {
          console.error("Error: API response was not ok", response.status);
          return;
        }

        const registeredCourses = await response.json();
        console.log("Fetched registered courses:", registeredCourses);

        // ตรวจสอบว่าได้รับข้อมูลที่ถูกต้อง
        if (Array.isArray(registeredCourses)) {
          setRegisteredCourses(registeredCourses);
        } else {
          console.error("⛔ Expected an array but got:", registeredCourses);
          setRegisteredCourses([]);
        }
      } catch (error) {
        console.error("Error fetching courses", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegisteredCourses();

    // const interval = setInterval(fetchRegisteredCourses, 10000);
    // return () => clearInterval(interval);
  }, []);

  return (
    <div className="TrainRegis-warrapper">
      <NavbarTrader />

      <div className="TrainRegis-container">
        <div className="TrainRegis-container-search-input">
          <i className="bi bi-search"></i>
          <input type="text" placeholder="ค้นหาหลักสูตรอบรม" />
        </div>
        <div className="TrainRegis-container-link">
          <Link href="/traders/TrainingsRegis" className="TrainRegis-nav-item">
            หลักสูตรทั้งหมด
          </Link>
          <Link href="/traders/TrainRegisWait" className="TrainRegis-nav-item">
            หลักสูตรที่รออนุมัติ
          </Link>
          <Link href="/traders/TrainRegisPass" className="TrainRegis-nav-item">
            หลักสูตรที่ผ่านการอนุมัติ
          </Link>
          <Link href="/traders/TrainRegisReject" className="TrainRegis-nav-item">
            หลักสูตรที่ไม่ผ่านการอนุมัติ
          </Link>
        </div>
      </div>
      <div className="TrainRegis-container-card">
        {isLoading ? (
          <p>กำลังโหลด...</p>
        ) : registeredCourses.length === 0 ? (
          <p>คุณยังไม่ได้ลงทะเบียนหลักสูตรใด</p>
        ) : (
          registeredCourses
          .filter((training) => training.statusCourse === "รอยืนยันการผ่านอบรม")
          .map((training) => (
            <CourseCardTrader
              key={training.course_id}
              training={training}
              openModalCourse={() => console.log("openModalCourse called")}
              handleRegisterCourse={() =>
                console.log("handleRegisterCourse called")
              }
              isRegistered={true}
              registeredCourseIds={[]}
              isLocalStorageLoaded={true}
              trainings={[]}
              registeredCourseDates={[]}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TrainingRegis;
