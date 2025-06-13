import { RiDashboardLine, RiUserLine, RiTimeLine, RiAlertLine, RiBarChartLine, RiMentalHealthLine } from 'react-icons/ri';
import data from '../../../backend/data.json';
import styles from './dashboard.module.css';

// Visx imports
import { Bar } from '@visx/shape';
import { Group } from '@visx/group';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import { Pie } from '@visx/shape';
import { Text } from '@visx/text';

// Reusable Components
const StatCard = ({ icon, title, value, description }) => (
  <div className={styles.statCard}>
    <h3>{icon} {title}</h3>
    <p className={styles.statValue}>{value}</p>
    <p className={styles.statLabel}>{description}</p>
  </div>
);

const ProfileCard = ({ patient }) => (
  <div className={styles.profileCard}>
    <div className={styles.profileHeader}>
      <img src={patient.image || '/default-avatar.jpg'} alt={patient.name} />
      <div>
        <h4>{patient.name}</h4>
        <p>{patient.age} years • {patient.gender}</p>
      </div>
    </div>
    <div className={styles.profileDetails}>
      <p><strong>Condition:</strong> {patient.primaryDiagnosis}</p>
      <p><strong>Last Session:</strong> {patient.lastSession}</p>
      <p><strong>Status:</strong> <span className={styles[`status${patient.status.replace('-', '').toLowerCase()}`]}>{patient.status}</span></p>
    </div>
  </div>
);

const SessionCard = ({ session }) => (
  <div className={styles.sessionCard}>
    <h4>{session.type} Session</h4>
    <p><strong>Patient:</strong> {session.patient}</p>
    <p><strong>When:</strong> {session.date} at {session.time}</p>
    <p><strong>Duration:</strong> {session.duration}</p>
    <p><strong>Status:</strong> {session.status}</p>
    {session.notes && <p className={styles.sessionNotes}>{session.notes}</p>}
  </div>
);

const DashboardPage = () => {
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
    <div className={styles.dashboardContainer}>
      <h1><RiMentalHealthLine /> Therapist Dashboard</h1>
      
      {/* Stats Overview */}
      <div className={styles.statsGrid}>
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
      <div className={styles.chartsRow}>
        <div className={styles.chartContainer}>
          <h3>Weekly Sessions</h3>
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
              <AxisLeft scale={yScale} />
              <AxisBottom
                scale={xScale}
                top={yMax}
                tickLabelProps={() => ({
                  fill: '#666',
                  fontSize: 11,
                  textAnchor: 'middle',
                })}
              />
            </Group>
          </svg>
        </div>
        
        <div className={styles.chartContainer}>
          <h3>Patient Distribution by Condition</h3>
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
          <div className={styles.pieLegend}>
            {patientDistribution.map((d, i) => (
              <div key={`legend-${i}`} className={styles.legendItem}>
                <span 
                  className={styles.legendColor} 
                  style={{ backgroundColor: pieScale(d.name) }}
                />
                <span className={styles.legendLabel}>{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Patient Profiles */}
      <div className={styles.profilesSection}>
        <h2><RiUserLine /> Active Patients</h2>
        <div className={styles.profileGrid}>
          {data.patients.active.map(patient => (
            <ProfileCard key={patient.id} patient={patient} />
          ))}
        </div>
      </div>
      
      {/* Upcoming Sessions */}
      <div className={styles.sessionsSection}>
        <h2><RiTimeLine /> Upcoming Sessions</h2>
        <div className={styles.sessionList}>
          {data.sessions.upcoming.map(session => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      </div>
      
      {/* Crisis Overview */}
      <div className={styles.crisisOverview}>
        <h2><RiAlertLine /> Crisis Cases</h2>
        {data.crisis.active.length > 0 ? (
          <div className={styles.crisisList}>
            {data.crisis.active.map(crisisCase => (
              <div key={crisisCase.id} className={styles.crisisAlert}>
                <h3>{crisisCase.patient} - {crisisCase.type}</h3>
                <p><strong>Severity:</strong> {crisisCase.severity}</p>
                <p><strong>Status:</strong> {crisisCase.status}</p>
                <p>{crisisCase.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No active crisis cases</p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;