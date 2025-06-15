"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { RiArrowLeftLine, RiEditLine, RiDeleteBinLine } from 'react-icons/ri';

import styles from '../SessionsPage.module.css'; 

export default function SessionDetailsPage() {
  const router = useRouter();
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch(`/api/prof/sessions/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch session');
        }
        const data = await response.json();
        setSession(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSession();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this session? This action cannot be undone.')) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/prof/sessions/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete session');
      }
      
      router.push('/prof/sessions');
    } catch (err) {
      setError(err.message);
      setIsDeleting(false);
    }
  };

  if (isLoading) return <div className={styles.loading}>Loading session details...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;
  if (!session) return <div className={styles.error}>Session not found</div>;

  return (
    <div className={`${styles.sessionsContainer} ${styles.detailsContainer}`}>
      <div className={styles.header}>
        <button 
          onClick={() => router.push('/prof/sessions')} 
          className={styles.backButton}
        >
          <RiArrowLeftLine /> Back to Sessions
        </button>
        <h1 className={styles.pageTitle}>Session Details</h1>
      </div>
      
      {error && <div className={styles.errorBanner}>{error}</div>}
      
      <div className={styles.detailsCard}>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Patient:</span>
          <span className={styles.detailValue}>{session.patient}</span>
        </div>
        
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Date & Time:</span>
          <span className={styles.detailValue}>
            {new Date(session.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'short'
            })} at {session.time}
          </span>
        </div>
        
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Duration:</span>
          <span className={styles.detailValue}>{session.duration}</span>
        </div>
        
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Type:</span>
          <span className={styles.detailValue}>{session.type}</span>
        </div>
        
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Status:</span>
          <span className={`${styles.status} ${styles['status-' + session.status.toLowerCase()]}`}>
            {session.status}
          </span>
        </div>
        
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Notes:</span>
          <span className={styles.detailValue}>
            {session.notes || 'No notes available'}
          </span>
        </div>
      </div>
      
      <div className={styles.detailsActions}>
        <button
          onClick={() => router.push(`/prof/sessions/${id}/reschedule`)}
          className={styles.editButton}
        >
          <RiEditLine /> Reschedule
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className={styles.deleteButton}
        >
          <RiDeleteBinLine /> {isDeleting ? 'Deleting...' : 'Delete Session'}
        </button>
      </div>
    </div>
  );
}