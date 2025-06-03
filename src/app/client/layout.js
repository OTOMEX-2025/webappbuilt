"use client";
import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import styles from "./Client.module.css";

export default function ClientLayout({ children }) {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div
      className={`${styles.appRoot} ${
        theme === "dark" ? styles.dark : styles.light
      }`}
    >
      <div
        className={`${styles.sidebar} ${
          theme === "dark" ? styles.sidebarDark : styles.sidebarLight
        }`}
      >
        <Sidebar />
      </div>
      <div className={styles.contentArea}>
        <div
          className={`${styles.navbar} ${
            theme === "dark" ? styles.navbarDark : styles.navbarLight
          }`}
        >
          <Navbar onToggleTheme={toggleTheme} theme={theme} />
        </div>
        <main className={styles.mainContent}>{children}</main>
      </div>
    </div>
  );
}
