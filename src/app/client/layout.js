'use client'; // Required for client-side interactivity

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import styles from './App.module.css';

export default function App({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`${styles.appContainer} ${isDarkMode ? 'dark' : ''}`}>
      <div className={styles.layoutWrapper}>
        <Sidebar 
          isOpen={isSidebarOpen} 
          setIsOpen={setIsSidebarOpen}
          className={isSidebarOpen ? styles.sidebarExpanded : styles.sidebarCollapsed}
        />
        <div className={styles.contentWrapper}>
          <Navbar 
            toggleTheme={toggleTheme} 
            isDarkMode={isDarkMode}
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
          <main className="flex-1 overflow-y-auto p-4">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}