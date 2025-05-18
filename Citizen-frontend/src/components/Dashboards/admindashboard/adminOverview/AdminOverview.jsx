import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './overviewadmin.css';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';


const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F', '#FFBB28', '#FF4444'];
const StatusOverview = () => {
  const [statusSummary, setStatusSummary] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const userRole = sessionStorage.getItem('role');
  const allRoles = [
    { title: 'HEALTH', color: '#4e73df', icon: '📋' },
    { title: 'ELECTRICITY', color: '#1cc88a', icon: '🛠️' },
  
  ];
  
  const currentRoleCard = allRoles.find((role) => role.title === userRole);
  
  useEffect(() => {
    const fetchUser = async () => {
      const tabId = sessionStorage.getItem('currentTab');
      const token = sessionStorage.getItem(`token_${tabId}`);

      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/authentication/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/complaints/overview-data');
        setData(res.data);
      } catch (err) {
        console.error('Failed to fetch overview:', err);
      }
    };
    fetchOverview();
  }, []);

  if (!data) return <p>Loading overview...</p>;


  return (
    <div>
      {!loading && user && (
        <div className="welcome-box">
          <h2>👋 Welcome back, <span>{user.lastName}</span>!</h2>
          <p>We're glad to see you again. Here's an overview of company work statuses.</p>
        </div>
      )}

      {error && <p className="error-text">Error: {error}</p>}

      {currentRoleCard && (
  <div className="role-badge">
    <div
      className="role-card"
     
    >
      <div className="role-icon">{currentRoleCard.icon}</div>
      <div className="role-title">{currentRoleCard.title}</div>
    </div>
  </div>
)}


<div className="metrics">
        <div className="metric-card total">
          <h3>Total Complaints</h3>
          <p>{data.total}</p>
        </div>
        {Object.entries(data.statusCounts).map(([status, count]) => (
          <div key={status} className={`metric-card ${status.toLowerCase().replace(/\s/g, '-')}`}>
            <h3>{status}</h3>
            <p>{count}</p>
          </div>
        ))}
      </div>

      <div className="section">
        <h3>Electricity Complaints by Province</h3>
        <div className="province-cards">
          {data.electricityByProvince.map((item, i) => (
            <div key={i} className="province-card">
              <p><strong>{item.province}</strong></p>
              <p>{item.count} Complaints</p>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <h3>Complaint Category Distribution</h3>
        <div className="category-pie">
          {Object.entries(data.categoryCounts).map(([category, count]) => (
            <div key={category} className="category-segment">
              <span className="dot"></span>
              <p>{category} - {count}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <h3>Latest Complaints</h3>
        <div className="table-container">
        <table className="complaints-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Status</th>
              <th>Province</th>
              <th>Submitted</th>
            </tr>
          </thead>
          <tbody>
            {data.latestComplaints.map((c, i) => (
              <tr key={i}>
                <td>{c.fullname}</td>
                <td>{c.category}</td>
                <td>{c.status}</td>
                <td>{c.province}</td>
                <td>{new Date(c.submittedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>

  );
};

export default StatusOverview;
