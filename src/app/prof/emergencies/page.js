'use client';
import { RiAlertLine } from 'react-icons/ri';
import data from '../../../backend/data.json';
import { useTheme } from '../../../context/ThemeContext';

const EmergenciesPage = () => {
  const { theme } = useTheme();
  const { active, resolved, resources } = data.crisis;

  return (
    <div className={`min-h-screen   ${theme === 'dark' ? 'bg-black text-white' : 'bg-gray-100 text-gray-900'} p-6`}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 flex items-center">
          <RiAlertLine className="mr-2" /> Crisis Cases
        </h1>
        
        <div className="flex space-x-2 mb-8">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md">Active</button>
          <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md">
            Resolved
          </button>
          <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md">
            Protocols
          </button>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Active Crisis Cases</h2>
          {active.length > 0 ? (
            <div className="space-y-6">
              {active.map(emergency => (
                <div 
                  key={emergency.id} 
                  className={`p-6 rounded-lg shadow ${
                    emergency.severity.toLowerCase() === 'high' ? 'bg-red-100 dark:bg-red-900' :
                    emergency.severity.toLowerCase() === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900' :
                    'bg-orange-100 dark:bg-orange-900'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold">{emergency.patient}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      emergency.severity.toLowerCase() === 'high' ? 'bg-red-200 text-red-900 dark:bg-red-700 dark:text-red-100' :
                      emergency.severity.toLowerCase() === 'medium' ? 'bg-yellow-200 text-yellow-900 dark:bg-yellow-700 dark:text-yellow-100' :
                      'bg-orange-200 text-orange-900 dark:bg-orange-700 dark:text-orange-100'
                    }`}>
                      {emergency.severity} Priority
                    </span>
                  </div>
                  <div className="space-y-2">
                    <p><strong className="text-gray-600 dark:text-gray-400">Type:</strong> {emergency.type}</p>
                    <p><strong className="text-gray-600 dark:text-gray-400">Reported:</strong> {emergency.date} at {emergency.time}</p>
                    <p><strong className="text-gray-600 dark:text-gray-400">Description:</strong> {emergency.description}</p>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
                      Take Action
                    </button>
                    <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md">
                      Contact Patient
                    </button>
                    <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md">
                      Escalate
                    </button>
                    <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md">
                      Document
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`p-6 rounded-lg shadow text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <p>No active crisis cases at this time.</p>
            </div>
          )}
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Recently Resolved</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resolved.map(emergency => (
              <div 
                key={emergency.id} 
                className={`p-6 rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">{emergency.patient}</h3>
                  <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-sm font-medium">
                    Resolved
                  </span>
                </div>
                <div className="space-y-2">
                  <p><strong className="text-gray-600 dark:text-gray-400">Type:</strong> {emergency.type}</p>
                  <p><strong className="text-gray-600 dark:text-gray-400">Reported:</strong> {emergency.date} at {emergency.time}</p>
                  <p><strong className="text-gray-600 dark:text-gray-400">Resolution:</strong> {emergency.resolution}</p>
                </div>
                <button className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-6">Emergency Resources</h2>
          <div className={`p-6 rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <ul className="space-y-3">
              {resources.map((resource, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span>{resource.name}:</span>
                  <strong className="text-blue-600 dark:text-blue-400">{resource.number}</strong>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergenciesPage;