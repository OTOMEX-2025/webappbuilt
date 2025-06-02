'use client';

import {HelpCircle, Moon, Sun, Menu } from 'lucide-react';
import { useTheme } from 'next-themes';
 import styles from '../styles/Navbar.module.css';

export default function Navbar({ toggleSidebar }) {
  const { theme, setTheme } = useTheme();

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.navContent}>
          <div className={styles.navLeft}>
           
            
          </div>
          <div className={styles.navRight}>
            <button
              className={styles.navButton}
              aria-label="Help"
            >
              <HelpCircle size={24} />
            </button>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={styles.navButton}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}