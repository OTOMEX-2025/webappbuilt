"use client";

import { useState, useEffect } from 'react';
import { RiTimeLine, RiMoonLine, RiSunLine, RiAddLine } from 'react-icons/ri';
import { useRouter } from 'next/navigation';
import { useTheme } from '../../../context/ThemeContext';
import styles from './SessionsPage.module.css';
import Link from 'next/link';

const SessionsPage = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const router = useRouter();
  const [sessions, setSessions] = useState({ upcoming: [], past: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch('/api/prof/sessions');
        if (!response.ok) throw new Error('Failed to fetch sessions');
        const data = await response.json();
        setSessions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const handleConfirmSession = async (sessionId) => {
    try {
      const response = await fetch(`/api/prof/sessions/${sessionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Confirmed' })
      });
      
      if (!response.ok) throw new Error('Failed to confirm session');
      
      const updatedResponse = await fetch('/api/prof/sessions');
      const updatedData = await updatedResponse.json();
      setSessions(updatedData);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReschedule = (sessionId) => {
    router.push(`/prof/sessions/${sessionId}/reschedule`);
  };

  const handleDeleteSession = async (sessionId) => {
    if (!confirm('Are you sure you want to delete this session?')) return;
    
    try {
      const response = await fetch(`/api/prof/sessions/${sessionId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete session');
      
      const updatedResponse = await fetch('/api/prof/sessions');
      const updatedData = await updatedResponse.json();
      setSessions(updatedData);
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={`  min-h-screen center${styles.sessionsContainer} ${darkMode ? styles.dark : ''}`}>
      
      {error && <div className={styles.errorBanner}>{error}</div>}
      
      <div className={styles.sessionTabs}>
        <button 
          onClick={() => setActiveTab('upcoming')}
          className={activeTab === 'upcoming' ? styles.activeTab : styles.tabButton}
        >
          Upcoming
        </button>
        <button 
          onClick={() => setActiveTab('past')}
          className={activeTab === 'past' ? styles.activeTab : styles.tabButton}
        >
          Past Sessions
        </button>
        <Link href="/prof/sessions/new" className={styles.newSessionButton}>
          <RiAddLine /> New Session
        </Link>
      </div>
      
      {activeTab === 'upcoming' ? (
        <div className={styles.upcomingSessions}>
          <h2 className={styles.sectionTitle}>Upcoming Sessions</h2>
          {sessions.upcoming.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No upcoming sessions scheduled</p>
              <Link href="/prof/sessions/new" className={styles.emptyStateButton}>
                Schedule a Session
              </Link>
            </div>
          ) : (
            <div className={styles.tableContainer}>
              <table className={styles.sessionsTable}>
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Date & Time</th>
                    <th>Duration</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.upcoming.map(session => (
                    <tr key={session.id}>
                      <td>{session.patient}</td>
                      <td>{new Date(session.date).toLocaleDateString()} at {session.time}</td>
                      <td>{session.duration}</td>
                      <td>{session.type}</td>
                      <td>
                        <span className={`${styles.status} ${styles['status-' + session.status.toLowerCase()]}`}>
                          {session.status}
                        </span>
                      </td>
                      <td className={styles.actionsCell}>
                        <div className={styles.actionsGroup}>
                          <button 
                            onClick={() => router.push(`/prof/sessions/${session.id}`)}
                            className={styles.actionButton}
                          >
                            Details
                          </button>
                          <button 
                            onClick={() => handleReschedule(session.id)}
                            className={styles.actionButton}
                          >
                            Reschedule
                          </button>
                          {session.status === 'Pending' && (
                            <button 
                              onClick={() => handleConfirmSession(session.id)}
                              className={styles.confirmButton}
                            >
                              Confirm
                            </button>
                          )}
                          <button 
                            onClick={() => handleDeleteSession(session.id)}
                            className={styles.deleteButton}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.pastSessions}>
          <h2 className={styles.sectionTitle}>Past Sessions</h2>
          {sessions.past.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No past sessions found</p>
            </div>
          ) : (
            <div className={styles.tableContainer}>
              <table className={styles.sessionsTable}>
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Date & Time</th>
                    <th>Type</th>
                    <th>Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.past.map(session => (
                    <tr key={session.id}>
                      <td>{session.patient}</td>
                      <td>{new Date(session.date).toLocaleDateString()} at {session.time}</td>
                      <td>{session.type}</td>
                      <td className={styles.notesCell}>
                        {session.notes || 'No notes available'}
                      </td>
                      <td className={styles.actionsCell}>
                        <div className={styles.actionsGroup}>
                          <button 
                            onClick={() => router.push(`/prof/sessions/${session.id}`)}
                            className={styles.actionButton}
                          >
                            Details
                          </button>
                          <button 
                            onClick={() => router.push(`/prof/followups/new?session=${session.id}`)}
                            className={styles.actionButton}
                          >
                            Follow Up
                          </button>
                          <button 
                            onClick={() => handleDeleteSession(session.id)}
                            className={styles.deleteButton}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SessionsPage;