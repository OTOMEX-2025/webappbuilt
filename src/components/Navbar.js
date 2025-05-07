'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation'; // Import usePathname
// import styles from '../styles//Navbar.module.css';
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
  const router = useRouter();
  
  function handleLogout() {
    localStorage.removeItem("isLoggedIn");
    router.push("/");
  }
  return (
    <header className="navbar">
      <div className="logo">MindPal</div>
      <button onClick={handleLogout}>Logout</button>
    </header>
  );
}