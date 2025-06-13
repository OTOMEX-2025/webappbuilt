import { RiUserLine } from 'react-icons/ri';


const ProfilesPage = () => {
  // Sample student data
  const students = [
    {
      id: 1,
      name: 'John Doe',
      year: 'Junior',
      major: 'Computer Science',
      lastSession: '2023-05-15',
      status: 'Active',
      image: '/dummy-avatar1.jpg'
    },
    {
      id: 2,
      name: 'Jane Smith',
      year: 'Senior',
      major: 'Psychology',
      lastSession: '2023-05-10',
      status: 'Active',
      image: '/dummy-avatar2.jpg'
    },
    {
      id: 3,
      name: 'Alex Johnson',
      year: 'Freshman',
      major: 'Biology',
      lastSession: '2023-04-28',
      status: 'At Risk',
      image: '/dummy-avatar3.jpg'
    },
    {
      id: 4,
      name: 'Maria Garcia',
      year: 'Sophomore',
      major: 'Economics',
      lastSession: '2023-05-12',
      status: 'Active',
      image: '/dummy-avatar4.jpg'
    },
  ];

  return (
    <div className="profiles-container">
      <h1><RiUserLine /> Student Profiles</h1>
      
      <div className="search-filter">
        <input type="text" placeholder="Search students..." />
        <select>
          <option>All Statuses</option>
          <option>Active</option>
          <option>At Risk</option>
          <option>Inactive</option>
        </select>
        <select>
          <option>All Years</option>
          <option>Freshman</option>
          <option>Sophomore</option>
          <option>Junior</option>
          <option>Senior</option>
        </select>
      </div>
      
      <div className="profiles-grid">
        {students.map(student => (
          <div key={student.id} className="profile-card">
            <img src={student.image} alt={student.name} className="profile-pic" />
            <h3>{student.name}</h3>
            <p><strong>Year:</strong> {student.year}</p>
            <p><strong>Major:</strong> {student.major}</p>
            <p><strong>Last Session:</strong> {student.lastSession}</p>
            <p><strong>Status:</strong> <span className={`status-${student.status.toLowerCase().replace(' ', '-')}`}>{student.status}</span></p>
            <button className="view-profile-btn">View Profile</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilesPage;