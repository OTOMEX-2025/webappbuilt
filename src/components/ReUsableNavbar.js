"use client";
import { HelpCircle, Moon, Sun, Menu, User, Settings, LogOut } from "lucide-react";
import Image from "next/image";
import { useTheme } from "../context/ThemeContext";
import styles from "../styles/Navbar.module.css";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useUser } from "../context/UserContext";

const ReUsableNavbar = ({ 
  onMenuToggle,
  pageTitle,
  showHelp = true,
  showProfile = true,
  customLogo = "/MindPalLogo-removebg-preview.png",
  logoWidth = 120,
  logoHeight = 30,
  isSidebarOpen
}) => {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout, loading } = useUser();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get page title from pathname if not provided
  const currentPageTitle = pageTitle || 
    pathname.split('/').pop().charAt(0).toUpperCase() + 
    pathname.split('/').pop().slice(1);

  const getUserDisplay = () => {
  if (!user) return "Profile";
  
  // Use fullName if available, otherwise fall back to email or generic text
  const displayName = user.fullName || user.email?.split('@')[0] || 'User';
  
  switch(user.userType) {
    case 'professional':
      return `${displayName}'s Professional Profile`;
    case 'client':
      return `${displayName}'s Profile`;
    default:
      return `${displayName}'s Admin Profile`;
  }
};

  const getProfileSettingsPath = () => {
    if (pathname.startsWith('/client')) {
      return '/client/profile/settings';
    } else if (pathname.startsWith('/prof')) {
      return '/prof/profile/settings';
    }
    return '/profile/settings';
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  return (
    <nav className={`${styles.navbar} ${
      theme === 'dark' ? styles.dark : styles.light
    } ${
      !isSidebarOpen ? styles.sidebarClosed : ''
    }`}>
      <div className={styles.container}>
        <div className={styles.navContent}>
          <div className={styles.navLeft}>
            <button 
              className={styles.navButton}  
              onClick={onMenuToggle}
              aria-label="Toggle menu"
            >
              <Menu size={20} />
            </button>
            <div className={styles.logo}>
              <Image
                src={customLogo}
                alt="Company Logo"
                width={logoWidth}
                height={logoHeight}
                priority
              />
            </div>
          </div>

          <div className={styles.pageTitleCenter}>
            {currentPageTitle}
          </div>

          <div className={styles.navRight}>
            {showHelp && (
              <button className={styles.navButton} aria-label="Help">
                <HelpCircle size={20} />
              </button>
            )}
            
            <button
              onClick={toggleTheme}
              className={`${styles.navButton} ${styles.themeToggle}`}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {showProfile && (
              <div className={styles.profileSection} ref={dropdownRef}>
                <div 
                  className={styles.profileTrigger} 
                  onClick={toggleDropdown}
                  aria-label="Profile menu"
                >
                  <User size={18} className={styles.profileIcon} />
                  <span className={styles.profileText}>
                    {getUserDisplay()}
                  </span>
                </div>
                
                {isDropdownOpen && (
                  <div className={`${styles.profileDropdown} ${
                    theme === 'dark' ? styles.dropdownDark : styles.dropdownLight
                  }`}>
                    <Link 
                      href={getProfileSettingsPath()} 
                      className={styles.dropdownItem}
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Settings size={16} className={styles.dropdownIcon} />
                      <span>Profile Settings</span>
                    </Link>
                    <button 
                      className={styles.dropdownItem}
                      onClick={handleLogout}
                    >
                      <LogOut size={16} className={styles.dropdownIcon} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
export default ReUsableNavbar;