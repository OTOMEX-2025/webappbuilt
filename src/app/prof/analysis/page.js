import { RiBarChartLine } from 'react-icons/ri';
import data from '../../../backend/data.json';
import styles from './AnalysisPage.module.css';

// Visx imports
import { Bar, LinePath } from '@visx/shape';
import { Group } from '@visx/group';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import { Pie } from '@visx/shape';
import { Text } from '@visx/text';
import { Grid } from '@visx/grid';

const AnalysisPage = () => {
  const { weeklySessions, patientDistribution } = data.dashboard;

  // Chart dimensions and margins
  const chartWidth = 500;
  const chartHeight = 300;
  const margin = { top: 20, bottom: 50, left: 60, right: 20 };

  // Line Chart Configuration
  const lineXScale = scaleBand({
    range: [0, chartWidth - margin.left - margin.right],
    domain: weeklySessions.map(d => d.name),
    padding: 0.4,
  });

  const lineYScale = scaleLinear({
    range: [chartHeight - margin.top - margin.bottom, 0],
    domain: [0, Math.max(...weeklySessions.map(d => d.sessions)) + 2],
  });

  // Pie Chart Configuration
  const pieScale = scaleOrdinal({
    domain: patientDistribution.map(d => d.name),
    range: ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c'],
  });

  return (
    <div className={styles.analysisContainer}>
      <h1 className={styles.pageTitle}><RiBarChartLine /> Therapy Analysis</h1>
      
      <div className={styles.analysisFilters}>
        <select className={styles.filterSelect}>
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>Last 3 Months</option>
          <option>Custom Range</option>
        </select>
        <select className={styles.filterSelect}>
          <option>All Patients</option>
          <option>By Diagnosis</option>
          <option>By Status</option>
        </select>
        <button className={styles.filterButton}>Apply Filters</button>
        <button className={styles.exportButton}>Export Data</button>
      </div>
      
      <div className={styles.chartRow}>
        {/* Weekly Session Trends (Line Chart) */}
        <div className={styles.chartContainer}>
          <h3>Weekly Session Trends</h3>
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
                data={weeklySessions}
                x={d => lineXScale(d.name) + lineXScale.bandwidth() / 2}
                y={d => lineYScale(d.sessions)}
                stroke="#8884d8"
                strokeWidth={2}
              />
              {weeklySessions.map((d, i) => (
                <circle
                  key={i}
                  cx={lineXScale(d.name) + lineXScale.bandwidth() / 2}
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
        
        {/* Patient Diagnosis Distribution (Pie Chart) */}
        <div className={styles.chartContainer}>
          <h3>Patient Diagnosis Distribution</h3>
          <svg width={chartWidth / 2} height={chartHeight}>
            <Group top={chartHeight / 2} left={chartWidth / 4}>
              <Pie
                data={patientDistribution}
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
            </foreignObject>
          </svg>
        </div>
      </div>
      
      <div className={styles.keyMetrics}>
        <h2>Key Metrics</h2>
        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <h3>Upcoming Sessions</h3>
            <p className={styles.metricValue}>{data.dashboard.stats.upcomingSessions}</p>
          </div>
          <div className={styles.metricCard}>
            <h3>Active Patients</h3>
            <p className={styles.metricValue}>{data.dashboard.stats.activePatients}</p>
          </div>
          <div className={styles.metricCard}>
            <h3>Crisis Cases</h3>
            <p className={styles.metricValue}>{data.dashboard.stats.crisisCases}</p>
          </div>
          <div className={styles.metricCard}>
            <h3>Follow-ups Needed</h3>
            <p className={styles.metricValue}>{data.dashboard.stats.followUpsNeeded}</p>
          </div>
        </div>
      </div>
      
      <div className={styles.insightsSection}>
        <h2>Insights & Recommendations</h2>
        <ul className={styles.insightsList}>
          <li>Tuesday has the highest session volume - consider adding availability</li>
          <li>Anxiety disorders represent the largest patient group - ensure adequate resources</li>
          <li>Monitor crisis cases closely with current count at {data.dashboard.stats.crisisCases}</li>
          <li>{data.dashboard.stats.followUpsNeeded} patients need follow-ups - prioritize scheduling</li>
        </ul>
      </div>
    </div>
  );
};

export default AnalysisPage;