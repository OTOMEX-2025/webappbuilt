"use client";
import { HelpCircle, Moon, Sun, Menu, User, Settings, LogOut } from "lucide-react";
import Image from "next/image";
import { useTheme } from "../context/ThemeContext";
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

  const currentPageTitle = pageTitle || 
    pathname.split('/').pop().charAt(0).toUpperCase() + 
    pathname.split('/').pop().slice(1);

  const getUserDisplay = () => {
    if (!user) return "Profile";
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

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 h-16 z-10 flex items-center px-4 transition-all duration-300 ${
      theme === 'dark' ? 'bg-black border-b border-gray-700' : 'bg-white border-b border-gray-200'
    } ${
      isSidebarOpen ? 'lg:left-64' : 'lg:left-0'
    }`}>
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onMenuToggle}
            className={`p-2 rounded-full hover:bg-opacity-10 hover:bg-black ${
              theme === 'dark' ? 'text-white hover:bg-white' : 'text-gray-800 hover:bg-black'
            }`}
          >
            <Menu size={20} />
          </button>
          
          <div className="lg:hidden">
            <Image
              src={customLogo}
              alt="Company Logo"
              width={logoWidth}
              height={logoHeight}
              priority
              className="h-8 w-auto"
            />
          </div>
        </div>

        <div className="flex-1 text-center hidden lg:block">
          <h1 className="text-lg font-medium truncate px-4">
            {currentPageTitle}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {showHelp && (
            <button className={`p-2 rounded-full hover:bg-opacity-10 ${
              theme === 'dark' ? 'text-white hover:bg-white' : 'text-gray-800 hover:bg-black'
            }`}>
              <HelpCircle size={20} />
            </button>
          )}

          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full hover:bg-opacity-10 ${
              theme === 'dark' ? 'text-white hover:bg-white' : 'text-gray-800 hover:bg-black'
            }`}
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {showProfile && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-opacity-10 ${
                  theme === 'dark' ? 'text-white hover:bg-white' : 'text-gray-800 hover:bg-black'
                }`}
              >
                <User size={18} />
                <span className="hidden lg:inline text-sm truncate max-w-xs">
                  {getUserDisplay()}
                </span>
              </button>

              {isDropdownOpen && (
                <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-20 ${
                  theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                }`}>
                  <Link 
                    href={getProfileSettingsPath()} 
                    className={`flex items-center px-4 py-2 text-sm ${
                      theme === 'dark' ? 'text-white hover:bg-gray-700' : 'text-gray-800 hover:bg-gray-100'
                    }`}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <Settings size={16} className="mr-3" />
                    <span>Profile Settings</span>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className={`flex items-center w-full text-left px-4 py-2 text-sm ${
                      theme === 'dark' ? 'text-white hover:bg-gray-700' : 'text-gray-800 hover:bg-gray-100'
                    }`}
                  >
                    <LogOut size={16} className="mr-3" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default ReUsableNavbar;