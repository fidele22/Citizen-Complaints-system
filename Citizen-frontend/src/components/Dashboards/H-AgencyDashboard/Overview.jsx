import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './overview.css';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import './overview.css';

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
  const [HealthcareComplaints, setHealthComplaints] = useState([]);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/complaints/overview-health-data');
        const { total, pending, inProgress, resolved, latestThree, allComplaints } = res.data;
  
        setHealthComplaints(allComplaints);
        setData({ total, pending, inProgress, resolved, latestThree });
  
      } catch (err) {
        console.error('Error fetching complaints:', err);
      }
    };
  
    fetchComplaints();
  }, []);
  

  // Group complaints by province
  const provinceCounts = HealthcareComplaints.reduce((acc, complaint) => {
    const prov = complaint.provence;
    acc[prov] = (acc[prov] || 0) + 1;
    return acc;
  }, {});

  const total = HealthcareComplaints.length;
  const pending = HealthcareComplaints.filter(c => c.status === 'Pending').length;
  const inProgress = HealthcareComplaints.filter(c => c.status === 'In Progress').length;
  const resolved = HealthcareComplaints.filter(c => c.status === 'Resolved').length;


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


<h4>HealthCare Complaints Overview</h4>

{/* Summary Stats */}
<div className="metrics">
  <div className="metric-card total">
    <h3>Total</h3>
    <p>{data?.total || 0}</p>
  </div>
  <div className="metric-card pending">
    <h3>Pending</h3>
    <p>{pending}</p>
  </div>
  <div className="metric-card in-progress">
    <h3>In Progress</h3>
    <p>{inProgress}</p>
  </div>
  <div className="metric-card resolved">
    <h3>Resolved</h3>
    <p>{resolved}</p>
  </div>
</div>

{/* Province Breakdown */}
<div className="section">
  <h3>Complaints by Province</h3>
  <div className="province-cards">
    {Object.entries(provinceCounts).map(([province, count]) => (
      <div key={province} className="province-card">
        <strong>{province}</strong>
        <p>{count} complaints</p>
      </div>
    ))}
  </div>
</div>

      {/* Latest Complaints */}
<div className="section latest-complaints">
  <h3>3 latest Complaints</h3>
  <table className="latest-table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Province</th>
        <th>Status</th>
        <th>Ticket ID</th>
        <th>Submitted</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
    {data?.latestThree.map((c) => (
  <tr key={c._id}>
    <td>{c.firstName} {c.lastName}</td>
    <td>{c.provence}</td>
    <td className={`status ${c.status.toLowerCase().replace(/\s/g, '-')}`}>{c.status}</td>
    <td>{c.ticketId || 'N/A'}</td>
    <td>{new Date(c.submittedAt).toLocaleString()}</td>
    <td>{c.description.length > 60 ? c.description.slice(0, 60) + '...' : c.description}</td>
  </tr>
))}

    </tbody>
  </table>
</div>

      </div>
 

  );
};

export default StatusOverview;
