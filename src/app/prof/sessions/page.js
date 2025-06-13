import { RiTimeLine } from 'react-icons/ri';
import data from '../../../backend/data.json';
import styles from './SessionsPage.module.css';

const SessionsPage = () => {
  const { upcoming, past } = data.sessions;

  return (
    <div className={styles.sessionsContainer}>
      <h1 className={styles.pageTitle}><RiTimeLine /> Therapy Sessions</h1>
      
      <div className={styles.sessionTabs}>
        <button className={styles.activeTab}>Upcoming</button>
        <button className={styles.tabButton}>Past Sessions</button>
        <button className={styles.tabButton}>Schedule New</button>
      </div>
      
      <div className={styles.upcomingSessions}>
        <h2>Upcoming Sessions</h2>
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
              {upcoming.map(session => (
                <tr key={session.id}>
                  <td>{session.patient}</td>
                  <td>{session.date} at {session.time}</td>
                  <td>{session.duration}</td>
                  <td>{session.type}</td>
                  <td>
                    <span className={`${styles.status} ${styles['status-' + session.status.toLowerCase()]}`}>
                      {session.status}
                    </span>
                  </td>
                  <td className={styles.actionsCell}>
                    <button className={styles.actionButton}>Details</button>
                    <button className={styles.actionButton}>Reschedule</button>
                    {session.status === 'Pending' && (
                      <button className={styles.confirmButton}>Confirm</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className={styles.pastSessions}>
        <h2>Recent Past Sessions</h2>
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
              {past.map(session => (
                <tr key={session.id}>
                  <td>{session.patient}</td>
                  <td>{session.date} at {session.time}</td>
                  <td>{session.type}</td>
                  <td className={styles.notesCell}>{session.notes}</td>
                  <td className={styles.actionsCell}>
                    <button className={styles.actionButton}>View Details</button>
                    <button className={styles.actionButton}>Follow Up</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SessionsPage;