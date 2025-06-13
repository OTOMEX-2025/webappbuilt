import { RiAlertLine } from 'react-icons/ri';


const EmergenciesPage = () => {
  // Sample emergency data
  const activeEmergencies = [
    {
      id: 1,
      student: 'Alex Johnson',
      date: '2023-06-12',
      time: '9:45 AM',
      type: 'Mental Health Crisis',
      severity: 'High',
      status: 'Active',
      description: 'Student reported severe anxiety and panic attacks. Initial contact made, needs follow-up.'
    }
  ];

  const resolvedEmergencies = [
    {
      id: 2,
      student: 'Taylor Brown',
      date: '2023-05-28',
      time: '3:15 PM',
      type: 'Academic Distress',
      severity: 'Medium',
      status: 'Resolved',
      resolution: 'Referred to academic support services. Follow-up confirmed improvement.'
    },
    {
      id: 3,
      student: 'Chris Lee',
      date: '2023-05-15',
      time: '11:30 AM',
      type: 'Personal Safety',
      severity: 'High',
      status: 'Resolved',
      resolution: 'Connected with campus security and counseling services. Situation stabilized.'
    }
  ];

  return (
    <div className="emergencies-container">
      <h1><RiAlertLine /> Emergency Cases</h1>
      
      <div className="emergency-tabs">
        <button className="active">Active</button>
        <button>Resolved</button>
        <button>Protocols</button>
      </div>
      
      <div className="active-emergencies">
        <h2>Active Emergencies</h2>
        {activeEmergencies.length > 0 ? (
          activeEmergencies.map(emergency => (
            <div key={emergency.id} className="emergency-card high-priority">
              <div className="emergency-header">
                <h3>{emergency.student}</h3>
                <span className={`severity-${emergency.severity.toLowerCase()}`}>{emergency.severity} Priority</span>
              </div>
              <p><strong>Type:</strong> {emergency.type}</p>
              <p><strong>Reported:</strong> {emergency.date} at {emergency.time}</p>
              <p><strong>Description:</strong> {emergency.description}</p>
              <div className="emergency-actions">
                <button className="primary-action">Take Action</button>
                <button>Contact Student</button>
                <button>Escalate</button>
                <button>Document</button>
              </div>
            </div>
          ))
        ) : (
          <p>No active emergencies at this time.</p>
        )}
      </div>
      
      <div className="resolved-emergencies">
        <h2>Recently Resolved</h2>
        {resolvedEmergencies.map(emergency => (
          <div key={emergency.id} className="emergency-card resolved">
            <div className="emergency-header">
              <h3>{emergency.student}</h3>
              <span className="status-resolved">Resolved</span>
            </div>
            <p><strong>Type:</strong> {emergency.type}</p>
            <p><strong>Reported:</strong> {emergency.date} at {emergency.time}</p>
            <p><strong>Resolution:</strong> {emergency.resolution}</p>
            <button className="view-details">View Details</button>
          </div>
        ))}
      </div>
      
      <div className="emergency-resources">
        <h2>Emergency Resources</h2>
        <ul>
          <li>Campus Security: <strong>555-1234</strong></li>
          <li>Crisis Counseling: <strong>555-5678</strong></li>
          <li>Title IX Office: <strong>555-9012</strong></li>
          <li>Student Health Services: <strong>555-3456</strong></li>
        </ul>
      </div>
    </div>
  );
};