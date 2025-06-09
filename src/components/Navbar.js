"use client";

import { HelpCircle, Moon, Sun, Menu } from "lucide-react";
import Image from "next/image";
import { useTheme } from "../context/ThemeContext";
import styles from "../styles/Navbar.module.css";

export default function Navbar({ onMenuToggle }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className={`${styles.navbar} ${theme === 'dark' ? styles.dark : styles.light}`}>
      <div className={styles.container}>
        <div className={styles.navContent}>
          <div className={styles.navLeft}>
            <button 
              className={styles.navButton}  
              onClick={onMenuToggle}
              aria-label="Toggle menu"
            >
              <Menu size={20} />
            </button>
            <div className={styles.logo}>
              <Image
                src="/logo.png"
                alt="Company Logo"
                width={120}
                height={30}
                priority
              />
            </div>
          </div>
          <div className={styles.navRight}>
            <button className={styles.navButton} aria-label="Help">
              <HelpCircle size={20} />
            </button>
            <button
              onClick={toggleTheme}
              className={`${styles.navButton} ${styles.themeToggle}`}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}