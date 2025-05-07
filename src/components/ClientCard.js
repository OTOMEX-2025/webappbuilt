"use client";
import Link from 'next/link';
import styles from './ClientCard.module.css';

export default function ClientCard({ title, icon, path }) {
  return (
    <Link href={path} className={styles.card}>
      <div className={styles.icon}>{icon}</div>
      <h3 className={styles.title}>{title}</h3>
    </Link>
  );
}