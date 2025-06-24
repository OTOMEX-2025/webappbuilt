"use client";
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from "../../context/ThemeContext";
import ReUsableSideBar from "../../components/ReUsableSideBar";
import ReUsableNavbar from "../../components/ReUsableNavbar";
import styles from "./Client.module.css";
import {
  Brain,
  Home,
  MessageSquareMore,
  Video,
  Newspaper,
  Music,
  Gamepad2,
  CreditCard, // Added for subscription icon
  X,
  Moon,
  Sun,
} from "lucide-react";

const menuItems = [
  { icon: <Home size={20} />, label: 'Home', path: '/client/dashboard' },
  { icon: <MessageSquareMore size={20} />, label: 'AI Chat', path: '/client/chat' },
  { icon: <Video size={20} />, label: 'Meetings', path: '/client/meetings' },
  { icon: <Newspaper size={20} />, label: 'News & Articles', path: '/client/news' },
  { icon: <Music size={20} />, label: '8D Music', path: '/client/music' },
  { icon: <Gamepad2 size={20} />, label: 'Games', path: '/client/games' },
  { 
    icon: <CreditCard size={20} />, 
    label: 'Subscription', 
    path: '/client/subscribe',
    className: "mt-auto" // This will push the item to the bottom
  },
];
const logo = "/MindPalLogo-removebg-preview.png";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { theme, toggleTheme } = useTheme();

  // Auto-close sidebar on mobile when route changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial state
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const currentPage = pathname.split('/').pop() || 'Dashboard';
  const formattedPageName = currentPage.charAt(0).toUpperCase() + currentPage.slice(1);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
     <div className={`${styles.appRoot} ${theme === "dark" ? styles.dark : styles.light}`}>
      <div className={styles.layoutContainer}>
        <ReUsableSideBar 
          isOpen={sidebarOpen} 
          setIsOpen={setSidebarOpen} 
          menuItems={menuItems} 
          logo={logo} 
        />
        <div className={styles.mainArea}>
          <ReUsableNavbar 
            onMenuToggle={toggleSidebar}
            onToggleTheme={toggleTheme}
            theme={theme}
            pageTitle={formattedPageName}
            isSidebarOpen={sidebarOpen} // Pass the sidebar state
          />
          <main className={`${styles.content} pt-16`}>{children}</main>
        </div>
      </div>
    </div>
  );
}