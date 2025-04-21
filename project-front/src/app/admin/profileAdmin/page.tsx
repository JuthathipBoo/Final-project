"use client";


import Navbar from "@/app/components/Navbar/Navbar";
import "./page.css";
import { useEffect, useState } from "react";

const Profile = () => {
  interface Admin {
    admin_id: string;
    admin_name: string;
    admin_email: string;
    admin_phone: string;
    admin_cardId: string;
    admin_createdAt: Date;
    admin_status: string;
  }

  const [admin, setAdmin] = useState<Admin>();

  useEffect(() => {
    try {
      const storedTrader = localStorage.getItem("admin");

      // 🔹 ตรวจสอบว่ามีค่าหรือไม่ ก่อน JSON.parse()
      if (storedTrader) {
        setAdmin(JSON.parse(storedTrader));
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการอ่านข้อมูล admin:", error);
    }
  }, []);

  if (!admin) {
    return (
      <div className="profile-wrapper-error">
        <Navbar />
        <div className="profile-container">
          <div className="profile-container-title">
            <h2 className="text-header">
              ยังไม่ได้เข้าสู่ระบบ หรือไม่มีข้อมูล
            </h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-wrapper">
      <Navbar />
      <div className="profile-container">
        <div className="profile-container-title">
          <h2 className="text-header">ข้อมูลบัญชีของฉัน</h2>
        </div>
        <div className="profile-details">
          <div>
            <p>
              <strong>Admin ID:</strong> {admin.admin_id}
            </p>
            <p>
              <strong>ชื่อผู้ดูแลระบบ:</strong> {admin.admin_name}
            </p>
            <p>
              <strong>เลขบัตรประชาชน:</strong> {admin.admin_cardId}
            </p>
            <p>
              <strong>Email:</strong> {admin.admin_email}
            </p>
            <p>
              <strong>เบอร์โทร:</strong> {admin.admin_phone}
            </p>
            <p>
              <strong>วันที่เริ่มต้น:</strong>
              {new Date(admin.admin_createdAt).toLocaleDateString()}
            </p>
            <p>
              <strong>สถานะ:</strong> {admin.admin_status}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;
