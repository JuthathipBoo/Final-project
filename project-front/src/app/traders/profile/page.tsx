"use client";

import NavbarTrader from "@/app/components/NavbarTrader/NavbarTrader";
import "./page.css";
import { useEffect, useState } from "react";

const Profile = () => {
  interface Trader {
    trader_id: string;
    company_name: string;
    dealer_name: string;
    national_id: string;
    email: string;
    phone_number: string;
    start_date: string;
    end_date: string;
    training_info: {
      training_date: string;
      training_course_name: string;
      training_location: string;
      training_hour: number;
    };
    status: string;
  }
  const [trader, setTrader] = useState<Trader>();

  useEffect(() => {
    try {
      const storedTrader = localStorage.getItem("trader");

      // 🔹 ตรวจสอบว่ามีค่าหรือไม่ ก่อน JSON.parse()
      if (storedTrader) {
        setTrader(JSON.parse(storedTrader));
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการอ่านข้อมูล trader:", error);
    }
  }, []);

  if (!trader) {
    return (
      <div className="profile-wrapper-error">
        <NavbarTrader />
        <div className="profile-container">
        <div className="profile-container-title">
          <h2 className="text-header">ยังไม่ได้เข้าสู่ระบบ หรือไม่มีข้อมูล</h2>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-wrapper">
      <NavbarTrader />
      <div className="profile-container">
        <div className="profile-container-title">
          <h2 className="text-header">ข้อมูลบัญชีของฉัน</h2>
        </div>
        <div className="profile-details">
          <div>
            <p><strong>Trader ID:</strong> {trader.trader_id}</p>
            <p><strong>บริษัท:</strong> {trader.company_name}</p>
            <p><strong>ชื่อผู้ค้า:</strong> {trader.dealer_name}</p>
            <p><strong>เลขบัตรประชาชน:</strong> {trader.national_id}</p>
            <p><strong>Email:</strong> {trader.email}</p>
            <p><strong>เบอร์โทร:</strong> {trader.phone_number}</p>
            <p><strong>วันที่เริ่มต้น:</strong> {new Date(trader.start_date).toLocaleDateString()}</p>
            <p><strong>วันที่สิ้นสุด:</strong> {new Date(trader.end_date).toLocaleDateString()}</p>
            <p><strong>สถานะ:</strong> {trader.status}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Profile;
