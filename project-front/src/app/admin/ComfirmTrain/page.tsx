"use client";

import Navbar from "@/app/components/Navbar/Navbar";
import "./page.css";
import { useEffect, useState } from "react";
import { useCallback } from 'react';

const ComfirmTrain = () => {
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

  const updateStatusCourse = async (
    id: string,
    newStatus: "ยืนยันการผ่านอบรม" | "ไม่ผ่านการอบรม"
  ) => {
    if (updatedIds.includes(id)) return; // ห้ามกดซ้ำ

    setUpdatingId(id); // ป้องกันระหว่างโหลด
    try {
      const response = await fetch(
        `http://localhost:8750/training/updateCourse/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ statusCourse: newStatus }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        // อัปเดตหน้าให้เห็นทันที
        alert("อัปเดตสถานะสำเร็จ");
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
  // const fetchRegistrations = async () => {
  //   try {
  //     const response = await fetch(
  //       "http://localhost:8750/training/registereds/list"
  //     );
  //     const result = await response.json();

  //     const filtered = (result.data || []).filter(
  //       (reg: Registration) => reg.status === "ยืนยันการลงทะเบียน"
  //     );

  //     setRegistrations(filtered);
  //   } catch (err) {
  //     console.error("❌ Fetch error:", err);
  //   }
  // };
  
  const fetchRegistrations = useCallback(async () => {
    try {
      const response = await fetch(
        "http://localhost:8750/training/registereds/list"
      );
      const result = await response.json();
  
      const filtered = (result.data || []).filter(
        (reg: Registration) => reg.status === "ยืนยันการลงทะเบียน"
      );
  
      setRegistrations(filtered);
    } catch (err) {
      console.error("❌ Fetch error:", err);
    }
  }, [setRegistrations]);
  
  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);
  return (
    <div className="ComfirmTrain-wrapper">
      <Navbar />

      <div className="ComfirmTrain-container">
        <div className="ComfirmTrain-header">
          <h2 className="text-header">ตรวจสอบสถานะการอบรม</h2>
        </div>
        <div className="ComfirmTrain-table-wrapper">
          <div className="ComfirmTrain-table-container-wrapper">
            <div className="ComfirmTrain-table-container-search">
              <div className="ComfirmTrain-table-container-search-input">
                <i className="bi bi-search"></i>
                <input type="text" placeholder="ค้นหาสถาานะการอบรม" />
              </div>
            </div>
          </div>
          <table className="ComfirmTrain-table-container">
            <thead className="ComfirmTrain-table-header">
              <tr className="ComfirmTrain-table-row">
                <th className="ComfirmTrain-table-row-th">
                  รหัสผู้ค้าตราสารหนี้
                </th>
                <th className="ComfirmTrain-table-row-th">บริษัทที่สังกัด</th>
                <th className="ComfirmTrain-table-row-th">
                  ชื่อผู้ค้าตราสารหนี้
                </th>
                <th className="ComfirmTrain-table-row-th">หลักสูตรที่สมัคร</th>
                <th className="ComfirmTrain-table-row-th">สถานะการลงทะเบียน</th>
                <th className="ComfirmTrain-table-row-th">สถานะการอบรม</th>
                <th className="ComfirmTrain-table-row-th">ยืนยัน / ปฎิเสธ</th>
              </tr>
            </thead>
            <tbody className="ComfirmTrain-table-body">
              {registrations.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{ textAlign: "center", padding: "1rem" }}
                  >
                    ยังไม่มีข้อมูลการอบรม
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
                    <td
                      className={`regisTrain-table-column-td ${
                        reg.statusCourse === "ยืนยันการผ่านอบรม"
                          ? "status-approved"
                          : reg.statusCourse === "ไม่ผ่านการอบรม"
                          ? "status-rejected"
                          : "status-pending"
                      }`}
                    >
                      {reg.statusCourse}
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
                          updateStatusCourse(reg._id, "ยืนยันการผ่านอบรม")
                        }
                      >
                        ยืนยัน
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
                          updateStatusCourse(reg._id, "ไม่ผ่านการอบรม")
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

export default ComfirmTrain;
