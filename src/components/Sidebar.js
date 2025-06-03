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
} from "lucide-react";
import styles from "../styles/Sidebar.module.css";
import Image from 'next/image';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const pathname = usePathname();
  const menuItems = [
    { icon: Home, label: "Home", path: "/client/home" },
    { icon: MessageSquareMore, label: "AI Chat", path: "/client/chat" },
    { icon: Video, label: "Meetings", path: "/client/meetings" },
    { icon: Newspaper, label: "News & Articles", path: "/client/news" },
    { icon: Music, label: "8D Music", path: "/client/music" },
    { icon: Gamepad2, label: "Games", path: "/client/games" },
  ];

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}>
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
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
