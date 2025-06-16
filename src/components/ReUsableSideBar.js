"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "../styles/Sidebar.module.css";
import Image from 'next/image';
import { useTheme } from "../context/ThemeContext";

const ReUsableSideBar = ({ 
  isOpen, 
  setIsOpen, 
  logo,
  menuItems,
  logoWidth = 150,
  logoHeight = 150
}) => {
  const pathname = usePathname();
  const { theme } = useTheme();
  
  return (
    <>
      <aside 
        className={`${styles.sidebar} ${
          isOpen ? styles.sidebarOpen : styles.sidebarClosed
        }`} 
        data-theme={theme}
      >
        <div className={styles.container}>
          <div className={styles.logo}>
            <Image
              src={logo}
              alt="Logo"
              width={logoWidth}
              height={logoHeight}
              priority
            />
          </div>
          <div className={styles.menuContainer}>
            {menuItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
                className={`${styles.menuItem} ${
                  pathname === item.path ? styles.activeMenuItem : ""
                }`}
              >
                <span className={styles.menuIcon}>
                  {typeof item.icon === 'function' ? (
                    <item.icon size={20} />
                  ) : (
                    item.icon
                  )}
                </span>
                <span className={styles.menuLabel}>{item.label || item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </aside>
      {/* Add padding to main content when sidebar is open on desktop */}
      {isOpen && (
        <style jsx global>{`
          @media (min-width: 769px) {
            .main-content {
              margin-left: 220px;
            }
          }
        `}</style>
      )}
    </>
  );
};

export default ReUsableSideBar;