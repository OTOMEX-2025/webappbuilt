"use client"

import { useState } from 'react';
import Sidebar from '../../components/prof/SideBar';
import Navbar from '../../components/prof/NavBar';
import styles from '../../styles/prof/ProfLayout.module.css';

import { 
  RiDashboardLine, 
  RiUserLine, 
  RiTimeLine, 
  RiAlertLine, 
  RiBarChartLine
} from '@remixicon/react';


const ProfLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { name: 'Dashboard', path: '/prof/dashboard', icon: <RiDashboardLine size={20} /> },
    { name: 'Profiles', path: '/prof/profiles', icon: <RiUserLine size={20} /> },
    { name: 'Sessions', path: '/prof/sessions', icon: <RiTimeLine size={20} /> },
    { name: 'Emergencies', path: '/prof/emergencies', icon: <RiAlertLine size={20} /> },
    { name: 'Analysis', path: '/prof/analysis', icon: <RiBarChartLine size={20} /> },
  ];

  return (
    <div className={styles.container}>
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className={styles.contentWrapper}>
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} navItems={navItems} logo="Mind-Pal" width="16%" />
        <main className={`${styles.mainContent} ${sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default ProfLayout;