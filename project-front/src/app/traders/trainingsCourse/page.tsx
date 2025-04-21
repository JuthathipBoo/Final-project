"use client";

import "./page.css";
import NavbarTrader from "../../components/NavbarTrader/NavbarTrader";
import Link from "next/link";
import CourseCardTrader from "@/app/components/CourseCardTrader/CourseCardTrader";
import { useEffect, useState } from "react";
// import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
// import Swal from "sweetalert2";

const TrainingCourse = () => {
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
  }

  interface Trader {
    trader_id: string;
    company_name: string;
    dealer_name: string;
    email: string;
    phone_number: string;
  }

  const [trainings, setTrainings] = useState<Training[]>([]);
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [registeredCourseIds, setRegisteredCourseIds] = useState<string[]>([]);
  const [registeredCourseDates, setRegisteredCourseDates] = useState<string[]>(
    []
  );
  const [isLocalStorageLoaded, setIsLocalStorageLoaded] =
    useState<boolean>(false);



  const openModalCourse = async (trainingId: string) => {
    console.log("เปิด modal สำหรับ trader ID:", trainingId);
    try {
      const response = await fetch(
        `http://localhost:8750/training/${trainingId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();

      console.log("📌 ข้อมูลที่ได้จาก API:", result);

      if (result && result.data) {
        setSelectedTraining(result.data);
        setTimeout(() => {
          console.log("🟢 เปิด Modal");
          setShowModal(true);
        }, 100);
      } else {
        console.warn("⚠️ ไม่พบข้อมูล trader");
      }
    } catch (error) {
      console.error("Error fetching trader details:", error);
    }
  };

  const handleRegisterCourse = async (training: Training) => {
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

  useEffect(() => {
    const fetchTrainingCourse = async () => {
      try {
        const response = await fetch("http://localhost:8750/training/getList", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const dataCourse = await response.json();
        if (Array.isArray(dataCourse.data)) {
          setTrainings(dataCourse.data);
          console.log("✅ dataCourse.data:", dataCourse.data);
        } else {
          console.error("API did not return an array:", dataCourse);
        }
      } catch (error) {
        console.error("Error fetching trainings:", error);
      }
    };

    const storedIds = localStorage.getItem("registeredCourseIds");
    const storedDates = localStorage.getItem("registeredCourseDates");

    if (storedIds) setRegisteredCourseIds(JSON.parse(storedIds));
    if (storedDates) setRegisteredCourseDates(JSON.parse(storedDates));

    setIsLocalStorageLoaded(true);
    fetchTrainingCourse();


    // const interval = setInterval(fetchTrainingCourse, 10000);
    // return () => clearInterval(interval);
  }, []);

  return (
    <div className="TrainCourse-warrapper">
      <NavbarTrader />
      <div className="TrainCourse-container">
        <div className="TrainCourse-container-search-input">
          <i className="bi bi-search"></i>
          <input type="text" placeholder="ค้นหาหลักสูตรอบรม" />
        </div>
        <div className="TrainCourse-container-link">
          <Link
            href="/traders/trainingsCourse"
            className="TrainCourse-nav-item"
          >
            หลักสูตรทั้งหมด
          </Link>
          <Link
            href="/traders/CourseBasicTrader"
            className="TrainCourse-nav-item"
          >
            หลักสูตรพื้นฐาน
          </Link>
          <Link
            href="/traders/CourseMediumTrader"
            className="TrainCourse-nav-item"
          >
            หลักสูตรระดับกลาง
          </Link>
          <Link
            href="/traders/CourseAdvanceTrader"
            className="TrainCourse-nav-item"
          >
            หลักสูตรขั้นสูง
          </Link>
        </div>
      </div>

      {/* ดูข้อมูลหลักสูตร */}
      <Modal
        key={selectedTraining?.course_id || Math.random()}
        show={showModal}
        onHide={() => setShowModal(false)}
        style={{ fontFamily: "Noto Sans Thai" }}
        className="custom-modal"
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            {"ข้อมูลหลักสูตรอบรม"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <strong>รหัสหลักสูตรอบรม :</strong>
            <span> {selectedTraining?.course_id || "ไม่พบข้อมูล"} </span>
          </div>
          <div>
            <strong>ประเภทหลักสูตร :</strong>
            <span> {selectedTraining?.course_level || "ไม่พบข้อมูล"} </span>
          </div>
          <div>
            <strong>ชื่อหลักสูตร :</strong>
            <span> {selectedTraining?.course_name || "ไม่พบข้อมูล"} </span>
          </div>
          <div>
            <strong>รายละเอียดหลักสูตร :</strong>
            <p> {selectedTraining?.course_details || "ไม่พบข้อมูล"} </p>
          </div>
          {/* <div>
            <strong>จำนวนที่นั่ง :</strong>
            <span> {selectedTraining?.course_seat || "ไม่พบข้อมูล"} </span>
          </div> */}
          <div>
            <strong>วันที่จัดหลักสูตร :</strong>
            <span>
              {selectedTraining?.course_date
                ? selectedTraining.course_date.split("T")[0]
                : "ไม่พบข้อมูล"}
            </span>
          </div>
          <div>
            <strong>สถานที่อบรม :</strong>
            <span> {selectedTraining?.course_place || "ไม่พบข้อมูล"} </span>
          </div>
          <div>
            <strong>ระยะเวลาอบรม :</strong>
            <span>
              {(selectedTraining?.course_hour ?? 0) + " ชั่วโมง "}
              {selectedTraining?.course_minute
                ? selectedTraining.course_minute + " นาที"
                : ""}
            </span>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <button
            className="btn btn-danger"
            onClick={() => setShowModal(false)}
          >
            ปิด
          </button>
        </Modal.Footer>
      </Modal>

      <div className="TrainCourse-container-card">
        {trainings.length > 0 ? (
          trainings
            .filter(
              (training) => !registeredCourseIds.includes(training.course_id)
            )
            .sort((a, b) => a.course_id.localeCompare(b.course_id)) // เรียงตามรหัสหลักสูตร
            .map((training) => (
              <CourseCardTrader
                key={training.course_id}
                training={training}
                openModalCourse={openModalCourse}
                handleRegisterCourse={() => handleRegisterCourse(training)}
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

export default TrainingCourse;
