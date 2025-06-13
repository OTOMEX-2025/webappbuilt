"use client"

import { usePathname } from 'next/navigation';
import { useTheme } from '../../context/ThemeContext';
import styles from '../../styles/prof/Navbar.module.css';
import { RiMenuLine, RiCloseLine } from '@remixicon/react';

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  // Extract current page name from pathname
  const currentPage = pathname.split('/').pop() || 'Dashboard';
  const formattedPageName = currentPage.charAt(0).toUpperCase() + currentPage.slice(1);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.container}>
        <button 
          onClick={toggleSidebar}
          className={styles.menuButton}
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <RiCloseLine size={20} /> : <RiMenuLine size={20} />}
        </button>
        
        <div className={styles.pageTitle}>
          {formattedPageName}
        </div>
        
        <div className={styles.actions}>
          <button 
            onClick={toggleTheme}
            className={styles.themeToggle}
            aria-label={`Toggle ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;