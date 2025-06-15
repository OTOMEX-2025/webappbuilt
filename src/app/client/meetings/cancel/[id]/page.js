'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, Clock, ArrowLeft, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import styles from './cancel.module.css';

const CancelMeeting = () => {
  const { id } = useParams();
  const router = useRouter();
  const [meeting, setMeeting] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
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
      } catch (err) {
        setError(err.message);
      }
    };
    
    fetchMeeting();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cancelReason) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/clt/meetings/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          reason: cancelReason
        }),
      });
      
      if (response.ok) {
        router.push('/client/meetings');
      } else {
        throw new Error('Failed to cancel meeting');
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
        <h1 className={styles.title}>Cancel Meeting</h1>
      </div>

      <div className={styles.warning}>
        <AlertTriangle className={styles.warningIcon} />
        <h2>Are you sure you want to cancel this meeting?</h2>
        <p>This action cannot be undone. All participants will be notified.</p>
      </div>

      <div className={styles.currentMeeting}>
        <h2 className={styles.meetingTitle}>{meeting.title}</h2>
        <div className={styles.meetingDetails}>
          <div className={styles.detailItem}>
            <Clock className={styles.detailIcon} />
            <span>{formatDate(meeting.date)}</span>
          </div>
          <div className={styles.detailItem}>
            <Calendar className={styles.detailIcon} />
            <span>Host: {meeting.therapist}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="cancelReason">Reason for cancellation</label>
          <textarea
            id="cancelReason"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            className={styles.textarea}
            placeholder="Please provide a reason for cancellation"
            required
          />
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <div className={styles.formActions}>
          <Link href={`/client/meetings/${id}`} className={styles.secondaryButton}>
            Back to Meeting
          </Link>
          <button
            type="submit"
            className={styles.dangerButton}
            disabled={isSubmitting || !cancelReason}
          >
            {isSubmitting ? 'Cancelling...' : 'Confirm Cancellation'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CancelMeeting;