"use client";
import { useTheme } from "../../context/ThemeContext";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import styles from "./Client.module.css";

export default function ClientLayout({ children }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className={`${styles.appRoot} ${
        theme === "dark" ? styles.dark : styles.light
      }`}
    >
      <div className={styles.layoutContainer}>
        <div className={styles.sidebarContainer}>
          <Sidebar />
        </div>
        <div className={styles.mainArea}>
          <div className={styles.navbarContainer}>
            <Navbar onToggleTheme={toggleTheme} theme={theme} />
          </div>
          <main className={styles.content}>{children}</main>
        </div>
      </div>
    </div>
  );
}