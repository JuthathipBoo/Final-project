"use client";

import Link from "next/link";
import "./page.css";
import Navbar from "../../components/Navbar/Navbar";
import CourseCard from "../../components/CourseCard/CourseCard";
import { useState, useEffect } from "react";

const BasicCourse = () => {
  interface Training {
    course_id: string;
    course_level: string;
    course_name: string;
    course_details: string;
    course_date: string;
    course_place: string;
    course_hour: number;
    course_minute: number;
    // course_image: string | null;
  }
  const [courses, setCourses] = useState<Training[]>([]);

  // ดึงข้อมูลหลักสูตรจาก API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          "http://localhost:8750/training/level/หลักสูตรพื้นฐาน"
        );
        if (!response.ok) {
          throw new Error("ไม่พบหลักสูตร");
        }
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="basicCourse-warrapper">
      <Navbar />
      <div className="basicCourse-container">
        <div className="basicCourse-container-search-input">
          <i className="bi bi-search"></i>
          <input type="text" placeholder="ค้นหารหัสผู้ค้าตราสารหนี้" />
        </div>

        <div className="basicCourse-container-link">
          <Link href="/admin/trainings" className="basicCourse-nav-item">
            หลักสูตรทั้งหมด
          </Link>
          <Link href="/admin/basicCourse" className="basicCourse-nav-item">
            หลักสูตรพื้นฐาน
          </Link>
          <Link href="/admin/mediumCourse" className="basicCourse-nav-item">
            หลักสูตรระดับกลาง
          </Link>
          <Link href="/admin/advanceCourse" className="basicCourse-nav-item">
            หลักสูตรขั้นสูง
          </Link>
        </div>
      </div>

      <div className="basicCourse-container-card">
        {courses.length > 0 ? (
          courses.map((training) => (
            <CourseCard
              key={training.course_id}
              training={training}
              openModal={() => console.log("openModal not implemented")}
              handleDeleteTraining={() =>
                console.log("handleDeleteTraining not implemented")
              }
            />
          ))
        ) : (
          <p>ไม่มีหลักสูตรพื้นฐาน</p>
        )}
      </div>
    </div>
  );
};

export default BasicCourse;
