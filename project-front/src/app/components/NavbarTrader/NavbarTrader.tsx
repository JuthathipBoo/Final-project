"use client";

import "./NavbarTrader.css";
import React from "react";
import Link from "next/link";
import Dropdown from "react-bootstrap/Dropdown";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Image from "next/image";
import img_proflie from "../../../../public/image/Group 1.png";
import { useState } from "react";

function NavbarTrader() {
  const [show, setShow] = useState(false);
  return (
    <nav className="navbar">
      <div className="container">
        {/* Logo */}
        <span className="logo">EasyBond</span>

        {/* Navigation Links */}
        <div className="nav-links nav-underline">
          <Link href="/traders/dashboard" className="nav-item">
            หน้าหลัก
          </Link>
          <Link href="/traders/trainingsCourse" className="nav-item">
            หลักสูตรอบรม
          </Link>
          <Link href="/traders/TrainingsRegis" className="nav-item">
            หลักสูตรที่ลงทะเบียน
          </Link>
          <Link href="/traders/TrainingHistory" className="nav-item">
            ประวัติการอบรม
          </Link>
        </div>
        
        <Dropdown
          className="dropdown"
          show={show}
          onToggle={(isOpen) => setShow(isOpen)}
        >
          <Image
            src={img_proflie}
            alt=""
            onClick={() => setShow(!show)}
            width={70}
            style={{ cursor: "pointer" }}
          />
          <Dropdown.Menu className="dropdown-menu">
            <Dropdown.Item href="/traders/profile">บัญชีของฉัน</Dropdown.Item>
            <Dropdown.Item href="#">ตั้งค่าบัญชี</Dropdown.Item>
            <Dropdown.Item href="#">ตั้งค่าการแจ้งเตือน</Dropdown.Item>
            <Dropdown.Item
              href="#"
              className="logout-btn"
              onClick={() => {
                localStorage.removeItem("tokenTrader");
                localStorage.removeItem("trader");
                localStorage.removeItem("registeredCourseDates")
                localStorage.removeItem("registeredCourseIds")
                window.location.href = "/LoginTrader";
              }}
            >
              ออกจากระบบ
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </nav>
  );
}

export default NavbarTrader;
