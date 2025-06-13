import { RiTimeLine } from 'react-icons/ri';
import data from '../../../backend/data.json';

const SessionsPage = () => {
  const {} = data;
  // Sample session data
  const upcomingSessions = [
    {
      id: 1,
      student: 'John Doe',
      date: '2023-06-15',
      time: '10:00 AM',
      duration: '45 mins',
      type: 'Academic Advising',
      status: 'Confirmed'
    },
    {
      id: 2,
      student: 'Jane Smith',
      date: '2023-06-16',
      time: '2:30 PM',
      duration: '30 mins',
      type: 'Career Counseling',
      status: 'Confirmed'
    },
    {
      id: 3,
      student: 'Alex Johnson',
      date: '2023-06-17',
      time: '11:15 AM',
      duration: '60 mins',
      type: 'Thesis Consultation',
      status: 'Pending'
    },
  ];

  const pastSessions = [
    {
      id: 4,
      student: 'Maria Garcia',
      date: '2023-06-10',
      time: '3:00 PM',
      duration: '30 mins',
      type: 'Academic Advising',
      status: 'Completed',
      notes: 'Discussed course selection for next semester'
    },
    {
      id: 5,
      student: 'Robert Chen',
      date: '2023-06-08',
      time: '9:30 AM',
      duration: '45 mins',
      type: 'Personal Counseling',
      status: 'Completed',
      notes: 'Follow-up needed in 2 weeks'
    },
    {
      id: 6,
      student: 'Sarah Williams',
      date: '2023-06-05',
      time: '1:00 PM',
      duration: '60 mins',
      type: 'Thesis Consultation',
      status: 'Completed',
      notes: 'Reviewed chapter 3 draft'
    },
  ];

  return (
    <div className="sessions-container">
      <h1><RiTimeLine /> Counseling Sessions</h1>
      
      <div className="session-tabs">
        <button className="active">Upcoming</button>
        <button>Past Sessions</button>
        <button>Request New</button>
      </div>
      
      <div className="upcoming-sessions">
        <h2>Upcoming Sessions</h2>
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Date & Time</th>
              <th>Duration</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {upcomingSessions.map(session => (
              <tr key={session.id}>
                <td>{session.student}</td>
                <td>{session.date} at {session.time}</td>
                <td>{session.duration}</td>
                <td>{session.type}</td>
                <td><span className={`status-${session.status.toLowerCase()}`}>{session.status}</span></td>
                <td>
                  <button>Details</button>
                  <button>Reschedule</button>
                  {session.status === 'Pending' && <button>Confirm</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="past-sessions">
        <h2>Recent Past Sessions</h2>
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Date & Time</th>
              <th>Type</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pastSessions.map(session => (
              <tr key={session.id}>
                <td>{session.student}</td>
                <td>{session.date} at {session.time}</td>
                <td>{session.type}</td>
                <td>{session.notes}</td>
                <td>
                  <button>View Details</button>
                  <button>Follow Up</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SessionsPage;