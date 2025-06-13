import { RiDashboardLine, RiUserLine, RiTimeLine, RiAlertLine, RiBarChartLine } from 'react-icons/ri';
import data from '../../../backend/data.json';

// Visx imports
import { Bar } from '@visx/shape';
import { Group } from '@visx/group';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import { Pie } from '@visx/shape';
import { Text } from '@visx/text';

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
  const studentDistribution = data.dashboard.studentDistribution;
  const pieWidth = 300;
  const pieHeight = 300;
  const half = pieWidth / 2;
  
  const pieScale = scaleOrdinal({
    domain: studentDistribution.map(d => d.name),
    range: ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c'],
  });

  return (
    <div className="dashboard-container">
      <h1><RiDashboardLine /> Professor Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3><RiTimeLine /> Upcoming Sessions</h3>
          <p className="stat-value">{data.dashboard.stats.upcomingSessions}</p>
          <p className="stat-label">Next 7 days</p>
        </div>
        
        <div className="stat-card">
          <h3><RiUserLine /> Active Students</h3>
          <p className="stat-value">{data.dashboard.stats.activeStudents}</p>
          <p className="stat-label">Current semester</p>
        </div>
        
        <div className="stat-card">
          <h3><RiAlertLine /> Pending Requests</h3>
          <p className="stat-value">{data.dashboard.stats.pendingRequests}</p>
          <p className="stat-label">Require attention</p>
        </div>
        
        <div className="stat-card">
          <h3><RiAlertLine /> Emergency Cases</h3>
          <p className="stat-value">{data.dashboard.stats.emergencyCases}</p>
          <p className="stat-label">Active</p>
        </div>
      </div>
      
      {/* Charts Row */}
      <div className="charts-row">
        <div className="chart-container">
          <h3>Weekly Sessions</h3>
          <svg width={barWidth} height={barHeight}>
            <Group left={margin.left} top={margin.top}>
              {weeklySessions.map((d) => {
                const barWidth = xScale.bandwidth();
                const barHeight = yMax - (yScale(d.sessions) || 0); // Fixed this line
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
        
        <div className="chart-container">
          <h3>Student Distribution</h3>
          <svg width={pieWidth} height={pieHeight}>
            <Group top={pieHeight / 2} left={half}>
              <Pie
                data={studentDistribution}
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
          <div className="pie-legend">
            {studentDistribution.map((d, i) => (
              <div key={`legend-${i}`} className="legend-item">
                <span 
                  className="legend-color" 
                  style={{ backgroundColor: pieScale(d.name) }}
                />
                <span className="legend-label">{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Highlights from Analysis */}
      <div className="highlights-section">
        <h2><RiBarChartLine /> Analysis Highlights</h2>
        <div className="highlight-cards">
          <div className="highlight-card">
            <h3>Most Common Session Type</h3>
            <p>{data.analysis.sessionTypes[0].name} ({data.analysis.sessionTypes[0].value}%)</p>
          </div>
          <div className="highlight-card">
            <h3>Student Status</h3>
            <p>{data.analysis.studentStatus[0].value}% Active</p>
          </div>
          <div className="highlight-card">
            <h3>Current Month Sessions</h3>
            <p>{data.analysis.sessionTrends[data.analysis.sessionTrends.length - 1].sessions} sessions</p>
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <ul>
          {data.dashboard.recentActivity.map((activity, index) => (
            <li key={index}>{activity}</li>
          ))}
        </ul>
      </div>
      
      {/* Emergency Overview */}
      <div className="emergency-overview">
        <h3><RiAlertLine /> Emergency Overview</h3>
        <p>Active emergencies: {data.emergencies.active.length}</p>
        {data.emergencies.active.length > 0 && (
          <div className="emergency-alert">
            <p><strong>{data.emergencies.active[0].student}</strong> - {data.emergencies.active[0].type}</p>
            <p>Status: {data.emergencies.active[0].status}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;