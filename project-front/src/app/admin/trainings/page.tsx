"use client";

import "./page.css";
import Navbar from "../../components/Navbar/Navbar";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useEffect, useState, useCallback } from "react";
import CourseCard from "../../components/CourseCard/CourseCard";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";

const Trainings = () => {
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
  const [courses, setCourses] = useState<Training[]>([]);
  const [showForm, setShowForm] = useState(false); // ใช้ state ควบคุมการแสดงฟอร์มใน Modal
  const [newTrainingId, setNewTrainingId] = useState<string>("");
  const [courseLevel, setCourseLevel] = useState("");
  const [showModal, setShowModal] = useState(false); // ใช้ state ควบคุมการแสดง Modal สําหรับการแก้ไขหลักสูตร
  const [isEditing, setIsEditing] = useState(false);
  const [editTraining, setEditTraining] = useState<Training | null>(null);
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(
    null
  );
  // const [courseImage, setCourseImage] = useState<File | null>(null);

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

  const handleAddTraining = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!courseLevel || !newTrainingId) {
      console.error("กรุณาเลือกประเภทหลักสูตรก่อน");
      return;
    }

    if (!(e.target instanceof HTMLFormElement)) {
      console.error("Error: e.target is not a form.");
      return;
    }
    const form = e.target;
    const formData = new FormData(form);

    const Dateday =
      (formData.get("course_date") as string) ||
      new Date().toISOString().split("T")[0]; // set default to today

    // ตรวจสอบให้แน่ใจว่า Dateday เป็นวันที่ถูกต้อง
    const DatedayObj = new Date(Dateday);
    if (isNaN(DatedayObj.getTime())) {
      console.error("Invalid start date:", Dateday);
      Swal.fire({
        title: "วันที่ไม่ถูกต้อง",
        text: "กดปุ่มเพื่อเสร็จสิ้น",
        icon: "warning",
        confirmButtonText: "ยืนยัน",
        customClass: {
          title: "swal-title",
          popup: "swal-popup",
          confirmButton: "swal-confirm-button",
        },
      });
      return;
    }

    const courseSeat = Number(formData.get("course_seat"));
    if (courseSeat > 50) {
      Swal.fire({
        title: "ไม่สามารถกำหนดจำนวนที่นั่งเกิน 50 คนได้",
        text: "กดปุ่มเพื่อเสร็จสิ้น",
        icon: "warning",
        confirmButtonText: "ยืนยัน",
        customClass: {
          title: "swal-title",
          popup: "swal-popup",
          confirmButton: "swal-confirm-button",
        },
      });
      return;
    }

    try {
      // สร้างหลักสูตร
      const newTraining = {
        course_id: newTrainingId,
        course_name: formData.get("course_name") as string,
        course_level: courseLevel,
        course_details: formData.get("course_details") as string,
        course_date: Dateday,
        course_place: formData.get("course_place") as string,
        course_hour: Number(formData.get("course_hour")),
        course_minute: Number(formData.get("course_minute")),
        course_seat: Number(formData.get("course_seat")),
        // course_image: uploadData.imageUrl, // URL รูปที่อัปโหลด
      };

      const response = await fetch("http://localhost:8750/training/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTraining),
      });

      const result = await response.json();
      if (response.ok) {
        console.log("หลักสูตรถูกเพิ่มแล้ว:", result.course_id); // จะได้รับ course_id ใหม่ที่เพิ่มเข้ามา
        Swal.fire({
          title: "เพิ่มข้อมูลหลักสูตรอบรมสำเร็จ!",
          text: "กดปุ่มเพื่อเสร็จสิ้น",
          icon: "success",
          confirmButtonText: "ยืนยัน",
          customClass: {
            title: "swal-title",
            popup: "swal-popup",
            confirmButton: "swal-confirm-button",
          },
        });
        setShowForm(false);
        fetchTrainings(); // โหลดข้อมูลใหม่
      } else {
        console.error("เพิ่มหลักสูตรไม่สำเร็จ:", result.message);
      }
    } catch (error) {
      console.error("Error adding training:", error);
    }
  };

  const handleEditTraining = async (trainingId: string) => {
    if (!trainingId) {
      console.error("trainingId เป็น undefined หรือ null");
      Swal.fire({
        title: "เกิดข้อผิดพลาด!",
        text: "ไม่พบรหัสหลักสูตร กรุณาลองใหม่",
        icon: "error",
        confirmButtonText: "ตกลง",
        customClass: {
          title: "swal-title",
          popup: "swal-popup",
          confirmButton: "swal-confirm-button",
        },
      });
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8750/training/${trainingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editTraining),
        }
      );

      if (!response.ok) {
        console.error(
          "Error: ไม่สามารถอัปเดตข้อมูลได้, status:",
          response.status
        );
        const errorMessage = await response.text(); // อ่านข้อความที่ตอบกลับจาก API
        console.error("ข้อความจาก API:", errorMessage);
        Swal.fire({
          title: "เกิดข้อผิดพลาด!",
          text: errorMessage || "ไม่สามารถอัปเดตข้อมูลได้",
          icon: "error",
          confirmButtonText: "ตกลง",
          customClass: {
            title: "swal-title",
            popup: "swal-popup",
            confirmButton: "swal-confirm-button",
          },
        });
        return;
      }

      const result = await response.json();
      console.log("API ตอบกลับ:", result);

      if (result.status === "Success") {
        Swal.fire({
          title: "บันทึกข้อมูลหลักสูตรสำเร็จ!",
          text: "กดปุ่มเพื่อทำต่อ",
          icon: "success",
          confirmButtonText: "ตกลง",
          customClass: {
            title: "swal-title",
            popup: "swal-popup",
            confirmButton: "swal-confirm-button",
          },
        }).then(() => {
          window.location.reload(); // รีเฟรชหน้า
        });
        setSelectedTraining(editTraining); // อัปเดตข้อมูลใน State หลัก
        setShowForm(false); // ปิด Modal
      } else if (
        !editTraining?.course_name ||
        !editTraining?.course_details ||
        !editTraining?.course_date ||
        !editTraining?.course_place ||
        !editTraining?.course_hour ||
        !editTraining?.course_minute ||
        !editTraining?.course_seat
      ) {
        Swal.fire({
          title: "กรุณากรอกข้อมูลให้ครบ!",
          text: "กดปุ่มเพื่อทำต่อ",
          icon: "warning",
          confirmButtonText: "ตกลง",
          customClass: {
            title: "swal-title",
            popup: "swal-popup",
            confirmButton: "swal-confirm-button",
          },
        });
        return;
      } else {
        console.error("Error from API:", result.message);
        Swal.fire({
          title: "ไม่สามารถบันทึกข้อมูลได้!",
          text: "กดปุ่มเพื่อทำต่อ",
          icon: "error",
          confirmButtonText: "ตกลง",
          customClass: {
            title: "swal-title",
            popup: "swal-popup",
            confirmButton: "swal-confirm-button",
          },
        });
      }
    } catch (error) {
      console.error("Error editing training:", error);
    }
  };

  const handleDeleteTraining = async (trainingId: string) => {
    Swal.fire({
      title: "ยืนยันการลบออกจากรายการ?",
      text: "ข้อมูลจะยังคงอยู่ในระบบ แต่จะถูกซ่อนจากตารางนี้",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      customClass: {
        title: "swal-title",
        popup: "swal-popup",
        confirmButton: "swal-confirm-button",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setCourses((prevTraining) => {
          // ลบ trader ออกจากรายการ
          const updatedTraining = prevTraining.filter(
            (t) => t.course_id !== trainingId
          );

          // แยกหลักสูตรตามประเภท
          const basicCourses = updatedTraining.filter(
            (training) => training.course_level === "หลักสูตรพื้นฐาน"
          );
          const mediumCourses = updatedTraining.filter(
            (training) => training.course_level === "หลักสูตรระดับกลาง"
          );
          const advancedCourses = updatedTraining.filter(
            (training) => training.course_level === "หลักสูตรขั้นสูง"
          );

          // อัปเดต training_id ใหม่ตามลำดับที่เหลือ
          const reorderedTraining = [
            ...basicCourses.map((training, index) => ({
              ...training,
              course_id: `FI-010${index + 1}`,
            })),
            ...mediumCourses.map((training, index) => ({
              ...training,
              course_id: `FI-020${index + 1}`,
            })),
            ...advancedCourses.map((training, index) => ({
              ...training,
              course_id: `FI-030${index + 1}`,
            })),
          ];

          return reorderedTraining;
        });

        Swal.fire({
          title: "ลบสำเร็จ!",
          text: "ข้อมูลถูกลบออกจากตารางแล้ว",
          icon: "success",
          showCancelButton: true,
          confirmButtonText: "ยืนยัน",
          cancelButtonText: "ยกเลิก",
          customClass: {
            title: "swal-title",
            popup: "swal-popup",
            confirmButton: "swal-confirm-button",
          },
        });
      }
    });
  };

  const openModal = async (trainingId: string) => {
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

  const generateCourseId = useCallback((level: string, courses: Training[]) => {
    const courseId = generateCourseId("หลักสูตรพื้นฐาน", courses);
    console.log(courseId);
    let prefix = "";

    switch (level) {
      case "หลักสูตรพื้นฐาน":
        prefix = "FI-010";
        break;
      case "หลักสูตรระดับกลาง":
        prefix = "FI-020";
        break;
      case "หลักสูตรขั้นสูง":
        prefix = "FI-030";
        break;
      default:
        return "";
    }

    // ค้นหารหัสสูงสุดของหลักสูตรประเภทเดียวกัน
    const filteredCourses = courses.filter((c) => c.course_level === level);
    const nextNumber = filteredCourses.length + 1;
    return `${prefix}${String(nextNumber).padStart(2, "0")}`;
  }, []);

  const handleCancel = () => {
    setNewTrainingId(""); // รีเซ็ตรหัสหลักสูตร
    setShowForm(false); // ปิด Modal

    const form = document.getElementById("addTrainingForm") as HTMLFormElement;
    if (form) {
      form.reset();
    }

    const DatedayInput = document.getElementsByName(
      "course_date"
    )[0] as HTMLInputElement;
    if (DatedayInput) {
      DatedayInput.value = "";
    }
  };

  useEffect(() => {
    fetchTrainings();
  }, []);

  useEffect(() => {
    if (courseLevel) {
      let prefix = "";
      switch (courseLevel) {
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
          return;
      }

      // คำนวณจำนวนหลักสูตรที่มีในแต่ละประเภท
      const nextId =
        courses.filter((course) => course.course_level === courseLevel).length +
        1;

      // สร้างรหัสใหม่ที่มีลำดับ
      setNewTrainingId(`${prefix}${String(nextId).padStart(2, "0")}`);
    }
  }, [courseLevel, courses]); // ทำงานทุกครั้งที่ courseLevel หรือ courses เปลี่ยนแปลง

  useEffect(() => {
    console.log("🔍 selectedTraining:", selectedTraining);
  }, [selectedTraining]);

  useEffect(() => {
    if (selectedTraining) {
      setEditTraining(selectedTraining);
      console.log("🔄 อัปเดต editTraining:", selectedTraining);
    }
  }, [selectedTraining]);

  return (
    <div className="trainings-warrapper">
      <Navbar />
      <div className="trainings-container">
        <div className="trainings-container-search-input">
          <i className="bi bi-search"></i>
          <input type="text" placeholder="ค้นหาหลักสูตรอบรม" />
        </div>

        <div className="trainings-container-link">
          <Link href="/admin/trainings" className="trainings-nav-item">
            หลักสูตรทั้งหมด
          </Link>
          <Link href="/admin/basicCourse" className="trainings-nav-item">
            หลักสูตรพื้นฐาน
          </Link>
          <Link href="/admin/mediumCourse" className="trainings-nav-item">
            หลักสูตรระดับกลาง
          </Link>
          <Link href="/admin/advanceCourse" className="trainings-nav-item">
            หลักสูตรขั้นสูง
          </Link>
        </div>
        <div className="trainings-container-button">
          <button
            type="button"
            className="btn btn-outline-success"
            onClick={() => setShowForm(true)}
          >
            เพิ่มหลักสูตร
          </button>
        </div>

        {/* เพิ่มหลักสูตร */}
        <Modal
          show={showForm}
          // onHide={handleCancel}
          className="addTraining-modal"
          style={{ fontFamily: "Noto Sans Thai" }}
        >
          <Modal.Header>
            <Modal.Title>เพิ่มหลักสูตรอบรม</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form
              id="addTrainingForm"
              onSubmit={handleAddTraining}
              method="POST"
            >
              <div className="form-group">
                <label>ประเภทหลักสูตร</label>
                <Form.Select
                  aria-label="Default select example"
                  className="form-control"
                  value={courseLevel}
                  onChange={(e) => setCourseLevel(e.target.value)}
                >
                  <option value="">เลือกประเภทหลักสูตรอบรม</option>
                  <option value="หลักสูตรพื้นฐาน">หลักสูตรพื้นฐาน</option>
                  <option value="หลักสูตรระดับกลาง">หลักสูตรระดับกลาง</option>
                  <option value="หลักสูตรขั้นสูง">หลักสูตรขั้นสูง</option>
                </Form.Select>
              </div>
              <div className="form-group">
                <label>รหัสหลักสูตรอบรม</label>
                <input
                  type="text"
                  className="form-control"
                  value={newTrainingId}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label>รูปภาพหลักสูตร</label>
                <input
                  type="file"
                  accept="image/png"
                  name="course_image"
                  className="form-control"
                  // onChange={handleFileChange}
                />
              </div>
              <div className="form-group">
                <label>ชื่อหลักสูตร</label>
                <input
                  type="text"
                  name="course_name"
                  className="form-control"
                  placeholder=""
                />
              </div>
              <div className="mb-3 form-group">
                <label>รายละเอียดหลักสูตร</label>
                <textarea
                  className="form-control"
                  id="exampleFormControlTextarea1"
                  rows={3}
                  name="course_details"
                ></textarea>
              </div>
              <div className="form-group">
                <label>จำนวนที่นั่ง</label>
                <input
                  type="text"
                  name="course_seat"
                  className="form-control"
                  placeholder=""
                />
              </div>
              <div className="form-group">
                <label>วันที่หลักสูตร</label>
                <input
                  type="date"
                  name="course_date"
                  className="form-control"
                  value={new Date().toISOString().split("T")[0]} // กำหนดให้เป็นวันปัจจุบัน
                  disabled
                />
              </div>
              <div className="form-group">
                <label>สถานที่อบรม</label>
                <input
                  type="text"
                  name="course_place"
                  className="form-control"
                  placeholder=""
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>จำนวนชั่วโมง</label>
                  <input
                    type="number"
                    name="course_hour"
                    className="form-control"
                    placeholder=""
                  />
                </div>
                <div className="form-group">
                  <label>จำนวนนาที</label>
                  <input
                    type="number"
                    name="course_minute"
                    className="form-control"
                    placeholder=""
                  />
                </div>
              </div>

              <div className="button-container">
                <button className="btn btn-success" type="submit">
                  ยืนยัน
                </button>
                <button
                  className="btn btn-danger"
                  type="button"
                  onClick={handleCancel}
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer></Modal.Footer>
        </Modal>

        {/* ดูข้อมูลหลักสูตร/แก้ไขหลักสูตร */}
        <Modal
          key={selectedTraining?.course_id || Math.random()}
          // key={forceRender}
          show={showModal}
          // fullscreen={fullscreen.toString()}
          onHide={() => setShowModal(false)}
          style={{ fontFamily: "Noto Sans Thai" }}
          className="custom-modal"
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              {isEditing ? "แก้ไขข้อมูลหลักสูตรอบรม" : "ข้อมูลหลักสูตรอบรม"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div>
                <strong>รหัสหลักสูตรอบรม :</strong>
                {isEditing ? (
                  <input
                    type="text"
                    className="form-control"
                    value={editTraining?.course_id || ""}
                    onChange={(e) =>
                      setSelectedTraining({
                        ...selectedTraining,
                        course_id: e.target.value,
                      } as Training)
                    }
                  />
                ) : (
                  <span>{selectedTraining?.course_id || "ไม่พบข้อมูล"}</span>
                )}
              </div>
              <div>
                <strong>ประเภทหลักสูตร :</strong>
                {isEditing ? (
                  <Form.Select
                    aria-label="Default select example"
                    className="form-control"
                    value={courseLevel}
                    onChange={(e) => setCourseLevel(e.target.value)}
                  >
                    <option value="">เลือกประเภทหลักสูตรอบรม</option>
                    <option value="Basic">หลักสูตรพื้นฐาน</option>
                    <option value="Medium">หลักสูตรระดับกลาง</option>
                    <option value="Advanced">หลักสูตรขั้นสูง</option>
                  </Form.Select>
                ) : (
                  <span>{selectedTraining?.course_level || "ไม่พบข้อมูล"}</span>
                )}
              </div>
              <div>
                <strong>ชื่อหลักสูตร :</strong>
                {isEditing ? (
                  <input
                    type="text"
                    className="form-control"
                    value={editTraining?.course_name || ""}
                    onChange={(e) =>
                      setEditTraining({
                        ...(editTraining as Training),
                        course_name: e.target.value,
                      })
                    }
                  />
                ) : (
                  <span>{selectedTraining?.course_name || "ไม่พบข้อมูล"}</span>
                )}
              </div>
              <div>
                <strong>รายละเอียดหลักสูตร :</strong>{" "}
                {isEditing ? (
                  <textarea
                    rows={3}
                    className="form-control"
                    value={editTraining?.course_details || ""}
                    onChange={(e) =>
                      setEditTraining({
                        ...(editTraining as Training),
                        course_details: e.target.value,
                      })
                    }
                  />
                ) : (
                  <span>
                    {selectedTraining?.course_details || "ไม่พบข้อมูล"}
                  </span>
                )}
              </div>
              <div>
                <strong>จำนวนที่นั่ง : </strong>
                {isEditing ? (
                  <input
                    type="text"
                    className="form-control"
                    value={editTraining?.course_seat || ""}
                    onChange={(e) =>
                      setEditTraining({
                        ...(editTraining as Training),
                        course_seat: Number(e.target.value),
                      })
                    }
                  />
                ) : (
                  <span>{selectedTraining?.course_seat || "ไม่พบข้อมูล"}</span>
                )}
              </div>
              <div>
                <strong>วันที่จัดหลักสูตร : </strong>{" "}
                {isEditing ? (
                  <input
                    type="date"
                    className="form-control"
                    value={editTraining?.course_date || ""}
                    onChange={(e) =>
                      setEditTraining({
                        ...(editTraining as Training),
                        course_date: e.target.value,
                      })
                    }
                  />
                ) : (
                  <span>
                    {selectedTraining?.course_date.split("T")[0] ||
                      "ไม่พบข้อมูล"}
                  </span>
                )}
              </div>
              <div>
                <strong>สถานที่อบรม : </strong>{" "}
                {isEditing ? (
                  <input
                    type="text"
                    className="form-control"
                    value={editTraining?.course_place || ""}
                    onChange={(e) =>
                      setEditTraining({
                        ...(editTraining as Training),
                        course_place: e.target.value,
                      })
                    }
                  />
                ) : (
                  <span>{selectedTraining?.course_place || "ไม่พบข้อมูล"}</span>
                )}
              </div>
              <div className="form-row">
                <div>
                  <strong>จำนวนชั่วโมง : </strong>{" "}
                  {isEditing ? (
                    <input
                      type="number"
                      className="form-control"
                      placeholder=""
                      value={editTraining?.course_hour || ""}
                      onChange={(e) => {
                        setEditTraining({
                          ...(editTraining as Training),
                          course_hour: Number(e.target.value),
                        });
                      }}
                    />
                  ) : (
                    <span>
                      {(selectedTraining?.course_hour ?? 0) + " ชั่วโมง"}
                    </span>
                  )}
                </div>
                <div>
                  <strong>จำนวนนาที : </strong>{" "}
                  {isEditing ? (
                    <input
                      type="number"
                      className="form-control"
                      placeholder=""
                      value={editTraining?.course_minute || ""}
                      onChange={(e) => {
                        setEditTraining({
                          ...(editTraining as Training),
                          course_minute: Number(e.target.value),
                        });
                      }}
                    />
                  ) : (
                    <span>
                      {selectedTraining?.course_minute
                        ? selectedTraining.course_minute + " นาที"
                        : ""}
                    </span>
                  )}
                </div>
              </div>
            </form>
          </Modal.Body>

          <Modal.Footer>
            {isEditing ? (
              <>
                <button
                  className="btn btn-success"
                  onClick={() => {
                    console.log("🔹 ปุ่มถูกกด! เรียก handleSave");
                    handleEditTraining(editTraining?.course_id ?? "");
                  }}
                >
                  บันทึก
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setIsEditing(false)}
                >
                  ยกเลิก
                </button>
              </>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => setIsEditing(true)}
              >
                แก้ไข
              </button>
            )}
            <button
              className="btn btn-danger"
              onClick={() => setShowModal(false)}
            >
              ปิด
            </button>
          </Modal.Footer>
        </Modal>
      </div>

      <div className="trainings-container-card">
        {courses
          .slice() // สร้างสำเนา Array เพื่อไม่ให้แก้ไข state ต้นฉบับ
          .sort((a, b) => a.course_id.localeCompare(b.course_id)) // เรียงลำดับตาม course_id
          .map((training) => (
            <CourseCard
              key={training.course_id}
              training={training}
              // training={{ ...training, course_image: training.course_image || ''  }}
              openModal={openModal}
              handleDeleteTraining={handleDeleteTraining}
            />
          ))}
      </div>
    </div>
  );
};

export default Trainings;
