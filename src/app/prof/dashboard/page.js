'use client';

import { RiDashboardLine, RiUserLine, RiTimeLine, RiAlertLine, RiBarChartLine, RiMentalHealthLine } from 'react-icons/ri';
import data from '../../../backend/data.json';
import { useTheme } from '../../../context/ThemeContext';

// Visx imports
import { Bar } from '@visx/shape';
import { Group } from '@visx/group';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import { Pie } from '@visx/shape';
import { Text } from '@visx/text';

const StatCard = ({ icon, title, value, description }) => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className={`p-4 rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      <h3 className="flex items-center text-lg font-medium">
        {icon} <span className="ml-2">{title}</span>
      </h3>
      <p className="text-3xl font-bold my-2 text-blue-600">{value}</p>
      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{description}</p>
    </div>
  );
};

const ProfileCard = ({ patient }) => {
  const { theme } = useTheme();
  return (
    <div className={`p-4 rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex items-start mb-4">
        <img 
          src={patient.image || '/default-avatar.jpg'} 
          alt={patient.name} 
          className="w-12 h-12 rounded-full object-cover mr-4"
        />
        <div>
          <h4 className="font-medium">{patient.name}</h4>
          <p className="text-sm text-gray-500">{patient.age} years • {patient.gender}</p>
        </div>
      </div>
      <div className="space-y-2">
        <p><strong className="text-gray-600 dark:text-gray-400">Condition:</strong> {patient.primaryDiagnosis}</p>
        <p><strong className="text-gray-600 dark:text-gray-400">Last Session:</strong> {patient.lastSession}</p>
        <p>
          <strong className="text-gray-600 dark:text-gray-400">Status:</strong> 
          <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
            patient.status.toLowerCase() === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
            patient.status.toLowerCase() === 'at-risk' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
            'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
          }`}>
            {patient.status}
          </span>
        </p>
      </div>
    </div>
  );
};

const SessionCard = ({ session }) => {
  const { theme } = useTheme();
  return (
    <div className={`p-4 rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      <h4 className="font-medium">{session.type} Session</h4>
      <div className="mt-2 space-y-1">
        <p><strong className="text-gray-600 dark:text-gray-400">Patient:</strong> {session.patient}</p>
        <p><strong className="text-gray-600 dark:text-gray-400">When:</strong> {session.date} at {session.time}</p>
        <p><strong className="text-gray-600 dark:text-gray-400">Duration:</strong> {session.duration}</p>
        <p>
          <strong className="text-gray-600 dark:text-gray-400">Status:</strong> 
          <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
            session.status.toLowerCase() === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
            session.status.toLowerCase() === 'upcoming' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
          }`}>
            {session.status}
          </span>
        </p>
      </div>
      {session.notes && (
        <div className={`mt-3 p-3 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <p className="text-sm italic">{session.notes}</p>
        </div>
      )}
    </div>
  );
};

const DashboardPage = () => {
  const { theme } = useTheme();
  // Bar Chart Data and Configuration
  const weeklySessions = data.dashboard.weeklySessions;
  const barWidth = 500;
  const barHeight = 300;
  const margin = { top: 20, bottom: 50, left: 60, right: 20 };
  
  const xMax = barWidth - margin.left - margin.right;
  const yMax = barHeight - margin.top - margin.bottom;
  
  const xScale = scaleBand({
    range: [0, xMax],
    round: true,
    domain: weeklySessions.map(d => d.name),
    padding: 0.4,
  });
  
  const yScale = scaleLinear({
    range: [yMax, 0],
    round: true,
    domain: [0, Math.max(...weeklySessions.map(d => d.sessions)) + 3],
  });

  // Pie Chart Data and Configuration
  const patientDistribution = data.dashboard.patientDistribution;
  const pieWidth = 300;
  const pieHeight = 300;
  const half = pieWidth / 2;
  
  const pieScale = scaleOrdinal({
    domain: patientDistribution.map(d => d.name),
    range: ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c'],
  });

  return (
    <div className={`min-h-screen   ${theme === 'dark' ? 'bg-black text-white' : 'bg-gray-100 text-gray-900'} p-6`}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center">
          <RiMentalHealthLine className="mr-2" /> Therapist Dashboard
        </h1>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={<RiTimeLine />}
            title="Upcoming Sessions"
            value={data.dashboard.stats.upcomingSessions}
            description="Next 7 days"
          />
          
          <StatCard 
            icon={<RiUserLine />}
            title="Active Patients"
            value={data.dashboard.stats.activePatients}
            description="Current caseload"
          />
          
          <StatCard 
            icon={<RiAlertLine />}
            title="Crisis Cases"
            value={data.dashboard.stats.crisisCases}
            description="Require immediate attention"
          />
          
          <StatCard 
            icon={<RiBarChartLine />}
            title="Follow-ups Needed"
            value={data.dashboard.stats.followUpsNeeded}
            description="Pending follow-up sessions"
          />
        </div>
        
        {/* Charts Row */}
        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          <div className={`p-6 rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} flex-1`}>
            <h3 className="text-xl font-semibold mb-4">Weekly Sessions</h3>
            <svg width={barWidth} height={barHeight}>
              <Group left={margin.left} top={margin.top}>
                {weeklySessions.map((d) => {
                  const barWidth = xScale.bandwidth();
                  const barHeight = yMax - (yScale(d.sessions) || 0);
                  const barX = xScale(d.name) || 0;
                  const barY = yMax - barHeight;
                  
                  return (
                    <Bar
                      key={`bar-${d.name}`}
                      x={barX}
                      y={barY}
                      width={barWidth}
                      height={barHeight}
                      fill="#8884d8"
                    />
                  );
                })}
                <AxisLeft 
                  scale={yScale} 
                  stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                  tickStroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                  tickLabelProps={() => ({
                    fill: theme === 'dark' ? '#E5E7EB' : '#4B5563',
                    fontSize: 11,
                    textAnchor: 'end',
                  })}
                />
                <AxisBottom
                  scale={xScale}
                  top={yMax}
                  stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                  tickStroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                  tickLabelProps={() => ({
                    fill: theme === 'dark' ? '#E5E7EB' : '#4B5563',
                    fontSize: 11,
                    textAnchor: 'middle',
                  })}
                />
              </Group>
            </svg>
          </div>
          
          <div className={`p-6 rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} flex-1`}>
            <h3 className="text-xl font-semibold mb-4">Patient Distribution by Condition</h3>
            <div className="flex flex-col lg:flex-row items-center">
              <svg width={pieWidth} height={pieHeight}>
                <Group top={pieHeight / 2} left={half}>
                  <Pie
                    data={patientDistribution}
                    pieValue={(d) => d.value}
                    outerRadius={half - 20}
                    innerRadius={half - 60}
                    padAngle={0.01}
                  >
                    {(pie) => {
                      return pie.arcs.map((arc, index) => {
                        const [centroidX, centroidY] = pie.path.centroid(arc);
                        const arcPath = pie.path(arc);
                        const arcFill = pieScale(arc.data.name);
                        
                        return (
                          <g key={`arc-${index}`}>
                            <path d={arcPath || ''} fill={arcFill} />
                            <Text
                              x={centroidX}
                              y={centroidY}
                              dy=".33em"
                              fontSize={12}
                              fontWeight="bold"
                              textAnchor="middle"
                              fill="#fff"
                            >
                              {arc.data.value}%
                            </Text>
                          </g>
                        );
                      });
                    }}
                  </Pie>
                </Group>
              </svg>
              <div className="mt-4 lg:mt-0 lg:ml-8">
                {patientDistribution.map((d, i) => (
                  <div key={`legend-${i}`} className="flex items-center mb-2">
                    <span 
                      className="w-4 h-4 rounded-full mr-2"
                      style={{ backgroundColor: pieScale(d.name) }}
                    />
                    <span>{d.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Patient Profiles */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <RiUserLine className="mr-2" /> Active Patients
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.patients.active.map(patient => (
              <ProfileCard key={patient.id} patient={patient} />
            ))}
          </div>
        </div>
        
        {/* Upcoming Sessions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <RiTimeLine className="mr-2" /> Upcoming Sessions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.sessions.upcoming.map(session => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        </div>
        
        {/* Crisis Overview */}
        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <RiAlertLine className="mr-2" /> Crisis Cases
          </h2>
          {data.crisis.active.length > 0 ? (
            <div className="space-y-4">
              {data.crisis.active.map(crisisCase => (
                <div 
                  key={crisisCase.id} 
                  className={`p-4 rounded-lg shadow ${
                    crisisCase.severity.toLowerCase() === 'high' ? 'bg-red-100 dark:bg-red-900' :
                    crisisCase.severity.toLowerCase() === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900' :
                    'bg-orange-100 dark:bg-orange-900'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{crisisCase.patient} - {crisisCase.type}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      crisisCase.severity.toLowerCase() === 'high' ? 'bg-red-200 text-red-900 dark:bg-red-700 dark:text-red-100' :
                      crisisCase.severity.toLowerCase() === 'medium' ? 'bg-yellow-200 text-yellow-900 dark:bg-yellow-700 dark:text-yellow-100' :
                      'bg-orange-200 text-orange-900 dark:bg-orange-700 dark:text-orange-100'
                    }`}>
                      {crisisCase.severity} Priority
                    </span>
                  </div>
                  <div className="mt-2 space-y-1">
                    <p><strong className="text-gray-600 dark:text-gray-400">Severity:</strong> {crisisCase.severity}</p>
                    <p><strong className="text-gray-600 dark:text-gray-400">Status:</strong> {crisisCase.status}</p>
                    <p className="mt-2">{crisisCase.description}</p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm">
                      Take Action
                    </button>
                    <button className="px-3 py-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md text-sm">
                      Contact Patient
                    </button>
                    <button className="px-3 py-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md text-sm">
                      Escalate
                    </button>
                    <button className="px-3 py-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md text-sm">
                      Document
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`p-6 rounded-lg shadow text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <p>No active crisis cases</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;