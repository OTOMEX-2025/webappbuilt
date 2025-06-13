import { RiAlertLine } from 'react-icons/ri';
import data from '../../../backend/data.json';
import styles from './EmergenciesPage.module.css';

const EmergenciesPage = () => {
  const { active, resolved, resources } = data.crisis;

  return (
    <div className={styles.emergenciesContainer}>
      <h1 className={styles.pageTitle}><RiAlertLine /> Crisis Cases</h1>
      
      <div className={styles.emergencyTabs}>
        <button className={styles.activeTab}>Active</button>
        <button className={styles.tabButton}>Resolved</button>
        <button className={styles.tabButton}>Protocols</button>
      </div>
      
      <div className={styles.activeEmergencies}>
        <h2>Active Crisis Cases</h2>
        {active.length > 0 ? (
          active.map(emergency => (
            <div key={emergency.id} className={`${styles.emergencyCard} ${styles['priority-' + emergency.severity.toLowerCase()]}`}>
              <div className={styles.emergencyHeader}>
                <h3>{emergency.patient}</h3>
                <span className={styles.severityBadge}>{emergency.severity} Priority</span>
              </div>
              <p><strong>Type:</strong> {emergency.type}</p>
              <p><strong>Reported:</strong> {emergency.date} at {emergency.time}</p>
              <p><strong>Description:</strong> {emergency.description}</p>
              <div className={styles.emergencyActions}>
                <button className={styles.primaryAction}>Take Action</button>
                <button className={styles.secondaryAction}>Contact Patient</button>
                <button className={styles.secondaryAction}>Escalate</button>
                <button className={styles.secondaryAction}>Document</button>
              </div>
            </div>
          ))
        ) : (
          <p className={styles.noEmergencies}>No active crisis cases at this time.</p>
        )}
      </div>
      
      <div className={styles.resolvedEmergencies}>
        <h2>Recently Resolved</h2>
        {resolved.map(emergency => (
          <div key={emergency.id} className={`${styles.emergencyCard} ${styles.resolved}`}>
            <div className={styles.emergencyHeader}>
              <h3>{emergency.patient}</h3>
              <span className={styles.resolvedBadge}>Resolved</span>
            </div>
            <p><strong>Type:</strong> {emergency.type}</p>
            <p><strong>Reported:</strong> {emergency.date} at {emergency.time}</p>
            <p><strong>Resolution:</strong> {emergency.resolution}</p>
            <button className={styles.viewDetails}>View Details</button>
          </div>
        ))}
      </div>
      
      <div className={styles.emergencyResources}>
        <h2>Emergency Resources</h2>
        <ul className={styles.resourcesList}>
          {resources.map((resource, index) => (
            <li key={index}>
              {resource.name}: <strong>{resource.number}</strong>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EmergenciesPage;