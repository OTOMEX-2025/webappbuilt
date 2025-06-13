import { RiBarChartLine } from 'react-icons/ri';
import data from '../../../backend/data.json';

// Visx imports
import { Bar, LinePath } from '@visx/shape';
import { Group } from '@visx/group';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import { Pie } from '@visx/shape';
import { Text } from '@visx/text';
import { Grid } from '@visx/grid';

const AnalysisPage = () => {
  // Extract data from data.json
  const { analysis } = data;
  const { sessionTrends, sessionTypes, studentStatus, yearlyComparison } = analysis;

  // Chart dimensions and margins
  const chartWidth = 500;
  const chartHeight = 300;
  const margin = { top: 20, bottom: 50, left: 60, right: 20 };

  // Line Chart Configuration
  const lineXScale = scaleBand({
    range: [0, chartWidth - margin.left - margin.right],
    domain: sessionTrends.map(d => d.month),
    padding: 0.4,
  });

  const lineYScale = scaleLinear({
    range: [chartHeight - margin.top - margin.bottom, 0],
    domain: [0, Math.max(...sessionTrends.map(d => d.sessions)) + 5],
  });

  // Pie Chart Configuration
  const pieScale = scaleOrdinal({
    domain: sessionTypes.map(d => d.name),
    range: ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'],
  });

  // Bar Chart Configuration
  const barXScale = scaleBand({
    range: [0, chartWidth - margin.left - margin.right],
    domain: yearlyComparison.map(d => d.year),
    padding: 0.4,
  });

  const barYScale = scaleLinear({
    range: [chartHeight - margin.top - margin.bottom, 0],
    domain: [0, Math.max(...yearlyComparison.map(d => d.sessions)) + 50],
  });

  return (
    <div className="analysis-container">
      <h1><RiBarChartLine /> Counseling Analysis</h1>
      
      <div className="analysis-filters">
        <select>
          <option>Current Semester</option>
          <option>Last Semester</option>
          <option>This Academic Year</option>
          <option>Custom Range</option>
        </select>
        <select>
          <option>All Students</option>
          <option>By Year</option>
          <option>By Major</option>
          <option>By Status</option>
        </select>
        <button>Apply Filters</button>
        <button>Export Data</button>
      </div>
      
      <div className="chart-row">
        {/* Monthly Session Trends (Line Chart) */}
        <div className="chart-container">
          <h3>Monthly Session Trends</h3>
          <svg width={chartWidth} height={chartHeight}>
            <Group left={margin.left} top={margin.top}>
              <Grid
                width={chartWidth - margin.left - margin.right}
                height={chartHeight - margin.top - margin.bottom}
                xScale={lineXScale}
                yScale={lineYScale}
                stroke="#e0e0e0"
              />
              <LinePath
                data={sessionTrends}
                x={d => lineXScale(d.month) + lineXScale.bandwidth() / 2}
                y={d => lineYScale(d.sessions)}
                stroke="#8884d8"
                strokeWidth={2}
              />
              {sessionTrends.map((d, i) => (
                <circle
                  key={i}
                  cx={lineXScale(d.month) + lineXScale.bandwidth() / 2}
                  cy={lineYScale(d.sessions)}
                  r={4}
                  fill="#8884d8"
                />
              ))}
              <AxisLeft scale={lineYScale} />
              <AxisBottom
                scale={lineXScale}
                top={chartHeight - margin.top - margin.bottom}
                tickLabelProps={() => ({
                  fill: '#666',
                  fontSize: 11,
                  textAnchor: 'middle',
                })}
              />
            </Group>
          </svg>
        </div>
        
        {/* Session Type Distribution (Pie Chart) */}
        <div className="chart-container">
          <h3>Session Type Distribution</h3>
          <svg width={chartWidth / 2} height={chartHeight}>
            <Group top={chartHeight / 2} left={chartWidth / 4}>
              <Pie
                data={sessionTypes}
                pieValue={d => d.value}
                outerRadius={chartWidth / 6}
                innerRadius={chartWidth / 8}
                padAngle={0.01}
              >
                {(pie) => pie.arcs.map((arc, i) => {
                  const [centroidX, centroidY] = pie.path.centroid(arc);
                  const arcPath = pie.path(arc);
                  const arcFill = pieScale(arc.data.name);
                  
                  return (
                    <g key={`arc-${i}`}>
                      <path d={arcPath} fill={arcFill} />
                      <Text
                        x={centroidX}
                        y={centroidY}
                        dy=".33em"
                        fontSize={10}
                        textAnchor="middle"
                        fill="#fff"
                      >
                        {arc.data.value}%
                      </Text>
                    </g>
                  );
                })}
              </Pie>
            </Group>
            <foreignObject x={chartWidth / 2} y={20} width={chartWidth / 2} height={chartHeight - 40}>
              <div className="pie-legend">
                {sessionTypes.map((d, i) => (
                  <div key={`legend-${i}`} className="legend-item">
                    <span 
                      className="legend-color" 
                      style={{ backgroundColor: pieScale(d.name) }}
                    />
                    <span className="legend-label">{d.name}</span>
                  </div>
                ))}
              </div>
            </foreignObject>
          </svg>
        </div>
      </div>
      
      <div className="chart-row">
        {/* Student Status Overview (Pie Chart) */}
        <div className="chart-container">
          <h3>Student Status Overview</h3>
          <svg width={chartWidth / 2} height={chartHeight}>
            <Group top={chartHeight / 2} left={chartWidth / 4}>
              <Pie
                data={studentStatus}
                pieValue={d => d.value}
                outerRadius={chartWidth / 6}
                innerRadius={chartWidth / 8}
                padAngle={0.01}
              >
                {(pie) => pie.arcs.map((arc, i) => {
                  const [centroidX, centroidY] = pie.path.centroid(arc);
                  const arcPath = pie.path(arc);
                  const arcFill = ['#8884d8', '#ffc658', '#ff8042'][i];
                  
                  return (
                    <g key={`arc-${i}`}>
                      <path d={arcPath} fill={arcFill} />
                      <Text
                        x={centroidX}
                        y={centroidY}
                        dy=".33em"
                        fontSize={10}
                        textAnchor="middle"
                        fill="#fff"
                      >
                        {arc.data.value}%
                      </Text>
                    </g>
                  );
                })}
              </Pie>
            </Group>
            <foreignObject x={chartWidth / 2} y={20} width={chartWidth / 2} height={chartHeight - 40}>
              <div className="pie-legend">
                {studentStatus.map((d, i) => (
                  <div key={`legend-${i}`} className="legend-item">
                    <span 
                      className="legend-color" 
                      style={{ backgroundColor: ['#8884d8', '#ffc658', '#ff8042'][i] }}
                    />
                    <span className="legend-label">{d.name}</span>
                  </div>
                ))}
              </div>
            </foreignObject>
          </svg>
        </div>
        
        {/* Yearly Comparison (Bar Chart) */}
        <div className="chart-container">
          <h3>Yearly Comparison</h3>
          <svg width={chartWidth} height={chartHeight}>
            <Group left={margin.left} top={margin.top}>
              <Grid
                width={chartWidth - margin.left - margin.right}
                height={chartHeight - margin.top - margin.bottom}
                xScale={barXScale}
                yScale={barYScale}
                stroke="#e0e0e0"
              />
              {yearlyComparison.map((d) => {
                const barWidth = barXScale.bandwidth();
                const barHeight = (chartHeight - margin.top - margin.bottom) - (barYScale(d.sessions) || 0);
                const barX = barXScale(d.year) || 0;
                const barY = (chartHeight - margin.top - margin.bottom) - barHeight;
                
                return (
                  <Bar
                    key={`bar-${d.year}`}
                    x={barX}
                    y={barY}
                    width={barWidth}
                    height={barHeight}
                    fill="#8884d8"
                  />
                );
              })}
              <AxisLeft scale={barYScale} />
              <AxisBottom
                scale={barXScale}
                top={chartHeight - margin.top - margin.bottom}
                tickLabelProps={() => ({
                  fill: '#666',
                  fontSize: 11,
                  textAnchor: 'middle',
                })}
              />
            </Group>
          </svg>
        </div>
      </div>
      
      {/* Rest of the component remains the same */}
      <div className="key-metrics">
        <h2>Key Metrics</h2>
        <div className="metrics-grid">
          <div className="metric-card">
            <h3>Average Session Duration</h3>
            <p className="metric-value">42 mins</p>
            <p className="metric-change">+5% from last semester</p>
          </div>
          <div className="metric-card">
            <h3>Student Satisfaction</h3>
            <p className="metric-value">4.7/5</p>
            <p className="metric-change">+0.2 from last semester</p>
          </div>
          <div className="metric-card">
            <h3>Emergency Cases</h3>
            <p className="metric-value">8</p>
            <p className="metric-change">-3 from last semester</p>
          </div>
          <div className="metric-card">
            <h3>Follow-up Rate</h3>
            <p className="metric-value">78%</p>
            <p className="metric-change">+12% from last semester</p>
          </div>
        </div>
      </div>
      
      <div className="insights-section">
        <h2>Insights & Recommendations</h2>
        <ul>
          <li>Academic advising sessions peak in April during course registration period</li>
          <li>Increase in personal counseling sessions correlates with midterm exams</li>
          <li>Consider adding evening availability during high-demand periods</li>
          <li>Freshmen represent 60% of "At Risk" students - consider targeted outreach</li>
        </ul>
      </div>
    </div>
  );
};

export default AnalysisPage;