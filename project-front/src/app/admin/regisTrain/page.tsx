"use client";

import "./page.css";
import Navbar from "../../components/Navbar/Navbar";
import { useEffect, useState } from "react";

const RegisTrain = () => {
  interface Registration {
    _id: string;
    user_id: {
      trader_id: string;
      company_name: string;
      dealer_name: string;
      email: string;
      phone_number: string;
    };
    course: {
      course_name: string;
      course_id: string;
    };
    status: string;
    statusCourse: string;
    registered_at: string;
  }

  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [updatedIds, setUpdatedIds] = useState<string[]>([]);

  const fetchRegistrations = async () => {
    try {
      const response = await fetch(
        "http://localhost:8750/training/registereds/list"
      );
      const result = await response.json();
      setRegistrations(result.data || []);
    } catch (err) {
      console.error("❌ Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const updateStatus = async (
    id: string,
    newStatus: "ยืนยันการลงทะเบียน" | "ไม่อนุมัติ"
  ) => {
    if (updatedIds.includes(id)) return; // ห้ามกดซ้ำ

    setUpdatingId(id); // ป้องกันระหว่างโหลด
    try {
      const response = await fetch(
        `http://localhost:8750/training/update/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        // อัปเดตหน้าให้เห็นทันที
        alert("อัปเดตสถานะสำเร็จ");

        // setRegistrations((prevRegistrations) =>
        //   prevRegistrations.map((reg) =>
        //     reg._id === id
        //       ? {
        //           ...reg,
        //           status: newStatus, // อัปเดตสถานะการลงทะเบียน
        //           statusCourse: newStatus === "ไม่อนุมัติ" ? "ไม่ผ่านการอบรม" : reg.statusCourse, // อัปเดตสถานะการอบรม
        //         }
        //       : reg
        //   )
        // );



        setUpdatedIds((prev) => [...prev, id]);
        fetchRegistrations();
      } else {
        alert("เกิดข้อผิดพลาด: " + result.message);
      }
    } catch (err) {
      console.error("❌ Update error:", err);
    } finally {
      setUpdatingId(null); // ไม่ว่าจะ success หรือ fail ก็ตั้งให้ว่าง
    }
  };

  const updateStatusAndCourse = async (
    id: string,
    newStatus: "ยืนยันการลงทะเบียน" | "ไม่อนุมัติ",
    newCourseStatus: "ยืนยันการอบรม" | "ไม่ผ่านการอบรม"
  ) => {
    if (updatedIds.includes(id)) return; // ห้ามกดซ้ำ
  
    setUpdatingId(id); // ป้องกันระหว่างโหลด
    try {
      // อัปเดตสถานะการลงทะเบียน
      const statusResponse = await fetch(
        `http://localhost:8750/training/update/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
  
      if (!statusResponse.ok) {
        throw new Error("เกิดข้อผิดพลาดในการอัปเดตสถานะการลงทะเบียน");
      }
  
      // อัปเดตสถานะการอบรม
      const courseStatusResponse = await fetch(
        `http://localhost:8750/training/updateCourse/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ statusCourse: newCourseStatus }),
        }
      );
  
      if (!courseStatusResponse.ok) {
        throw new Error("เกิดข้อผิดพลาดในการอัปเดตสถานะการอบรม");
      }
  
      // อัปเดตสถานะใน UI ทันที
      setRegistrations((prevRegistrations) =>
        prevRegistrations.map((reg) =>
          reg._id === id
            ? {
                ...reg,
                status: newStatus, // อัปเดตสถานะการลงทะเบียน
                statusCourse: newCourseStatus, // อัปเดตสถานะการอบรม
              }
            : reg
        )
      );
  
      setUpdatedIds((prev) => [...prev, id]);
      fetchRegistrations(); // รีเฟรชข้อมูลหลังจากอัปเดต
  
      alert("อัปเดตสถานะสำเร็จ");
    } catch (err) {
      console.error("❌ Update error:", err);
      alert("เกิดข้อผิดพลาดในการอัปเดตสถานะ");
    } finally {
      setUpdatingId(null); // ไม่ว่าจะ success หรือ fail ก็ตั้งให้ว่าง
    }
  };
  
  

  return (
    <div className="regisTrain-warrapper">
      <Navbar />
      <div className="regisTrain-container">
        <div className="regisTrain-header">
          <h2 className="text-header">การลงทะเบียนอบรม</h2>
        </div>
        <div className="regisTrain-table-wrapper">
          <div className="regisTrain-table-container-wrapper">
            <div className="regisTrain-table-container-search">
              <div className="regisTrain-table-container-search-input">
                <i className="bi bi-search"></i>
                <input type="text" placeholder="ค้นหาสถาานะการลงทะเบียน" />
              </div>
            </div>
          </div>
          <table className="regisTrain-table-container">
            <thead className="regisTrain-table-header">
              <tr className="regisTrain-table-row">
                <th className="regisTrain-table-row-th">
                  รหัสผู้ค้าตราสารหนี้
                </th>
                <th className="regisTrain-table-row-th">บริษัทที่สังกัด</th>
                <th className="regisTrain-table-row-th">
                  ชื่อผู้ค้าตราสารหนี้
                </th>
                <th className="regisTrain-table-row-th">หลักสูตรที่สมัคร</th>
                <th className="regisTrain-table-row-th">วันที่สมัคร</th>
                <th className="regisTrain-table-row-th">สถานะการลงทะเบียน</th>
                <th className="regisTrain-table-row-th">อนุมัติ / ปฎิเสธ</th>
              </tr>
            </thead>
            <tbody className="regisTrain-table-body">
              {registrations.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{ textAlign: "center", padding: "1rem" }}
                  >
                    ยังไม่มีข้อมูลการลงทะเบียน
                  </td>
                </tr>
              ) : (
                registrations.map((reg) => (
                  <tr className="regisTrain-table-column" key={reg._id}>
                    <td className="regisTrain-table-column-td">
                      {reg.user_id.trader_id}
                    </td>
                    <td className="regisTrain-table-column-td">
                      {reg.user_id.company_name}
                    </td>
                    <td className="regisTrain-table-column-td">
                      {reg.user_id.dealer_name || "-"}
                    </td>
                    <td className="regisTrain-table-column-td">
                      {reg.course?.course_name || reg.course?.course_id || "-"}
                    </td>
                    <td className="regisTrain-table-column-td">
                      {new Date(reg.registered_at).toLocaleDateString("th-TH")}
                    </td>
                    <td
                      className={`regisTrain-table-column-td ${
                        reg.status === "ยืนยันการลงทะเบียน"
                          ? "status-approved"
                          : reg.status === "ไม่อนุมัติ"
                          ? "status-rejected"
                          : "status-pending"
                      }`}
                    >
                      {reg.status}
                    </td>
                    <td className="regisTrain-table-column-td">
                      <a
                        className={`regisTrain-table-column-button-edit ${
                          updatingId === reg._id || updatedIds.includes(reg._id)
                            ? "disabled"
                            : ""
                        }`}
                        onClick={() =>
                          updatingId === null &&
                          !updatedIds.includes(reg._id) &&
                          updateStatus(reg._id, "ยืนยันการลงทะเบียน")
                        }
                      >
                        อนุมัติ
                      </a>
                      <span className="regisTrain-table-column-spacer">|</span>
                      <a
                        className={`regisTrain-table-column-button-delete ${
                          updatingId === reg._id || updatedIds.includes(reg._id)
                            ? "disabled"
                            : ""
                        }`}
                        onClick={() =>
                          updatingId === null &&
                          !updatedIds.includes(reg._id) &&
                          updateStatusAndCourse(reg._id, "ไม่อนุมัติ", "ไม่ผ่านการอบรม")

                        }
                      >
                        ปฏิเสธ
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RegisTrain;
