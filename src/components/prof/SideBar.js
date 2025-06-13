"use client"

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  RiDashboardLine, 
  RiUserLine, 
  RiTimeLine, 
  RiAlertLine, 
  RiBarChartLine,
  RiMenuLine,
  RiCloseLine
} from '@remixicon/react';
import styles from '../../styles/prof/SideBar.module.css';
import { useTheme } from '../../context/ThemeContext';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const { theme } = useTheme();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsOpen]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { name: 'Dashboard', path: '/prof/dashboard', icon: <RiDashboardLine size={20} /> },
    { name: 'Profiles', path: '/prof/profiles', icon: <RiUserLine size={20} /> },
    { name: 'Sessions', path: '/prof/sessions', icon: <RiTimeLine size={20} /> },
    { name: 'Emergencies', path: '/prof/emergencies', icon: <RiAlertLine size={20} /> },
    { name: 'Analysis', path: '/prof/analysis', icon: <RiBarChartLine size={20} /> },
  ];

  return (
    <>
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className={`${styles.mobileToggle} ${theme === 'dark' ? styles.dark : ''}`}
          aria-label="Toggle sidebar"
        >
          {isOpen ? <RiCloseLine size={24} /> : <RiMenuLine size={24} />}
        </button>
      )}

      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''} ${theme === 'dark' ? styles.dark : ''}`}>
        <div className={styles.header}>
          <h1 className={styles.title}>Logo</h1>
        </div>
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {navItems.map((item) => (
              <li key={item.name} className={styles.navItem}>
                <Link
                  href={item.path}
                  className={`${styles.navLink} ${
                    pathname === item.path ? styles.navLinkActive : ''
                  } ${theme === 'dark' ? styles.dark : ''}`}
                >
                  <span className={styles.icon}>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;