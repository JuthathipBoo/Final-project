"use client";

import Navbar from "../../components/Navbar/Navbar";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./page.css";
// import { fetchAllTraders } from "../traders/page";
import { useState, useEffect , useRef } from "react";
import Swal from "sweetalert2";

const Dashboard = () => {
  interface Trader {
    trader_id: string;
    company_name: string;
    dealer_name: string;
    national_id: string;
    email: string;
    phone_number: string;
    start_date: string;
    end_date: string;
    training_info: {
      training_date: string;
      training_course_name: string;
      training_location: string;
      training_hour: number;
    };
    status: string;
  }
  const [traders, setTraders] = useState<Trader[]>([]);
  const registeredCoursesRef = useRef<Training[]>([]);

  const [registeredCount, setRegisteredCount] = useState<number>(0);


  const fetchAllTraders = async () => {
    try {
      const response = await fetch("http://localhost:8750/traders/getList");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log("✅ ข้อมูลทั้งหมด:", result);
      localStorage.setItem("traders", JSON.stringify(result.data));
      setTraders(result.data); // เซ็ตข้อมูลทั้งหมด
    } catch (error) {
      console.error("เกิดข้อผิดพลาด:", error);
      Swal.fire({
        title: "เกิดข้อผิดพลาด!",
        text: "ไม่สามารถโหลดข้อมูลได้",
        icon: "error",
      });
    }
  };

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
    // course_image: string | null;
  }
  const [courses, setCourses] = useState<Training[]>([]);

  const fetchTrainings = async () => {
    try {
      const response = await fetch("http://localhost:8750/training/getList", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (Array.isArray(data.data)) {
        setCourses(data.data);
      } else {
        console.error("API did not return an array:", data);
      }
    } catch (error) {
      console.error("Error fetching trainings:", error);
    }
  };

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
          registeredCoursesRef.current = registeredCourses; // เก็บข้อมูลใน useRef แทนการ set state
          setRegisteredCount(registeredCourses.length); // อัพเดตเฉพาะจำนวน
        } else {
          console.error("⛔ Expected an array but got:", registeredCourses);
          registeredCoursesRef.current = []; // ถ้าไม่ได้ array ก็ให้เป็น empty array
        }
      } catch (error) {
        console.error("Error fetching courses", error);
      } 
    };

    fetchRegisteredCourses();

    // const interval = setInterval(fetchRegisteredCourses, 10000);
    // return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchAllTraders();
    fetchTrainings();
  }, []);

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-container-card">
        <div className="card" style={{ width: "18rem" }}>
          <div className="card-body">
            <p className="trader-card-title">จำนวนผู้ค้าตราสารหนี้ทั้งหมด</p>
            <p className="trader-card-text">{traders.length} คน</p>
          </div>
        </div>
        <div className="card" style={{ width: "18rem" }}>
          <div className="card-body">
            <p className="training-card-title">จำนวนหลักสูตรทั้งหมด</p>
            <p className="training-card-text">{courses.length} หลักสูตร</p>
          </div>
        </div>
        <div className="card" style={{ width: "18rem" }}>
          <div className="card-body">
            <p className="regis-card-title">จำนวนหลักสูตรที่ลงทะเบียน</p>
            <p className="regis-card-text">{registeredCount} หลักสูตร</p>
          </div>
        </div>
      </div>

      <div className="dashboard-container-activity">
        <span className="bg text">กิจกรรมล่าสุด</span>
      </div>
      <div className="dashboard-container-card-activity">
        <div className="card" style={{ width: "40rem", height: "18rem" }}>
          <div className="card-body">
            <p className="table-card-title">ผู้ค้าตราสารหนี้ที่เพิ่มล่าสุด</p>
            <table className="table-card-text scrollable-table">
              <thead>
                <tr>
                  <th>รหัสผู้ค้าตราสารหนี้</th>
                  <th>บริษัทที่สังกัด</th>
                  <th>ชื่อผู้ค้าตราสารหนี้</th>
                  <th>วันที่ลงทะเบียน</th>
                </tr>
              </thead>
              <tbody>
                {traders
                  .sort((a, b) => b.trader_id.localeCompare(a.trader_id))
                  .slice(0, 3) // ดึง 3 คนแรก
                  .map((trader) => (
                    <tr key={trader.trader_id}>
                      <td>{trader.trader_id}</td>
                      <td>{trader.company_name}</td>
                      <td>{trader.dealer_name}</td>
                      <td>{trader.start_date.split("T")[0]}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        <div
          className="card"
          style={{
            width: "40rem",
            height: "18rem",
            backgroundColor: "#266b61",
          }}
        >
          <div className="card-body">
            <p className="table-regis-card-title">หลักสูตรที่เพิ่มล่าสุด</p>
            <table className="table-regis-card-text">
              <thead>
                <tr>
                  <th>รหัสหลักสูตร</th>
                  <th>ชื่อหลักสูตร</th>
                  {/* <th>จำนวนที่นั่ง</th> */}
                  <th>วันที่เพิ่มหลักสูตร</th>
                </tr>
              </thead>
              <tbody>
              {courses
                  .sort((a, b) => new Date(b.course_date).getTime() - new Date(a.course_date).getTime()) // เรียงลำดับจากใหม่ไปเก่า
                  .slice(0, 3) // ดึง 3 คนแรก
                  .map((training) => (
                    <tr key={training.course_id}>
                      <td>{training.course_id}</td>
                      <td>{training.course_name}</td>
                      {/* <td>{training.course_seat}</td> */}
                      <td>{training.course_date.split("T")[0]}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
