"use client";
import NavbarTrader from "@/app/components/NavbarTrader/NavbarTrader";
import Link from "next/link";
import "./page.css";
import { useEffect, useState } from "react";
import CourseCardTrader from "@/app/components/CourseCardTrader/CourseCardTrader";

const TrainRegisPass = () => {
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

  const [approvedCourses, setApprovedCourses] = useState<Training[]>([]);
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

    const fetchApprovedCourses = async () => {
      const trader = getTrader();
      if (!trader) return alert("กรุณาเข้าสู่ระบบก่อน");

      try {
        const response = await fetch(
          `http://localhost:8750/training/registered/${trader.trader_id}`
        );
        const data = await response.json();
        if (Array.isArray(data)) {
          // กรองเฉพาะหลักสูตรที่ status เป็น "ยืนยันการลงทะเบียน"
          const approved = data.filter(
            (course: Training) => course.status === "ยืนยันการลงทะเบียน"
          );
          setApprovedCourses(approved);
        }
      } catch (error) {
        console.error("Error fetching approved courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApprovedCourses();

    // const interval = setInterval(fetchApprovedCourses, 10000);
    // return () => clearInterval(interval);
  }, []);

  return (
    <div className="TrainRegisPass-warrapper">
      <NavbarTrader />

      <div className="TrainRegisPass-container">
        <div className="TrainRegisPass-container-search-input">
          <i className="bi bi-search"></i>
          <input type="text" placeholder="ค้นหาหลักสูตรอบรม" />
        </div>
        <div className="TrainRegisPass-container-link">
          <Link href="/traders/TrainingsRegis" className="TrainRegis-nav-item">
            หลักสูตรทั้งหมด
          </Link>
          <Link href="/traders/TrainRegisWait" className="TrainRegis-nav-item">
            หลักสูตรที่รออนุมัติ
          </Link>
          <Link href="/traders/TrainRegisPass" className="TrainRegis-nav-item">
            หลักสูตรที่ผ่านการอนุมัติ
          </Link>
          <Link
            href="/traders/TrainRegisReject"
            className="TrainRegis-nav-item"
          >
            หลักสูตรที่ไม่ผ่านการอนุมัติ
          </Link>
        </div>
      </div>
      <div className="TrainRegisPass-container-card">
        {isLoading ? (
          <p>กำลังโหลด...</p>
        ) : approvedCourses.length === 0 ? (
          <p>ยังไม่มีหลักสูตรที่อนุมัติ</p>
        ) : approvedCourses.filter(
            (training) => training.statusCourse === "รอยืนยันการผ่านอบรม"
          ).length === 0 ? (
          // ถ้าไม่มีหลักสูตรที่มีสถานะ "รอยืนยันการผ่านอบรม"
          <p>ยังไม่มีหลักสูตรที่อนุมัติและหลักสูตรที่รอยืนยันการผ่านอบรม</p>
        ) : (
          approvedCourses
            .filter(
              (training) => training.statusCourse === "รอยืนยันการผ่านอบรม"
            )
            .map((training) => (
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

export default TrainRegisPass;
