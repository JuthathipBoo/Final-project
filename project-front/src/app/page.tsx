"use client";

import "./page.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
// import Login from "./Login/page";
import Link from "next/link";

export default function Home() {
  return (
    // <div>
    //   <Login />
    // </div>
    <div className="container-card">
      <div className="card-container-admin">
        <div className="card" style={{ width: "18rem", height: "18rem" }}>
          <div className="card-body">
            <span>ผู้ดูแลระบบ</span>
            <Link href="/Login">
            <button>
              <i className="bi bi-person-gear" style={{ fontSize: "7rem" }}></i>
            </button>
            </Link>
           
          </div>
        </div>
      </div>
      <div className="card-container-trader">
        <div className="card" style={{ width: "18rem", height: "18rem" }}>
          <div className="card-body">
            <span>ผู้ค้าตราสารหนี้</span>
            <Link href="/LoginTrader">
            <button>
              <i
                className="bi bi-person-vcard"
                style={{ fontSize: "7rem" }}
              ></i>
            </button>
            </Link>
            
          </div>
        </div>
      </div>
    </div>
  );
}
