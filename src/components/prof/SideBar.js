"use client"

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from '../../styles/prof/SideBar.module.css';
import { useTheme } from '../../context/ThemeContext';

const Sidebar = ({ 
  isOpen, 
  setIsOpen, 
  navItems = [],
  logo = "Logo",
  logoComponent,
  width = "250px"
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const { theme } = useTheme();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <aside 
      className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : styles.sidebarClosed} ${theme === 'dark' ? styles.dark : ''}`}
      style={{ width }}
    >
      <div className={styles.header}>
        <h1 className={styles.title}>
          {logoComponent || logo}
        </h1>
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
                {item.icon && <span className={styles.icon}>{item.icon}</span>}
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;