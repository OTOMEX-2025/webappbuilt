'use client';

import { RiBarChartLine } from 'react-icons/ri';
import data from '../../../backend/data.json';
import { useTheme } from '../../../context/ThemeContext';

// Visx imports
import { Bar, LinePath } from '@visx/shape';
import { Group } from '@visx/group';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import { Pie } from '@visx/shape';
import { Text } from '@visx/text';
import { Grid } from '@visx/grid';

const AnalysisPage = () => {
  const { theme } = useTheme();
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
    <div className={`min-h-screen   ${theme === 'dark' ? 'bg-black text-white' : 'bg-gray-100 text-gray-900'} p-6`}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 flex items-center">
          <RiBarChartLine className="mr-2" /> Therapy Analysis
        </h1>
        
        <div className="flex flex-wrap gap-4 mb-8">
          <select className={`px-4 py-2 rounded-md ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 3 Months</option>
            <option>Custom Range</option>
          </select>
          <select className={`px-4 py-2 rounded-md ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}>
            <option>All Patients</option>
            <option>By Diagnosis</option>
            <option>By Status</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
            Apply Filters
          </button>
          <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md transition-colors">
            Export Data
          </button>
        </div>
        
        <div className="flex flex-wrap gap-8 mb-8">
          {/* Weekly Session Trends (Line Chart) */}
          <div className={`p-6 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
            <h3 className="text-xl font-semibold mb-4">Weekly Session Trends</h3>
            <svg width={chartWidth} height={chartHeight}>
              <Group left={margin.left} top={margin.top}>
                <Grid
                  width={chartWidth - margin.left - margin.right}
                  height={chartHeight - margin.top - margin.bottom}
                  xScale={lineXScale}
                  yScale={lineYScale}
                  stroke={theme === 'dark' ? '#374151' : '#e0e0e0'}
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
                <AxisLeft 
                  scale={lineYScale} 
                  stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                  tickStroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                  tickLabelProps={() => ({
                    fill: theme === 'dark' ? '#E5E7EB' : '#4B5563',
                    fontSize: 11,
                    textAnchor: 'end',
                  })}
                />
                <AxisBottom
                  scale={lineXScale}
                  top={chartHeight - margin.top - margin.bottom}
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
          
          {/* Patient Diagnosis Distribution (Pie Chart) */}
          <div className={`p-6 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
            <h3 className="text-xl font-semibold mb-4">Patient Diagnosis Distribution</h3>
            <div className="flex items-center">
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
              </svg>
              <div className="ml-8">
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
        
        <div className={`p-6 rounded-lg shadow-md mb-8 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
          <h2 className="text-2xl font-bold mb-6">Key Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'}`}>
              <h3 className="font-medium mb-2">Upcoming Sessions</h3>
              <p className="text-3xl font-bold text-blue-600">{data.dashboard.stats.upcomingSessions}</p>
            </div>
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'}`}>
              <h3 className="font-medium mb-2">Active Patients</h3>
              <p className="text-3xl font-bold text-blue-600">{data.dashboard.stats.activePatients}</p>
            </div>
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'}`}>
              <h3 className="font-medium mb-2">Crisis Cases</h3>
              <p className="text-3xl font-bold text-blue-600">{data.dashboard.stats.crisisCases}</p>
            </div>
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'}`}>
              <h3 className="font-medium mb-2">Follow-ups Needed</h3>
              <p className="text-3xl font-bold text-blue-600">{data.dashboard.stats.followUpsNeeded}</p>
            </div>
          </div>
        </div>
        
        <div className={`p-6 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
          <h2 className="text-2xl font-bold mb-4">Insights & Recommendations</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Tuesday has the highest session volume - consider adding availability</li>
            <li>Anxiety disorders represent the largest patient group - ensure adequate resources</li>
            <li>Monitor crisis cases closely with current count at {data.dashboard.stats.crisisCases}</li>
            <li>{data.dashboard.stats.followUpsNeeded} patients need follow-ups - prioritize scheduling</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;