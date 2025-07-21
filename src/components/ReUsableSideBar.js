"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from 'next/image';
import { useTheme } from "../context/ThemeContext";
import { useState, useEffect } from "react";

const ReUsableSideBar = ({ 
  isOpen, 
  setIsOpen, 
  logo,
  menuItems,
  logoWidth = 150,
  logoHeight = 150
}) => {
  const pathname = usePathname();
  const { theme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) {
    return (
      <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 ${
        theme === 'dark' ? 'bg-black border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <nav className="p-2">
          <ul className="flex justify-around">
            {menuItems.slice(0, 5).map((item, idx) => {
              const isActive = pathname === item.path;
              return (
                <li key={idx}>
                  <Link
                    href={item.path}
                    className={`flex flex-col items-center justify-center p-3 rounded-full text-lg transition-colors ${
                      isActive
                        ? "bg-indigo-100 text-indigo-600"
                        : "text-indigo-600 hover:bg-indigo-50"
                    } ${
                      theme === 'dark' ? (isActive ? 'bg-indigo-900' : 'hover:bg-gray-800') : ''
                    }`}
                    title={item.label}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    );
  }

  return (
    <aside className={`fixed top-0 left-0 h-screen w-64 z-20 transition-transform duration-300 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } ${
      theme === 'dark' ? 'bg-black border-r border-gray-700' : 'bg-white border-r border-gray-200'
    }`}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-16 px-4">
          <Image
            src={logo}
            alt="Logo"
            width={logoWidth}
            height={logoHeight}
            priority
            className="h-8 w-auto"
          />
        </div>
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item, idx) => {
              const isActive = pathname === item.path;
              return (
                <li key={idx}>
                  <Link
                    href={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-indigo-600 text-white"
                        : "text-gray-800 hover:bg-indigo-50"
                    } ${
                      theme === 'dark' ? 
                        (isActive ? 'bg-indigo-900' : 'text-gray-200 hover:bg-gray-800') : ''
                    }`}
                  >
                    <span className={`text-lg ${
                      isActive ? "text-white" : "text-indigo-600"
                    } ${
                      theme === 'dark' && !isActive ? 'text-indigo-400' : ''
                    }`}>
                      {item.icon}
                    </span>
                    <span>{item.label || item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default ReUsableSideBar;