"use client";

import "./page.css";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useState } from "react";
import Swal from "sweetalert2";

const LoginTrader = () => {
  const [email, setEmail] = useState("");
    const [national_id, setnational_id] = useState("");
  
  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8750/loginTrader/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, national_id }),
      });
  
      const data = await response.json();
  
      console.log("🔹 Response จาก API:", data); 
  
      if (!response.ok) {
        alert(data.message);
        return;
      }
  
      localStorage.setItem("tokenTrader", data.token);
  
      if (data.trader) {
        localStorage.setItem("trader", JSON.stringify(data.trader));
        console.log("Trader เก็บใน LocalStorage:", data.trader);
      } else {
        console.warn("Trader เป็น null หรือไม่ได้ถูกส่งมา!");
      }
  
      Swal.fire({
        title: "เข้าสู่ระบบสำเร็จ!",
        text: "กดปุ่มเพื่อเสร็จสิ้น",
        icon: "success",
        confirmButtonText: "ยืนยัน",
      });
  
      window.location.href = "/traders/dashboard";
    } catch (error) {
      console.error("🚨 Error:", error);
      Swal.fire({
        title: "เข้าสู่ระบบผิดพลาด!",
        text: "กดปุ่มเพื่อเสร็จสิ้น",
        icon: "warning",
        confirmButtonText: "ยืนยัน",
      });
    }
  };
  
  
  
  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="header">
          <h1>EasyBond</h1>
          <p>ยินดีต้อนรับสู่ EasyBond</p>
          <span>ผู้ค้าตราสารหนี้</span>
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="input-group">
            <label>อีเมล</label>
            <div className="input-wrapper">
              <i className="bi bi-person"></i>
              <input
                type="email"
                id="email"
                placeholder="กรุณากรอกอีเมลของคุณ"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="input-group">
            <label>รหัสผ่าน</label>
            <div className="input-wrapper">
              <i className="bi bi-lock"></i>
              <input
                type="password"
                id="password"
                placeholder="กรุณากรอกรหัสผ่านของคุณ"
                value={national_id}
                onChange={(e) => setnational_id(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <button type="button" className="btn-primary" onClick={handleLogin}>
              เข้าสู่ระบบ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginTrader;
