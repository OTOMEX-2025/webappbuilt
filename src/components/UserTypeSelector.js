import styles from '../styles/Register.module.css';

export default function UserTypeSelector({ setUserType }) {
  return (
    <div className={styles.selector}>
      <h2>Who are you?</h2>
      <button onClick={() => setUserType('client')} className={styles.optionButton}>Client</button>
      <button onClick={() => setUserType('professional')} className={styles.optionButton}>Professional</button>
      <button onClick={() => setUserType('admin')} className={styles.optionButton}>Admin</button>
    </div>
  );
}