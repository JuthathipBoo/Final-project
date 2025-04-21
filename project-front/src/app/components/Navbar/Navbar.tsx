"use client";

import "./Navbar.css";
import React from "react";
import Link from "next/link";
import Dropdown from "react-bootstrap/Dropdown";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Image from "next/image";
import img_proflie from "../../../../public/image/Group 1.png";
import { useState } from "react";

function Navbar() {
  const [show, setShow] = useState(false);
  // const admin = JSON.parse(localStorage.getItem("admin"));
  return (
    <nav className="navbar">
      <div className="container">
        {/* Logo */}
        <span className="logo">EasyBond</span>

        {/* Navigation Links */}
        <div className="nav-links nav-underline">
          <Link href="/admin/dashboard" className="nav-item">
            หน้าหลัก
          </Link>
          <Link href="/admin/traders" className="nav-item">
            ข้อมูลผู้ค้าตราสารหนี้
          </Link>
          <Link href="/admin/trainings" className="nav-item">
            หลักสูตรอบรม
          </Link>
          <Link href="/admin/regisTrain" className="nav-item">
            การลงทะเบียนอบรม
          </Link>
          <Link href="/admin/ComfirmTrain" className="nav-item">
            ตรวจสอบสถานะการอบรม
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
            <Dropdown.Item href="/admin/profileAdmin">บัญชีของฉัน</Dropdown.Item>
            <Dropdown.Item href="#">ตั้งค่าบัญชี</Dropdown.Item>
            <Dropdown.Item href="#">ตั้งค่าการแจ้งเตือน</Dropdown.Item>
            <Dropdown.Item
              href="#"
              className="logout-btn"
              onClick={() => {
                localStorage.removeItem("tokenAdmin");
                localStorage.removeItem("admin");
                window.location.href = "/Login";
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

export default Navbar;
