"use client";

import { HelpCircle, Moon, Sun } from "lucide-react";
import styles from "../styles/Navbar.module.css";
import Image from "next/image";

export default function Navbar({ onToggleTheme, theme }) {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.navContent}>
          <div className={styles.navLeft}>
            <div className={styles.logo}>
              <Image
                src="/WhatsApp_Image_2025-03-18_at_12.19.57-removebg-preview.png"
                alt="Your Logo"
                width={150}
                height={150}
                priority
              />
            </div>
          </div>
          <div className={styles.navRight}>
            <button className={styles.navButton} aria-label="Help">
              <HelpCircle size={24} />
            </button>
            <button
              onClick={onToggleTheme}
              className={styles.navButton}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
