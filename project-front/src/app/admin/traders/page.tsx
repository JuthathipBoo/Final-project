"use client";
import Navbar from "../../components/Navbar/Navbar";
import "./page.css";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Modal from "react-bootstrap/Modal";

import Swal from "sweetalert2";

const Trader = () => {
  interface Trader {
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

  const [traders, setTraders] = useState<Trader[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedTrader, setSelectedTrader] = useState<Trader | null>(null);
  // const [fullscreen, setFullscreen] = useState(true);
  const [show, setShow] = useState(false);
  const [newTraderId, setNewTraderId] = useState<string>("");
  const [editTrader, setEditTrader] = useState<Trader | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchId, setSearchId] = useState("");
  // const [traderData, setTraderData] = useState<Trader | null>(null);
  const [registeredCourses, setRegisteredCourses] = useState<Training[]>([]);

  function handleShow() {
    // setFullscreen(breakpoint);
    setShow(true);

    const nextTraderId = traders.length + 1;
    const formattedId = `TRD-${String(nextTraderId).padStart(4, "0")}`;
    setNewTraderId(formattedId);

    const currentDate = new Date().toISOString().split("T")[0];
    const startDateInput = document.getElementsByName(
      "start_date"
    )[0] as HTMLInputElement;
    if (startDateInput) {
      startDateInput.value = currentDate; // กำหนดให้ start_date เป็นวันปัจจุบัน
      startDateInput.disabled = true; // ทำให้ไม่สามารถเลือกวันได้
    }
  }

  const openModal = async (traderId: string) => {
    console.log("เปิด modal สำหรับ trader ID:", traderId);
    try {
      const response = await fetch(`http://localhost:8750/traders/${traderId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();

      console.log("📌 ข้อมูลที่ได้จาก API:", result);

      if (result && result.data) {
        setSelectedTrader(result.data); // ✅ ใช้ result.data แทน data ตรง ๆ

        const courseRes = await fetch(
          `http://localhost:8750/training/registered/${traderId}`
        );
        if (!courseRes.ok) {
          throw new Error(`HTTP error! Status: ${courseRes.status}`);
        }
        const courseData = await courseRes.json();
        console.log("📚 หลักสูตรที่ลงทะเบียน:", courseData);
        setRegisteredCourses(courseData); // เก็บลง state

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

  const handleAddTrader = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!(e.target instanceof HTMLFormElement)) {
      console.error("Error: e.target is not a form.");
      return;
    }

    const form = e.target;
    const formData = new FormData(form);

    const startDate =
      (formData.get("start_date") as string) ||
      new Date().toISOString().split("T")[0]; // set default to today

    // ตรวจสอบให้แน่ใจว่า startDate เป็นวันที่ถูกต้อง
    const startDateObj = new Date(startDate);
    if (isNaN(startDateObj.getTime())) {
      console.error("Invalid start date:", startDate);
      window.alert("วันที่เริ่มต้นไม่ถูกต้อง");
      return;
    }

    // คำนวณ end_date จาก start_date โดยเพิ่ม 2 ปี
    const endDateObj = new Date(startDateObj);
    endDateObj.setFullYear(startDateObj.getFullYear() + 2);
    const endDate = endDateObj.toISOString().split("T")[0];

    const newTraderId = (traders.length + 1).toString();
    const newTrader = {
      trader_id: newTraderId,
      dealer_name: formData.get("dealer_name"),
      national_id: formData.get("national_id"),
      company_name: formData.get("company_name"),
      email: formData.get("email"),
      phone_number: formData.get("phone_number"),
      start_date: startDate,
      end_date: endDate,
      status: "กำลังใช้งาน",
    };

    if (
      !newTrader.dealer_name ||
      !newTrader.national_id ||
      !newTrader.company_name ||
      !newTrader.email ||
      !newTrader.phone_number
    ) {
      Swal.fire({
        title: "กรุณากรอกข้อมูลให้ครบถ้วน!",
        text: "กดปุ่มเพื่อทำต่อ",
        icon: "warning",
        confirmButtonText: "ยืนยัน",
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:8750/traders/addTrader", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTrader),
      });

      if (response.ok) {
        console.log("Trader added successfully");
        Swal.fire({
          title: "เพิ่มข้อมูลผู้ค้าตราสารหนี้สำเร็จ!",
          text: "กดปุ่มเพื่อเสร็จสิ้น",
          icon: "success",
          confirmButtonText: "ยืนยัน",
        });
        setShow(false);
        fetchAllTraders();
      } else {
        console.error("Failed to add trader");
        Swal.fire({
          title: "เพิ่มข้อมูลผู้ค้าตราสารหนี้ไม่สำเร็จ!",
          text: "กดปุ่มเพื่อเสร็จสิ้น",
          icon: "error",
          confirmButtonText: "ยืนยัน",
        });
      }
    } catch (error) {
      console.error("Error adding trader:", error);
    }
  };

  const handleDeleteTrader = (traderId: string) => {
    Swal.fire({
      title: "ยืนยันการลบออกจากรายการ?",
      text: "ข้อมูลจะยังคงอยู่ในระบบ แต่จะถูกซ่อนจากตารางนี้",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        setTraders((prevTraders) => {
          // ลบ trader ออกจากรายการ
          const updatedTraders = prevTraders.filter(
            (t) => t.trader_id !== traderId
          );

          // อัปเดต trader_id ใหม่ตามลำดับที่เหลือ
          const reorderedTraders = updatedTraders.map((trader, index) => ({
            ...trader,
            trader_id: `TRD-${String(index + 1).padStart(4, "0")}`, // trader_id เริ่มที่ 1 และเรียงลำดับใหม่
          }));

          return reorderedTraders;
        });

        Swal.fire("ลบสำเร็จ!", "ข้อมูลถูกลบออกจากตารางแล้ว", "success");
      }
    });
  };

  const handleCancel = () => {
    setShow(false);

    const form = document.getElementById("addTraderForm") as HTMLFormElement;
    if (form) {
      form.reset();
    }

    const startDateInput = document.getElementsByName(
      "start_date"
    )[0] as HTMLInputElement;
    if (startDateInput) {
      startDateInput.value = ""; // รีเซ็ตค่า start_date
    }
  };

  const handleEdit = async (traderId: string) => {
    console.log("🔹 handleSave ถูกเรียกใช้", traderId); // เช็คว่า function ทำงานไหม

    if (!traderId) {
      console.error("traderId เป็น undefined หรือ null");
      Swal.fire({
        title: "เกิดข้อผิดพลาด!",
        text: "ไม่พบรหัสผู้ค้า กรุณาลองใหม่",
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
      console.log("editTrader:", editTrader);
      console.log("Trader ID ที่ส่งไป:", traderId);
      const response = await fetch(
        `http://localhost:8750/traders/${traderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editTrader),
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
          title: "บันทึกข้อมูลสำเร็จ!",
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
        setSelectedTrader(editTrader); // อัปเดตข้อมูลใน State หลัก
        setShowEditModal(false); // ปิด Modal
      } else if (
        !editTrader?.dealer_name ||
        !editTrader?.national_id ||
        !editTrader?.email ||
        !editTrader?.phone_number
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
      console.error("Error updating trader:", error);
      Swal.fire({
        title: "เกิดข้อผิดพลาดในการบันทึก!",
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
  };

  const fetchAllTraders = async () => {
    try {
      const response = await fetch("http://localhost:8750/traders/getList");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log("✅ ข้อมูลทั้งหมด:", result);
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

  const handleSearch = async () => {
    if (!searchId) {
      Swal.fire({
        title: "กรุณากรอก Trader ID!",
        text: "โปรดระบุ Trader ID ที่ต้องการค้นหา",
        icon: "warning",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    try {
      const response = await fetch(`http://localhost:8750/traders/${searchId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("✅ ค้นหาสำเร็จ:", result);

      if (result.status === "Success") {
        setTraders([result.data]); // แสดงเฉพาะข้อมูลที่ค้นหา
      } else {
        setTraders([]);
        Swal.fire({
          title: "ไม่พบข้อมูล!",
          text: "Trader ID นี้ไม่มีอยู่ในระบบ",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาด:", error);
      setTraders([]); // ล้างข้อมูลเพื่อไม่ให้แสดงผลผิดพลาด
      Swal.fire({
        title: "เกิดข้อผิดพลาด!",
        text: "ไม่สามารถค้นหาข้อมูลได้",
        icon: "error",
      });
    }
  };

  const handleClearSearch = () => {
    setSearchId(""); // ล้างค่าช่องค้นหา
    fetchAllTraders(); // โหลดข้อมูลทั้งหมดกลับมา
  };

  useEffect(() => {
    // fetchTraders();
    fetchAllTraders();
  }, []);

  useEffect(() => {
    console.log("🔄 selectedTrader อัปเดต:", selectedTrader);
    if (selectedTrader) {
      setEditTrader({ ...selectedTrader }); // Clone object เพื่อแก้ไข
    }
  }, [selectedTrader]);

  useEffect(() => {
    console.log("🔄 showEditModal อัปเดต:", showEditModal);
  }, [showEditModal]);

  return (
    <div className="trader-warrapper">
      <Navbar />
      <div className="trader-container">
        <div className="trader-header">
          <h2 className="text-header">ข้อมูลผู้ค้าตราสารหนี้</h2>
        </div>
        <div className="trader-table-wrapper">
          <div className="trader-table-container-wrapper">
            <div className="trader-table-container-search">
              <div className="trader-table-container-search-input">
                <i
                  className="bi bi-search"
                  onClick={() => {
                    handleSearch();
                  }}
                ></i>
                <input
                  type="text"
                  placeholder="ค้นหารหัสผู้ค้าตราสารหนี้"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                />
              </div>
              <div className="trader-table-container-button-clear">
                <button
                  className="btn"
                  onClick={() => {
                    handleClearSearch();
                  }}
                >
                  ล้าง
                </button>
              </div>
            </div>

            <div className="trader-table-container-button">
              <button
                type="button"
                className="btn btn-outline-success"
                onClick={() => {
                  handleShow();
                }}
              >
                เพิ่มผู้ค้าตราสารหนี้
              </button>
            </div>
          </div>
          <table className="trader-table-container">
            <thead className="trader-table-header">
              <tr className="trader-table-row">
                <th className="trader-table-row-th">รหัสผู้ค้าตราสารหนี้</th>
                <th className="trader-table-row-th">บริษัทที่สังกัด</th>
                <th className="trader-table-row-th">ชื่อผู้ค้าตราสารหนี้</th>
                <th className="trader-table-row-th">สถานะ</th>
                <th className="trader-table-row-th">เพิ่มเติม</th>
              </tr>
            </thead>
            <tbody className="trader-table-body">
              {traders.length > 0 ? (
                traders.map((trader) => (
                  <tr key={trader.trader_id} className="trader-table-column">
                    <td className="trader-table-column-td">
                      {trader.trader_id}
                    </td>
                    <td className="trader-table-column-td">
                      {trader.company_name}
                    </td>
                    <td className="trader-table-column-td">
                      {trader.dealer_name}
                    </td>
                    <td
                      className="trader-table-column-td"
                      style={{
                        color:
                          trader.status === "กำลังใช้งาน"
                            ? "green"
                            : trader.status === "หมดอายุการใช้งาน"
                            ? "red"
                            : "gray",
                      }}
                    >
                      {trader.status}
                    </td>
                    <td className="trader-table-column-td">
                      <a
                        className="trader-table-column-link-edit "
                        onClick={() => {
                          openModal(trader.trader_id);
                        }}
                      >
                        ดูเพิ่มเติม
                      </a>
                      <span className="trader-table-column-spacer">|</span>
                      <a
                        className="trader-table-column-link-delete "
                        onClick={() => handleDeleteTrader(trader.trader_id)}
                      >
                        ลบ
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="trader-table-column-td">
                    ไม่มีข้อมูล
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* {เพิ่มผู้ค้าตราสารหนี้} */}
          <Modal
            show={show}
            onHide={handleCancel}
            className="addtrader-modal"
            style={{ fontFamily: "Noto Sans Thai" }}
          >
            <Modal.Header>
              <Modal.Title>เพิ่มข้อมูลผู้ค้าตราสารหนี้</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form id="addTraderForm" onSubmit={handleAddTrader} method="POST">
                <div className="form-group">
                  <label>รหัสผู้ค้าตราสารหนี้</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newTraderId}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label>ชื่อผู้ค้าตราสารหนี้</label>
                  <input
                    type="text"
                    name="dealer_name"
                    className="form-control"
                    placeholder="ชื่อผู้ค้าตราสารหนี้"
                  />
                </div>
                <div className="form-group">
                  <label>เลขที่บัตรประชาชน</label>
                  <input
                    type="text"
                    name="national_id"
                    className="form-control"
                    placeholder="เลขที่บัตรประชาชน"
                  />
                </div>
                <div className="form-group">
                  <label>บริษัทที่สังกัด</label>
                  <input
                    type="text"
                    name="company_name"
                    className="form-control"
                    placeholder="บริษัทที่สังกัด"
                  />
                </div>
                <div className="form-group">
                  <label>อีเมล</label>
                  <input
                    type="text"
                    name="email"
                    className="form-control"
                    placeholder="อีเมล"
                  />
                </div>
                <div className="form-group">
                  <label>หมายเลขโทรศัพท์</label>
                  <input
                    type="text"
                    name="phone_number"
                    className="form-control"
                    placeholder="หมายเลขโทรศัพท์"
                  />
                </div>
                <div className="form-group">
                  <label>วันที่เริ่มต้นสถานะผู้ค้าตราสารหนี้</label>
                  <input
                    type="date"
                    name="start_date"
                    className="form-control"
                    value={new Date().toISOString().split("T")[0]} // กำหนดให้เป็นวันปัจจุบัน
                    disabled
                  />
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

          {/* แก้ไขข้อมูลผู้ค้าตราสารหนี้/ดูข้อมูลผู้ค้าตราสารหนี้ */}
          <Modal
            key={selectedTrader?.trader_id || Math.random()}
            // key={forceRender}
            show={showModal}
            // fullscreen={fullscreen.toString()}
            onHide={() => setShowModal(false)}
            style={{ fontFamily: "Noto Sans Thai" }}
            className="custom-modal"
          >
            <Modal.Header>
              <Modal.Title id="contained-modal-title-vcenter">
                {isEditing
                  ? "แก้ไขข้อมูลผู้ค้าตราสารหนี้"
                  : "ข้อมูลผู้ค้าตราสารหนี้"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form>
                <p>
                  <strong>รหัสผู้ค้าตราสารหนี้ :</strong>
                  {isEditing ? (
                    <input
                      type="text"
                      className="form-control"
                      value={editTrader?.trader_id || ""}
                      onChange={(e) =>
                        setEditTrader({
                          ...(editTrader as Trader),
                          trader_id: e.target.value,
                        })
                      }
                      readOnly
                    />
                  ) : (
                    <span>{selectedTrader?.trader_id || "ไม่พบข้อมูล"}</span>
                  )}
                </p>

                <p>
                  <strong>ชื่อ - นามสกุล :</strong>
                  {isEditing ? (
                    <input
                      type="text"
                      className="form-control"
                      value={editTrader?.dealer_name || ""}
                      onChange={(e) =>
                        setEditTrader({
                          ...(editTrader as Trader),
                          dealer_name: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <span>{selectedTrader?.dealer_name || "ไม่พบข้อมูล"}</span>
                  )}
                </p>
                <p>
                  <strong>เลขที่บัตรประชาชน :</strong>{" "}
                  {isEditing ? (
                    <input
                      type="text"
                      className="form-control"
                      value={editTrader?.national_id || ""}
                      onChange={(e) =>
                        setEditTrader({
                          ...(editTrader as Trader),
                          national_id: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <span>{selectedTrader?.national_id || "ไม่พบข้อมูล"}</span>
                  )}
                </p>
                <p>
                  <strong>อีเมล :</strong>{" "}
                  {isEditing ? (
                    <input
                      type="text"
                      className="form-control"
                      value={editTrader?.email || ""}
                      onChange={(e) =>
                        setEditTrader({
                          ...(editTrader as Trader),
                          email: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <span>{selectedTrader?.email || "ไม่พบข้อมูล"}</span>
                  )}
                </p>
                <p>
                  <strong>หมายเลขโทรศัพท์ :</strong>{" "}
                  {isEditing ? (
                    <input
                      type="text"
                      className="form-control"
                      value={editTrader?.phone_number || ""}
                      onChange={(e) =>
                        setEditTrader({
                          ...(editTrader as Trader),
                          phone_number: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <span>{selectedTrader?.phone_number || "ไม่พบข้อมูล"}</span>
                  )}
                </p>
                <p>
                  <strong>วันที่เริ่มต้นสถานะผู้ค้าตราสารหนี้ :</strong>{" "}
                  {selectedTrader?.start_date
                    ? selectedTrader.start_date.split("T")[0]
                    : " ไม่พบข้อมูล"}
                </p>
                <p>
                  <strong>วันที่สิ้นสุดสถานะผู้ค้าตราสารหนี้ :</strong>{" "}
                  {selectedTrader?.end_date
                    ? selectedTrader.end_date.split("T")[0]
                    : " ไม่พบข้อมูล"}
                </p>
                <p>
                  <strong>ข้อมูลการอบรมหลักสูตรของผู้ค้าตราสารหนี้ :</strong>
                </p>
                <ul>
                  {registeredCourses.length > 0 ? (
                    registeredCourses.map((course, index) => (
                      <li key={index}>
                        <p>วันที่อบรม: {course.course_date.split('T')[0]}</p>
                        <p>ชื่อหลักสูตร: {course.course_name}</p>
                        <p>สถานที่อบรม: {course.course_place}</p>
                        <p>จำนวนชั่วโมง: {course.course_hour}</p>
                        <p>สถานะ: {course.status}</p>
                        <hr />
                      </li>
                    ))
                  ) : (
                    <li>ไม่พบข้อมูล</li>
                  )}
                </ul>
              </form>
            </Modal.Body>

            <Modal.Footer>
              {isEditing ? (
                <>
                  <button
                    className="btn btn-success"
                    onClick={() => {
                      console.log("🔹 ปุ่มถูกกด! เรียก handleSave");
                      handleEdit(editTrader?.trader_id ?? "");
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
      </div>
    </div>
  );
};

export default Trader;
