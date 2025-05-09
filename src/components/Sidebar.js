import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Brain,
  Home, 
  MessageSquareMore, 
  Video, 
  Newspaper, 
  Music, 
  Gamepad2,
  X
} from 'lucide-react';
import styles from '../styles/Sidebar.module.css';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const pathname = usePathname();
  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: MessageSquareMore, label: 'AI Chat', path: '/chat' },
    { icon: Video, label: 'Meetings', path: '/meetings' },
    { icon: Newspaper, label: 'News & Articles', path: '/news' },
    { icon: Music, label: '8D Music', path: '/music' },
    { icon: Gamepad2, label: 'Games', path: '/games' },
  ];

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
      <div className={styles.container}>
        <div className={styles.closeButtonContainer}>
          <button
            onClick={() => setIsOpen(false)}
            className={styles.closeButton}
            aria-label="Close sidebar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className={styles.menuContainer}>
        <div className={styles.logoContainer}>
              <Brain className={styles.logoIcon} />
              <span className={styles.logoText}>MindPal</span>
            </div>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
              className={`${styles.menuItem} ${
                pathname === item.path ? styles.activeMenuItem : ''
              }`}
            >
              <item.icon className={styles.menuIcon} />
              <span className={styles.menuLabel}>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;