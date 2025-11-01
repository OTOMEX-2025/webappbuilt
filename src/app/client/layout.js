"use client";
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from "../../context/ThemeContext";
import ReUsableSideBar from "../../components/ReUsableSideBar";
import ReUsableNavbar from "../../components/ReUsableNavbar";
import {
  Home,
  MessageSquareMore,
  Video,
  Newspaper,
  Music,
  Gamepad2,
  CreditCard,
} from "lucide-react";

const menuItems = [
  { icon: <Home size={20} />, label: 'Home', path: '/client/dashboard' },
  { icon: <MessageSquareMore size={20} />, label: 'AI Chat', path: '/client/chat' },
  { icon: <Video size={20} />, label: 'Meetings', path: '/client/meetings' },
  { icon: <Newspaper size={20} />, label: 'News & Articles', path: '/client/news' },
  { icon: <Music size={20} />, label: '8D Music', path: '/client/music' },
  { icon: <Gamepad2 size={20} />, label: 'Games', path: '/client/games' },
  { 
    icon: <CreditCard size={20} />, 
    label: 'Subscription', 
    path: '/client/subscribe',
  },
];

const logo = "/MindPalLogo-removebg-preview.png";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const currentPage = pathname.split('/').pop() || 'Dashboard';
  const formattedPageName = currentPage.charAt(0).toUpperCase() + currentPage.slice(1);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className={`flex flex-col h-screen overflow-hidden ${
      theme === 'dark' ? 'bg-black text-white' : 'bg-white text-gray-900'
    }`}>
      <ReUsableNavbar 
        onMenuToggle={toggleSidebar}
        pageTitle={formattedPageName}
        isSidebarOpen={sidebarOpen}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <ReUsableSideBar 
          isOpen={sidebarOpen} 
          setIsOpen={setSidebarOpen} 
          menuItems={menuItems} 
          logo={logo} 
        />
        
        <main className={`flex-1 overflow-y-scroll transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'
        }`}>
          <div className="p-4 lg:p-6  w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}