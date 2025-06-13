"use client"

import { useState } from 'react';
import Sidebar from '../../components/prof/SideBar';
import Navbar from '../../components/prof/NavBar';
import styles from '../../styles/prof/ProfLayout.module.css';

const ProfLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={styles.container}>
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className={styles.contentWrapper}>
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <main className={`${styles.mainContent} ${sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default ProfLayout;