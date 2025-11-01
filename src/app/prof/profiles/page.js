'use client';
import { RiUserLine } from 'react-icons/ri';
import { useTheme } from '@/context/ThemeContext';
import data from '../../../backend/data.json';

const ProfilesPage = () => {
  const { theme } = useTheme();
  const patients = data.patients.active;

  return (
    <div className={`min-h-screen   ${theme === 'dark' ? 'bg-black text-white' : 'bg-gray-100 text-gray-900'} p-6`}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 flex items-center">
          <RiUserLine className="mr-2" /> Patient Profiles
        </h1>
        
        <div className="flex flex-wrap gap-4 mb-8">
          <input 
            type="text" 
            placeholder="Search patients..." 
            className={`px-4 py-2 rounded-md ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow max-w-md`}
          />
          <select className={`px-4 py-2 rounded-md ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}>
            <option>All Statuses</option>
            <option>Active</option>
            <option>At Risk</option>
            <option>Stable</option>
          </select>
          <select className={`px-4 py-2 rounded-md ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}>
            <option>All Diagnoses</option>
            <option>Anxiety Disorders</option>
            <option>Depression</option>
            <option>PTSD</option>
            <option>Bipolar Disorder</option>
            <option>OCD</option>
          </select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {patients.map(patient => (
            <div 
              key={patient.id} 
              className={`p-6 rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} flex flex-col items-center text-center`}
            >
              <img 
                src={patient.image} 
                alt={patient.name} 
                className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-blue-200 dark:border-blue-800"
              />
              <h3 className="text-xl font-semibold">{patient.name}</h3>
              <div className="mt-2 space-y-1 text-sm">
                <p><strong className="text-gray-600 dark:text-gray-400">Age:</strong> {patient.age}</p>
                <p><strong className="text-gray-600 dark:text-gray-400">Gender:</strong> {patient.gender}</p>
                <p><strong className="text-gray-600 dark:text-gray-400">Diagnosis:</strong> {patient.primaryDiagnosis}</p>
                <p><strong className="text-gray-600 dark:text-gray-400">Last Session:</strong> {patient.lastSession}</p>
                <p className="mt-2">
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    patient.status.toLowerCase() === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    patient.status.toLowerCase() === 'at risk' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  }`}>
                    {patient.status}
                  </span>
                </p>
              </div>
              <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
                View Full Profile
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilesPage;