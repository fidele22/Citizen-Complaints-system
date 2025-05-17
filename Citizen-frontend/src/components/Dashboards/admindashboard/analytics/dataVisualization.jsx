import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import './ComplaintAnalytics.css';

const ComplaintAnalytics = () => {
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [complaints, setComplaints] = useState([]);

  const fetchComplaints = async (month, year) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/complaints/get-complaints/monthly`, {
        params: { month, year }
      });
      setComplaints(res.data);
    } catch (err) {
      console.error('Error fetching complaints:', err.message);
    }
  };

  useEffect(() => {
    fetchComplaints(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear]);

  // Grouping logic
  const groupBy = (key) => {
    return complaints.reduce((acc, item) => {
      const value = item[key] || 'Unknown';
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {});
  };

  const groupToChartData = (groupedData) =>
    Object.entries(groupedData).map(([key, count]) => ({ name: key, count }));

  const statusData = groupToChartData(groupBy('status'));
  const categoryData = groupToChartData(groupBy('category'));
  const provinceData = groupToChartData(groupBy('provence'));
  const districtData = groupToChartData(groupBy('district'));

  return (
    <div className="analytics-container">
      <h2>Complaint Analytics</h2>

      {/* Month Selector */}
      <div className="filter-section">
        <label>Select Month:</label>
        <select value={selectedMonth} onChange={e => setSelectedMonth(parseInt(e.target.value))}>
          {[...Array(12).keys()].map(m => (
            <option key={m} value={m + 1}>
              {new Date(0, m).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>
        <select value={selectedYear} onChange={e => setSelectedYear(parseInt(e.target.value))}>
          {[2023, 2024, 2025].map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      <div className="analytics-box total">
        <h3>Total Complaints in {new Date(0, selectedMonth - 1).toLocaleString('default', { month: 'long' })}:</h3>
        <p>{complaints.length}</p>
      </div>

      {/* Charts */}
      <div className="chart-grid">
  <div className="analytics-chart">
    <h3>By Status</h3>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={statusData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#4caf50" />
      </BarChart>
    </ResponsiveContainer>
  </div>

  <div className="analytics-chart">
    <h3>By Category</h3>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={categoryData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#ff9800" />
      </BarChart>
    </ResponsiveContainer>
  </div>

  <div className="analytics-chart">
    <h3>By Province</h3>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={provinceData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#2196f3" />
      </BarChart>
    </ResponsiveContainer>
  </div>

  <div className="analytics-chart">
    <h3>By District</h3>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={districtData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#9c27b0" />
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>

    </div>
  );
};

export default ComplaintAnalytics;
