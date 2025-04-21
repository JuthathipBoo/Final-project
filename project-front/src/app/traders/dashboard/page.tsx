"use client";

import NavbarTrader from "../../components/NavbarTrader/NavbarTrader";

import "./page.css";
import { useEffect, useState } from "react";

const DashboardTrader = () => {
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
    statusCourse:
      | "รอยืนยันการผ่านอบรม"
      | "ยืนยันการผ่านอบรม"
      | "ไม่ผ่านการอบรม";
  }

  interface Trader {
    trader_id: string;
    company_name: string;
    dealer_name: string;
    email: string;
    phone_number: string;
  }

  interface Traders {
    trader_id: string;
    company_name: string;
    dealer_name: string;
    national_id: string;
    email: string;
    phone_number: string;
    start_date: string;
    end_date: string;
    status: string;
  }

  const [registeredCourses, setRegisteredCourses] = useState<Training[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [trader, setTrader] = useState<Traders | null>(null);

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

    const traderData = getTrader();
    if (traderData) {
      console.log("✅ ตั้งค่า trader:", traderData);
      setTrader(traderData as Traders);

    }

    const fetchRegisteredCourses = async () => {
      const traderData = getTrader();
      console.log("✅ traderData ที่ได้จาก localStorage:", traderData);
      if (!traderData) {
        return alert("กรุณาเข้าสู่ระบบก่อน");
      }

      const traderId = traderData.trader_id; // ดึง trader_id จาก trader object ที่ได้จาก getTrader()
      if (!traderId) {
        return alert("ไม่พบ traderId ในข้อมูลผู้ใช้");
      }

      try {
       
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
    <div className="dashboardTrader-container">
      <NavbarTrader />
      <div className="dashboardTrader-container-card">
        <div
          className="card"
          style={{ width: "18rem", backgroundColor: "#266b61" }}
        >
          <div className="card-body">
            <p className="status-card-title">สถานะใบอนุญาต</p>
            <p className="status-card-text">
              {trader?.status || "ไม่พบข้อมูลสถานะ"}
            </p>
          </div>
        </div>
        <div
          className="card"
          style={{ width: "18rem", backgroundColor: "#266b61" }}
        >
          <div className="card-body">
            <p className="end-card-title">วันหมดอายุของใบอนุญาต</p>
            <p className="end-card-text">
              {trader?.end_date
                ? new Date(trader.end_date).toLocaleDateString()
                : "ไม่พบข้อมูลวันหมดอายุ"}
            </p>
          </div>
        </div>
      </div>

      <div className="dashboardTrader-container-activity">
        <span className="bg text">หลักสูตรที่ลงทะเบียนไว้</span>
      </div>
      <div className="dashboardTrader-container-card-activity">
        <div className="card" style={{ width: "80rem", height: "20rem" }}>
          <div className="card-body">
            <table className="tableTrader-card-text scrollable-table">
              <thead>
                <tr>
                  <th>รหัสหลักสูตร</th>
                  <th>หลักสูตรอบรม</th>
                  <th>ชื่อหลักสูตร</th>
                  <th>วันที่อบรม</th>
                  <th>สถานที่อบรม</th>
                  <th>จำนวนชั่วโมง-นาที</th>
                  <th>สถานะการลงทะเบียน</th>
                </tr>
              </thead>
              <tbody>
                {registeredCourses.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center" }}>
                      {isLoading
                        ? "กำลังโหลดข้อมูล..."
                        : "ไม่พบหลักสูตรที่ลงทะเบียน"}
                    </td>
                  </tr>
                ) : (
                  registeredCourses.map((course, index) => (
                    <tr key={index}>
                      <td>{course.course_id}</td>
                      <td>{course.course_level}</td>
                      <td>{course.course_name}</td>
                      <td>{course.course_date.split("T")[0]}</td>
                      <td>{course.course_place}</td>
                      <td>{`${course.course_hour} ชั่วโมง ${course.course_minute} นาที`}</td>
                      <td className={`status-${course.status}`}>
                        {course.status}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTrader;
