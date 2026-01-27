import React, { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon } from 'lucide-react';

const CHART_TYPES = {
  BAR: 'bar',
  LINE: 'line',
  PIE: 'pie',
};

const INNOVA_COLORS = [
  '#00A99D', // Teal
  '#FF6F3C', // Orange
  '#FFC857', // Yellow
  '#27AE60', // Green
  '#3498DB', // Blue
  '#9B59B6', // Purple
];

/**
 * Interactive Chart Component for Visual Mode
 * Allows students to switch between different chart types to find
 * the visualization that makes the most sense to them
 */
const InteractiveChart = ({ 
  data, 
  title, 
  description,
  defaultType = CHART_TYPES.BAR,
  xKey = 'name',
  yKey = 'value',
  showTypeSelector = true,
}) => {
  const [chartType, setChartType] = useState(defaultType);

  const renderChart = () => {
    switch (chartType) {
      case CHART_TYPES.BAR:
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DEE2E6" />
              <XAxis dataKey={xKey} stroke="#6C757D" />
              <YAxis stroke="#6C757D" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #DEE2E6',
                  borderRadius: '0.5rem'
                }}
              />
              <Legend />
              <Bar dataKey={yKey} fill={INNOVA_COLORS[0]} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case CHART_TYPES.LINE:
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DEE2E6" />
              <XAxis dataKey={xKey} stroke="#6C757D" />
              <YAxis stroke="#6C757D" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #DEE2E6',
                  borderRadius: '0.5rem'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey={yKey} 
                stroke={INNOVA_COLORS[0]} 
                strokeWidth={3}
                dot={{ fill: INNOVA_COLORS[0], r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case CHART_TYPES.PIE:
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey={yKey}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={INNOVA_COLORS[index % INNOVA_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>

        {showTypeSelector && (
          <div className="flex gap-2">
            <button
              onClick={() => setChartType(CHART_TYPES.BAR)}
              className={`p-2 rounded-lg transition-colors ${
                chartType === CHART_TYPES.BAR
                  ? 'bg-innova-teal-100 text-innova-teal-700 dark:bg-innova-teal-900/30 dark:text-innova-teal-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
              }`}
              title="Bar Chart"
            >
              <BarChart3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setChartType(CHART_TYPES.LINE)}
              className={`p-2 rounded-lg transition-colors ${
                chartType === CHART_TYPES.LINE
                  ? 'bg-innova-teal-100 text-innova-teal-700 dark:bg-innova-teal-900/30 dark:text-innova-teal-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
              }`}
              title="Line Chart"
            >
              <LineChartIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setChartType(CHART_TYPES.PIE)}
              className={`p-2 rounded-lg transition-colors ${
                chartType === CHART_TYPES.PIE
                  ? 'bg-innova-teal-100 text-innova-teal-700 dark:bg-innova-teal-900/30 dark:text-innova-teal-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
              }`}
              title="Pie Chart"
            >
              <PieChartIcon className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      <div className="mt-4">
        {renderChart()}
      </div>

      <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
        Switch between chart types to find the visualization that works best for you
      </p>
    </div>
  );
};

export default InteractiveChart;
