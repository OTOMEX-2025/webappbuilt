"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { RiArrowLeftLine, RiCalendarLine } from 'react-icons/ri';
import styles from '../../SessionsPage.module.css';

export default function RescheduleSessionPage() {
  const { id } = useParams();
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    notes: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch(`/api/prof/sessions/${id}`);
        const data = await res.json();
        setSession(data);
        setFormData({
          date: data.date,
          time: data.time,
          notes: data.notes || ''
        });
      } catch (err) {
        setError('Failed to load session');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSession();
  }, [id]);

  if (isLoading) return <div>Loading...</div>;
  if (!session) return <div>Session not found</div>;

  return (
    <div className={styles.sessionsContainer}>
      <div className={styles.header}>
        <button onClick={() => router.back()} className={styles.backButton}>
          <RiArrowLeftLine /> Back
        </button>
        <h1><RiCalendarLine /> Reschedule Session</h1>
      </div>

      {/* Patient Info Banner */}
      <div className={styles.patientBanner}>
        <h3>Session with: {session.patient}</h3>
        <p>Original Date: {new Date(session.date).toLocaleDateString()}</p>
        <p>Original Time: {session.time}</p>
        <p>Session Type: {session.type}</p>
      </div>
      
      <form onSubmit={handleSubmit} className={styles.sessionForm}>
        <div className={styles.formGroup}>
          <label htmlFor="date">New Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className={styles.formInput}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="time">New Time</label>
          <input
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            className={styles.formInput}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="notes">Additional Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
            className={styles.formTextarea}
            placeholder="Add any additional notes about the rescheduling..."
          />
        </div>
        
        <div className={styles.formButtons}>
          <button
            type="button"
            onClick={() => router.push(`/prof/sessions/${id}`)}
            className={styles.cancelButton}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.submitButton}
          >
            {isSubmitting ? 'Rescheduling...' : 'Confirm Reschedule'}
          </button>
        </div>
      </form>
    </div>
  );
}