import { RiUserLine } from 'react-icons/ri';
import styles from './ProfilesPage.module.css';
import data from '../../../backend/data.json';

const ProfilesPage = () => {
  // Get active patients from the imported data
  const patients = data.patients.active;

  return (
    <div className={styles.profilesContainer}>
      <h1 className={styles.pageTitle}><RiUserLine /> Patient Profiles</h1>
      
      <div className={styles.searchFilter}>
        <input 
          type="text" 
          placeholder="Search patients..." 
          className={styles.searchInput}
        />
        <select className={styles.filterSelect}>
          <option>All Statuses</option>
          <option>Active</option>
          <option>At Risk</option>
          <option>Stable</option>
        </select>
        <select className={styles.filterSelect}>
          <option>All Diagnoses</option>
          <option>Anxiety Disorders</option>
          <option>Depression</option>
          <option>PTSD</option>
          <option>Bipolar Disorder</option>
          <option>OCD</option>
        </select>
      </div>
      
      <div className={styles.profilesGrid}>
        {patients.map(patient => (
          <div key={patient.id} className={styles.profileCard}>
            <img 
              src={patient.image} 
              alt={patient.name} 
              className={styles.profilePic} 
            />
            <h3>{patient.name}</h3>
            <p><strong>Age:</strong> {patient.age}</p>
            <p><strong>Gender:</strong> {patient.gender}</p>
            <p><strong>Diagnosis:</strong> {patient.primaryDiagnosis}</p>
            <p><strong>Last Session:</strong> {patient.lastSession}</p>
            <p>
              <strong>Status:</strong> 
              <span className={`${styles.status} ${styles['status-' + patient.status.toLowerCase().replace(' ', '-')]}`}>
                {patient.status}
              </span>
            </p>
            <button className={styles.viewProfileBtn}>View Full Profile</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilesPage;