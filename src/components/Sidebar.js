// app/components/Sidebar.js
'use client';

import styles from './Sidebar.module.css';
import Link from 'next/link';

export default function Sidebar({ isOpen }) {
  return (
    <div className={`${styles.sidebar} ${!isOpen ? styles.hidden : ''}`}>
      <Link className={styles.link} href="/chatbot">Chatbot</Link>
      <Link className={styles.link} href="/dashboard">Dashboard</Link>
      <Link className={styles.link} href="/games">Games</Link>
      <Link className={styles.link} href="/8dmusic">8D Music</Link>
    </div>
  );
}
