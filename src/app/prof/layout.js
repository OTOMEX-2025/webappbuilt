"use client"
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import ReUsableSideBar from '../../components/ReUsableSideBar';
import { useTheme } from "../../context/ThemeContext";
import ReUsableNavbar from '../../components/ReUsableNavbar';
import styles from './ProfLayout.module.css';

import { 
  RiDashboardLine, 
  RiUserLine, 
  RiTimeLine, 
  RiAlertLine, 
  RiBarChartLine
} from '@remixicon/react';

  const navItems = [
    { name: 'Dashboard', path: '/prof/dashboard', icon: <RiDashboardLine size={20} /> },
    { name: 'Profiles', path: '/prof/profiles', icon: <RiUserLine size={20} /> },
    { name: 'Sessions', path: '/prof/sessions', icon: <RiTimeLine size={20} /> },
    { name: 'Emergencies', path: '/prof/emergencies', icon: <RiAlertLine size={20} /> },
    { name: 'Analysis', path: '/prof/analysis', icon: <RiBarChartLine size={20} /> },
  ];
const logo = "/MindPalLogo-removebg-preview.png";

const ProfLayout = ({ children }) => {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { theme, toggleTheme } = useTheme();

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
            menuItems={navItems} 
            logo={logo} 
            />
            <div className={styles.mainArea}>
              <ReUsableNavbar 
              onMenuToggle={toggleSidebar} 
              onToggleTheme={toggleTheme} 
              theme={theme}
               userName="Therapist Profile"
              pageTitle={formattedPageName} 
            />
              <main className={`flex-1 overflow-y-scroll transition-all duration-300 ${
                        sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'
                      }`}>
                        <div className="  w-full">
                          {children}
                        </div>
                      </main>
            </div>
          </div>
        </div>
  );
};

export default ProfLayout;