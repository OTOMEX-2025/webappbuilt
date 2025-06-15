'use client';
import React, { useState, useEffect } from 'react';
import { Video, Calendar, Users, Clock, X, Check, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import styles from './Meetings.module.css';

const Meetings = () => {
  const [meetings, setMeetings] = useState({
    upcoming: [],
    past: [],
    canceled: []
  });
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [currentMeeting, setCurrentMeeting] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [newDate, setNewDate] = useState('');

  useEffect(() => {
    const fetchMeetings = async () => {
      const response = await fetch('/api/clt/meetings');
      const data = await response.json();
      setMeetings(data);
    };
    fetchMeetings();
  }, []);

  const handleCancelMeeting = async () => {
    if (!currentMeeting) return;
    
    const response = await fetch('/api/clt/meetings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: currentMeeting.id,
        action: 'cancel',
        reason: cancelReason
      }),
    });
    
    if (response.ok) {
      const updatedMeeting = await response.json();
      setMeetings(prev => ({
        ...prev,
        upcoming: prev.upcoming.filter(m => m.id !== updatedMeeting.id),
        canceled: [...prev.canceled, updatedMeeting]
      }));
      setShowCancelModal(false);
      setCancelReason('');
    }
  };

  const handleRescheduleMeeting = async () => {
    if (!currentMeeting || !newDate) return;
    
    const response = await fetch('/api/clt/meetings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: currentMeeting.id,
        action: 'reschedule',
        newDate: new Date(newDate).toISOString()
      }),
    });
    
    if (response.ok) {
      const updatedMeeting = await response.json();
      setMeetings(prev => ({
        ...prev,
        upcoming: prev.upcoming.map(m => 
          m.id === updatedMeeting.id ? updatedMeeting : m
        )
      }));
      setShowRescheduleModal(false);
      setNewDate('');
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

  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString('en-US', options);
  };

  const getDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours > 0 ? `${hours}h ` : ''}${mins}m`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.heading}>Virtual Meetings</h1>
          <p className={styles.subheading}>Manage your upcoming and past therapy sessions</p>
        </div>
        <Link href="/client/meetings/create" className={styles.createButton}>
          <Video size={16} />
          Create Meeting
        </Link>
      </div>

      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'upcoming' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'past' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('past')}
          >
            Past
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'canceled' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('canceled')}
          >
            Canceled
          </button>
        </div>
      </div>

      <div className={styles.content}>
        {meetings[activeTab]?.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIllustration}>
              <Calendar size={48} />
            </div>
            <h3>No {activeTab} meetings</h3>
            <p>You don&quot;t have any {activeTab} meetings scheduled</p>
            {activeTab === 'upcoming' && (
              <Link href="/client/meetings/create" className={styles.createButton}>
                Schedule a Meeting
              </Link>
            )}
          </div>
        ) : (
          <div className={styles.meetingsGrid}>
            {meetings[activeTab]?.map((meeting) => (
              <div key={meeting.id} className={styles.meetingCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.meetingStatus}>
                    {meeting.status === 'canceled' && (
                      <span className={styles.canceledBadge}>Canceled</span>
                    )}
                    <span className={styles.meetingDate}>
                      {formatDate(meeting.date)}
                    </span>
                  </div>
                  <h3 className={styles.meetingTitle}>{meeting.title}</h3>
                  <p className={styles.meetingHost}>With {meeting.therapist}</p>
                </div>
                
                <div className={styles.meetingDetails}>
                  <div className={styles.detailItem}>
                    <Clock className={styles.detailIcon} />
                    <span>{formatTime(meeting.date)} ({getDuration(meeting.duration)})</span>
                  </div>
                  <div className={styles.detailItem}>
                    <Users className={styles.detailIcon} />
                    <span>
                      {activeTab === 'upcoming' 
                        ? `${meeting.participants || 0}/${meeting.maxParticipants} participants`
                        : `${meeting.participants} participants`}
                    </span>
                  </div>
                </div>

                {meeting.description && (
                  <div className={styles.descriptionContainer}>
                    <p className={styles.meetingDescription}>{meeting.description}</p>
                  </div>
                )}

                {meeting.status === 'canceled' && meeting.cancelReason && (
                  <div className={styles.cancelReason}>
                    <strong>Reason:</strong> {meeting.cancelReason}
                  </div>
                )}

                {activeTab === 'upcoming' && (
                  <div className={styles.actionButtons}>
                    <Link 
                      href={`/client/meetings/join/${meeting.id}`} 
                      className={styles.primaryButton}
                    >
                      Join Meeting
                    </Link>
                    <div className={styles.secondaryActions}>
                      <button 
                        className={styles.secondaryButton}
                        onClick={() => {
                          setCurrentMeeting(meeting);
                          setShowRescheduleModal(true);
                        }}
                      >
                        <RefreshCw size={16} /> Reschedule
                      </button>
                      <button 
                        className={styles.dangerButton}
                        onClick={() => {
                          setCurrentMeeting(meeting);
                          setShowCancelModal(true);
                        }}
                      >
                        <X size={16} /> Cancel
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'past' && meeting.recordingAvailable && (
                  <button className={styles.secondaryButton}>
                    View Recording
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cancel Meeting Modal */}
      {showCancelModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Cancel Meeting</h3>
            <p>Are you sure you want to cancel &apos;{currentMeeting?.title}&apos;?</p>
            <div className={styles.formGroup}>
              <label htmlFor="cancelReason">Reason for cancellation:</label>
              <textarea
                id="cancelReason"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Please provide a reason for cancellation"
                className={styles.textarea}
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
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Meeting Modal */}
      {showRescheduleModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Reschedule Meeting</h3>
            <p>Select a new date and time for &apos;{currentMeeting?.title}&apos;</p>
            <div className={styles.formGroup}>
              <label htmlFor="newDate">New Date & Time:</label>
              <input
                type="datetime-local"
                id="newDate"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className={styles.input}
                min={new Date().toISOString().slice(0, 16)}
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

export default Meetings;