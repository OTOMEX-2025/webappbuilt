'use client';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import styles from './Client.module.css';

export default function AppLayout({ children }) {
  return (
    <div className={styles.appRoot}>
      <div className={styles.sidebar}>
        <Sidebar />
      </div>
      <div className={styles.contentArea}>
        <div className={styles.navbar}>
          <Navbar />
        </div>
        <main className={styles.mainContent}>
          {children}
        </main>
      </div>
    </div>
  );
}