"use client";

import Link from "next/link";
import "./page.css";
import { useState, useEffect } from "react";
import CourseCardTrader from "@/app/components/CourseCardTrader/CourseCardTrader";
import NavbarTrader from "@/app/components/NavbarTrader/NavbarTrader";

const CourseAdvanceTrader = () => {
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
    // course_image: string | null;
  }

  interface Trader {
    trader_id: string;
    company_name: string;
    dealer_name: string;
    email: string;
    phone_number: string;
  }
  
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [registeredCourseIds, setRegisteredCourseIds] = useState<string[]>([]);
  const [registeredCourseDates, setRegisteredCourseDates] = useState<string[]>([]);
  const [isLocalStorageLoaded, setIsLocalStorageLoaded] = useState<boolean>(false);

  const getTrader = (): Trader | null => {
    const raw = localStorage.getItem("trader");
    if (!raw) return null;

    try {
      return JSON.parse(raw);
    } catch (err) {
      console.error("❌ ไม่สามารถ parse trader JSON:", err);
      return null;
    }
  };

  const handleRegisterCourse = async (training: Training) => {
    const trader = getTrader();
    if (!trader) {
      return alert("กรุณาเข้าสู่ระบบก่อนลงทะเบียน");
    }

    const isAlreadyRegistered = registeredCourseIds.some((courseId) => {
      const course = trainings.find((t) => t.course_id === courseId);
      return course?.course_date === training.course_date;
    });

    if (isAlreadyRegistered) {
      return alert("คุณไม่สามารถลงทะเบียนหลักสูตรในวันที่เดียวกันได้");
    }

    try {
      const response = await fetch("http://localhost:8750/training/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: {
            trader_id: trader.trader_id,
            company_name: trader.company_name,
            dealer_name: trader.dealer_name,
            email: trader.email,
            phone_number: trader.phone_number,
          },
          course: training,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("ลงทะเบียนสำเร็จ! กรุณารอการอนุมัติ");
        // setRegisteredCourseIds((prev) => [...prev, training.course_id]);
        // localStorage.setItem(
        //   "registeredCourseIds",
        //   JSON.stringify([...registeredCourseIds, training.course_id])
        // );

        // อัปเดต state และ localStorage
        const updatedIds = [...registeredCourseIds, training.course_id];
        const formattedDate = training.course_date.split("T")[0]; // ตัดเวลาออก
        const updatedDates = [...registeredCourseDates, formattedDate];
        setRegisteredCourseIds(updatedIds);
        setRegisteredCourseDates(updatedDates);

        localStorage.setItem("registeredCourseIds", JSON.stringify(updatedIds));
        localStorage.setItem(
          "registeredCourseDates",
          JSON.stringify(updatedDates)
        );
      } else {
        alert("เกิดข้อผิดพลาด: " + result.message);
      }
    } catch (err) {
      console.error("❌ Error:", err);
      alert("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    }
  };


  
  // ดึงข้อมูลหลักสูตรจาก API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          "http://localhost:8750/training/level/หลักสูตรขั้นสูง"
        );
        if (!response.ok) {
          throw new Error("ไม่พบหลักสูตร");
        }
        const data = await response.json();
        setTrainings(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    const storedIds = localStorage.getItem("registeredCourseIds");
    const storedDates = localStorage.getItem("registeredCourseDates");

    if (storedIds) setRegisteredCourseIds(JSON.parse(storedIds));
    if (storedDates) setRegisteredCourseDates(JSON.parse(storedDates));

    setIsLocalStorageLoaded(true);
    fetchCourses();
  }, []);

  return (
    <div className="CourseAdvanceTrader-warrapper">
      <NavbarTrader />
      <div className="CourseAdvanceTrader-container">
        <div className="CourseAdvanceTrader-container-search-input">
          <i className="bi bi-search"></i>
          <input type="text" placeholder="ค้นหารหัสผู้ค้าตราสารหนี้" />
        </div>

        <div className="CourseAdvanceTrader-container-link">
          <Link
            href="/traders/trainingsCourse"
            className="CourseAdvanceTrader-nav-item"
          >
            หลักสูตรทั้งหมด
          </Link>
          <Link
            href="/traders/CourseBasicTrader"
            className="CourseAdvanceTrader-nav-item"
          >
            หลักสูตรพื้นฐาน
          </Link>
          <Link
            href="/traders/CourseMediumTrader"
            className="CourseAdvanceTrader-nav-item"
          >
            หลักสูตรระดับกลาง
          </Link>
          <Link
            href="/traders/CourseAdvanceTrader"
            className="CourseAdvanceTrader-nav-item"
          >
            หลักสูตรขั้นสูง
          </Link>
        </div>
      </div>

      <div className="CourseAdvanceTrader-container-card">
        {trainings.length > 0 ? (
          trainings.map((training) => (
            <CourseCardTrader
              key={training.course_id}
              training={training}
              openModalCourse={(id) => console.log(`Open modal for course ${id}`)}
              handleRegisterCourse={() => handleRegisterCourse(training)}
              // handleRegisterCourse={(id) => console.log(`Register for course ${id}`)}
              trainings={trainings}
              isRegistered={registeredCourseIds.includes(training.course_id)}
              registeredCourseIds={registeredCourseIds}
              registeredCourseDates={registeredCourseDates}
              isLocalStorageLoaded={isLocalStorageLoaded}
            />
          ))
        ) : (
          <p>ไม่มีหลักสูตรพื้นฐาน</p>
        )}
      </div>
    </div>
  );
};

export default CourseAdvanceTrader;
