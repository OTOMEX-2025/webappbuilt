import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Brain,
  Home,
  MessageSquareMore,
  Video,
  Newspaper,
  Music,
  Gamepad2,
  X,
  Moon,
  Sun,
} from "lucide-react";
import styles from "../styles/Sidebar.module.css";
import Image from 'next/image';
import { useTheme } from "../context/ThemeContext"; // Adjust the path as needed

const Sidebar = ({ isOpen, setIsOpen }) => {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  
  const menuItems = [
    { icon: Home, label: 'Home', path: '/client/dashboard' }, 
    { icon: MessageSquareMore, label: 'AI Chat', path: '/client/chat' },
    { icon: Video, label: 'Meetings', path: '/client/meetings' },
    { icon: Newspaper, label: 'News & Articles', path: '/client/news' },
    { icon: Music, label: '8D Music', path: '/client/music' },
    { icon: Gamepad2, label: 'Games', path: '/client/games' },
  ];

  return (
    <>
      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`} data-theme={theme}>
        <div className={styles.container}>
          <div className={styles.menuContainer}>
            <div className={styles.logo}>
              <Image
                src="/WhatsApp_Image_2025-03-18_at_12.19.57-removebg-preview.png"
                alt="Your Logo"
                width={150}
                height={150}
                priority
              />
            </div>
            {menuItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
                className={`${styles.menuItem} ${
                  pathname === item.path ? styles.activeMenuItem : ""
                }`}
              >
                <item.icon className={styles.menuIcon} />
                <span className={styles.menuLabel}>{item.label}</span>
              </Link>
            ))}
            <button onClick={toggleTheme} className={styles.themeToggle}>
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              <span className={styles.menuLabel}>Toggle Theme</span>
            </button>
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

export default Sidebar;