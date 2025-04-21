"use client";

import Link from "next/link";
import "./page.css";
import Navbar from "../../components/Navbar/Navbar";
import CourseCard from "../../components/CourseCard/CourseCard";
import { useState, useEffect } from "react";
const AdvanceCourse = () => {
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
          "http://localhost:8750/training/level/หลักสูตรขั้นสูง"
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
    <div className="advanceCourse-warrapper">
      <Navbar />
      <div className="advanceCourse-container">
        <div className="advanceCourse-container-search-input">
          <i className="bi bi-search"></i>
          <input type="text" placeholder="ค้นหารหัสผู้ค้าตราสารหนี้" />
        </div>

        <div className="advanceCourse-container-link">
          <Link href="/admin/trainings" className="advanceCourse-nav-item">
            หลักสูตรทั้งหมด
          </Link>
          <Link href="/admin/basicCourse" className="advanceCourse-nav-item">
            หลักสูตรพื้นฐาน
          </Link>
          <Link href="/admin/mediumCourse" className="advanceCourse-nav-item">
            หลักสูตรระดับกลาง
          </Link>
          <Link href="/admin/advanceCourse" className="advanceCourse-nav-item">
            หลักสูตรขั้นสูง
          </Link>
        </div>
      </div>

      <div className="advanceCourse-container-card">
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
          <p>ไม่มีหลักสูตรขั้นสูง</p>
        )}
      </div>
    </div>
  );
};

export default AdvanceCourse;
