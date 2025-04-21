"use client";

import CourseCardTrader from "@/app/components/CourseCardTrader/CourseCardTrader";
import "./page.css";
import NavbarTrader from "@/app/components/NavbarTrader/NavbarTrader";
import Link from "next/link";
import { useEffect, useState } from "react";

const CourseStatusReject = () => {
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

    const [approvedStatusCourses, setApprovedStatusCourses] = useState<Training[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const getTrader = (): Trader | null => {
        const raw = localStorage.getItem("trader");
        if (!raw) return null;
        try {
          return JSON.parse(raw);
        } catch {
          return null;
        }
      };
  
      const fetchApprovedStatusCourses = async () => {
        const trader = getTrader();
        if (!trader) return alert("กรุณาเข้าสู่ระบบก่อน");
  
        try {
          const response = await fetch(
            `http://localhost:8750/training/registered/${trader.trader_id}`
          );
          const data = await response.json();
          if (Array.isArray(data)) {
            // กรองเฉพาะหลักสูตรที่ status เป็น "ยืนยันการผ่านอบรม"
            const approvedStatus = data.filter(
              (course: Training) => course.statusCourse === "ไม่ผ่านการอบรม"
            );
            setApprovedStatusCourses(approvedStatus);
          }
        } catch (error) {
          console.error("Error fetching approvedStatus courses:", error);
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchApprovedStatusCourses();
  
      // const interval = setInterval(fetchApprovedCourses, 10000);
      // return () => clearInterval(interval);
    }, []);


  return (
    <div className="CourseStatusReject-warrapper">
      <NavbarTrader />
      <div className="CourseStatusReject-container">
        <div className="CourseStatusReject-container-search-input">
          <i className="bi bi-search"></i>
          <input type="text" placeholder="ค้นหาหลักสูตรอบรม" />
        </div>
        <div className="CourseStatusReject-container-link">
          <Link
            href="/traders/TrainingHistory"
            className="CourseStatusReject-nav-item"
          >
            หลักสูตรทั้งหมด
          </Link>
          <Link
            href="/traders/CourseStatusWait"
            className="CourseStatusReject-nav-item"
          >
            หลักสูตรที่รอยืนยันการผ่านอบรม
          </Link>
          <Link
            href="/traders/CourseStatusPass"
            className="CourseStatusReject-nav-item"
          >
            หลักสูตรที่ผ่านการอบรม
          </Link>
          <Link
            href="/traders/CourseStatusReject"
            className="CourseStatusReject-nav-item"
          >
            หลักสูตรที่ไม่ผ่านการอบรม
          </Link>
        </div>
      </div>
      <div className="CourseStatusReject-container-card">
      {isLoading ? (
          <p>กำลังโหลด...</p>
        ) : approvedStatusCourses.length === 0 ? (
          <p>ยังไม่มีหลักสูตรที่ผ่านการอบรม</p>
        ) : (
          approvedStatusCourses.map((training) => (
            <CourseCardTrader
              key={training.course_id}
              training={training}
              openModalCourse={() => {}}
              handleRegisterCourse={() => {}}
              isRegistered={true}
              isLocalStorageLoaded={true}
              registeredCourseIds={[]}
              trainings={[]}
              registeredCourseDates={[]}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CourseStatusReject;
