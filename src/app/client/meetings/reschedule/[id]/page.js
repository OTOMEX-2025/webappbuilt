'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import styles from './reschedule.module.css';

const RescheduleMeeting = () => {
  const { id } = useParams();
  const router = useRouter();
  const [meeting, setMeeting] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const response = await fetch(`/api/clt/meetings/${id}`);
        if (!response.ok) {
          throw new Error('Meeting not found');
        }
        const data = await response.json();
        setMeeting(data);
        // Set initial date to current meeting date
        setNewDate(new Date(data.date).toISOString().slice(0, 16));
      } catch (err) {
        setError(err.message);
      }
    };
    
    fetchMeeting();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newDate) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/clt/meetings/reschedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          newDate: new Date(newDate).toISOString()
        }),
      });
      
      if (response.ok) {
        router.push(`/client/meetings/${id}`);
      } else {
        throw new Error('Failed to reschedule meeting');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (!meeting) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading meeting details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Error</h2>
          <p>{error}</p>
          <Link href={`/client/meetings/${id}`} className={styles.backButton}>
            <ArrowLeft size={16} /> Back to Meeting
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href={`/client/meetings/${id}`} className={styles.backButton}>
          <ArrowLeft size={16} /> Back to Meeting
        </Link>
        <h1 className={styles.title}>Reschedule Meeting</h1>
      </div>

      <div className={styles.currentMeeting}>
        <h2 className={styles.meetingTitle}>{meeting.title}</h2>
        <div className={styles.meetingDetails}>
          <div className={styles.detailItem}>
            <Clock className={styles.detailIcon} />
            <span>Current Time: {formatDate(meeting.date)}</span>
          </div>
          <div className={styles.detailItem}>
            <Calendar className={styles.detailIcon} />
            <span>Host: {meeting.therapist}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="newDate">New Date & Time</label>
          <input
            type="datetime-local"
            id="newDate"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className={styles.input}
            min={new Date().toISOString().slice(0, 16)}
            required
          />
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <div className={styles.formActions}>
          <Link href={`/client/meetings/${id}`} className={styles.secondaryButton}>
            Cancel
          </Link>
          <button
            type="submit"
            className={styles.primaryButton}
            disabled={isSubmitting || !newDate}
          >
            {isSubmitting ? 'Rescheduling...' : 'Confirm Reschedule'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RescheduleMeeting;