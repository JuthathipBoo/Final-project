"use client";

import "./page.css";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useState } from "react";
import Swal from "sweetalert2";

const Login = () => {
  const [admin_email, setAdminEmail] = useState("");
  const [admin_cardId, setAdmin_CardId] = useState("");

  const handleLogin = async () => {
      try {
        const response = await fetch("http://localhost:8750/loginAdmin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ admin_email: admin_email, admin_cardId: admin_cardId }),
        });
    
        const data = await response.json();
    
        console.log("🔹 Response จาก API:", data); 
    
        if (!response.ok) {
          alert(data.message);
          return;
        }
    
        localStorage.setItem("tokenAdmin", data.token);

    
        if (data.admin) {
          localStorage.setItem("admin", JSON.stringify(data.admin));
          console.log("Admin เก็บใน LocalStorage:", data.admin);
        } else {
          console.warn("Admin เป็น null หรือไม่ได้ถูกส่งมา!");
        }
    
        Swal.fire({
          title: "เข้าสู่ระบบสำเร็จ!",
          text: "กดปุ่มเพื่อเสร็จสิ้น",
          icon: "success",
          confirmButtonText: "ยืนยัน",
        });
    
        window.location.href = "/admin/dashboard";
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
          <span>ผู้ดูแลระบบ</span>
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
                value={admin_email}
                onChange={(e) => setAdminEmail(e.target.value)}
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
                value={admin_cardId}
                onChange={(e) => setAdmin_CardId(e.target.value)}
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

export default Login;
