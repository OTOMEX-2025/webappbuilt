'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Video, Calendar, Users, Clock, ArrowLeft, Edit, Trash2, Phone } from 'lucide-react';
import Link from 'next/link';
import styles from './detail.module.css';

const MeetingDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const [meeting, setMeeting] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [newDate, setNewDate] = useState('');

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/clt/meetings/${id}`);
        if (!response.ok) {
          throw new Error('Meeting not found');
        }
        const data = await response.json();
        setMeeting(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMeeting();
  }, [id]);

  const handleCancelMeeting = async () => {
    try {
      const response = await fetch('/api/clt/meetings/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: meeting.id,
          reason: cancelReason
        }),
      });
      
      if (response.ok) {
        router.push('/client/meetings');
      }
    } catch (error) {
      console.error('Error canceling meeting:', error);
    }
  };

  const handleRescheduleMeeting = async () => {
    try {
      const response = await fetch('/api/clt/meetings/reschedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: meeting.id,
          newDate: new Date(newDate).toISOString()
        }),
      });
      
      if (response.ok) {
        const updatedMeeting = await response.json();
        setMeeting(updatedMeeting.meeting);
        setShowRescheduleModal(false);
      }
    } catch (error) {
      console.error('Error rescheduling meeting:', error);
    }
  };

  const handleDeleteMeeting = async () => {
    try {
      const response = await fetch(`/api/clt/meetings?id=${meeting.id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        router.push('/client/meetings');
      }
    } catch (error) {
      console.error('Error deleting meeting:', error);
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

  if (isLoading) {
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
          <Link href="/client/meetings" className={styles.backButton}>
            <ArrowLeft size={16} /> Back to Meetings
          </Link>
        </div>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Meeting Not Found</h2>
          <Link href="/client/meetings" className={styles.backButton}>
            <ArrowLeft size={16} /> Back to Meetings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/client/meetings" className={styles.backButton}>
          <ArrowLeft size={16} /> Back to Meetings
        </Link>
        <h1 className={styles.title}>{meeting.title}</h1>
        {meeting.status === 'canceled' && (
          <span className={styles.canceledBadge}>Canceled</span>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.details}>
          <div className={styles.detailItem}>
            <Clock className={styles.detailIcon} />
            <div>
              <h3>Date & Time</h3>
              <p>{formatDate(meeting.date)}</p>
            </div>
          </div>
          
          <div className={styles.detailItem}>
            <Users className={styles.detailIcon} />
            <div>
              <h3>Participants</h3>
              <p>
                {meeting.participants || 0}
                {meeting.maxParticipants ? `/${meeting.maxParticipants}` : ''} joined
              </p>
            </div>
          </div>
          
          <div className={styles.detailItem}>
            <Calendar className={styles.detailIcon} />
            <div>
              <h3>Host</h3>
              <p>{meeting.therapist}</p>
            </div>
          </div>
          
          {meeting.description && (
            <div className={styles.description}>
              <h3>Description</h3>
              <p>{meeting.description}</p>
            </div>
          )}
          
          {meeting.status === 'canceled' && meeting.cancelReason && (
            <div className={styles.cancelReason}>
              <h3>Cancellation Reason</h3>
              <p>{meeting.cancelReason}</p>
            </div>
          )}
        </div>

        <div className={styles.actions}>
          {meeting.status === 'scheduled' && (
            <>
              <Link 
                href={`/client/meetings/join/${meeting.id}`} 
                className={styles.primaryButton}
              >
                <Phone size={16} /> Join Meeting
              </Link>
              
              <button 
                className={styles.secondaryButton}
                onClick={() => setShowRescheduleModal(true)}
              >
                <Edit size={16} /> Reschedule
              </button>
              
              <button 
                className={styles.dangerButton}
                onClick={() => setShowCancelModal(true)}
              >
                <Trash2 size={16} /> Cancel Meeting
              </button>
            </>
          )}
          
          {(meeting.status === 'canceled' || meeting.status === 'completed') && (
            <button 
              className={styles.dangerButton}
              onClick={handleDeleteMeeting}
            >
              <Trash2 size={16} /> Delete Meeting
            </button>
          )}
        </div>
      </div>

      {/* Cancel Meeting Modal */}
      {showCancelModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Cancel Meeting</h3>
            <p>Are you sure you want to cancel &quot;{meeting.title}&quot;?</p>
            <div className={styles.formGroup}>
              <label htmlFor="cancelReason">Reason for cancellation:</label>
              <textarea
                id="cancelReason"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Please provide a reason for cancellation"
                className={styles.textarea}
                required
              />
            </div>
            <div className={styles.modalActions}>
              <button 
                className={styles.secondaryButton}
                onClick={() => setShowCancelModal(false)}
              >
                Back
              </button>
              <button 
                className={styles.dangerButton}
                onClick={handleCancelMeeting}
                disabled={!cancelReason}
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
      <Link 
  href={`/client/meetings/create/${meeting.id}`}
  className={styles.secondaryButton}
>
  <Edit size={16} /> Edit Meeting
</Link>

      {/* Reschedule Meeting Modal */}
      {showRescheduleModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Reschedule Meeting</h3>
            <p>Select a new date and time for &quot;{meeting.title}&quot;</p>
            <div className={styles.formGroup}>
              <label htmlFor="newDate">New Date & Time:</label>
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
            <div className={styles.modalActions}>
              <button 
                className={styles.secondaryButton}
                onClick={() => setShowRescheduleModal(false)}
              >
                Back
              </button>
              <button 
                className={styles.primaryButton}
                onClick={handleRescheduleMeeting}
                disabled={!newDate}
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingDetail;