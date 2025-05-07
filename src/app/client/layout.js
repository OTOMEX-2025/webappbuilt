"use client";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

export default function ClientsLayout({ children }) {
  return (
    <div className="app">
      {/* <Navbar /> */}
      <div className="main-content">
        <Sidebar />
        <div className="content">{children}</div>
      </div>
    </div>
  );
}