'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation'; // Import usePathname
import styles from './Navbar.module.css';
import Link from 'next/link';
import Sidebar from './Sidebar';

export default function Navbar() {
  const pathname = usePathname(); // Get current route

  // Hide navbar on '/', '/login', and '/register'
  if (pathname === '/' || pathname === '/auth/login' || pathname === '/auth/register' || pathname === '/auth') {
    return null;
  }

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const isSmall = window.innerWidth < 768;
      setIsMobile(isSmall);
      setShowSidebar(!isSmall);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.logo}>🧠 MindPal</div>

        {!isMobile && (
          <div className={styles.links}>
            <Link className={styles.link} href="/chatbot">Chatbot</Link>
            <Link className={styles.link} href="/dashboard">Dashboard</Link>
            <Link className={styles.link} href="/games">Games</Link>
            <Link className={styles.link} href="/8dmusic">8D Music</Link>
          </div>
        )}

        {isMobile && (
          <div
            className={styles.menuIcon}
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          >
            ☰
          </div>
        )}

        {isMobileMenuOpen && isMobile && (
          <div className={styles.dropdown}>
            <Link className={styles.link} href="/chatbot">Chatbot</Link>
            <Link className={styles.link} href="/dashboard">Dashboard</Link>
            <Link className={styles.link} href="/games">Games</Link>
            <Link className={styles.link} href="/8dmusic">8D Music</Link>
          </div>
        )}
      </nav>

      {/* {!isMobile && <Sidebar isOpen={showSidebar} />} */}
    </>
  );
}
