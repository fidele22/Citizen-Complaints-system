import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './navbar';
import { FaTicketAlt, FaUser, FaListAlt, FaRegFileAlt, FaHourglassHalf } from 'react-icons/fa';
import './trackProgress.css';

export default function TrackComplaint() {
  const [ticketId, setTicketId] = useState('');
  const [complaint, setComplaint] = useState(null);
  const [error, setError] = useState('');

  const handleTrack = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/complaints/track/${ticketId}`);
      setComplaint(res.data);
      setError('');
    } catch (err) {
      setComplaint(null);
      setError("No complaint found with that Ticket ID.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="track-container">
        {/* Left Side */}
        <div className="track-left">
          <h1>Welcome to the Complaint Tracker</h1>
          <p>
            Use your unique Ticket ID to stay informed on your complaint progress. 
            We're here to support you every step of the way.
          </p>
          <img src="/assets/2.png" alt="" className="welcome-img" />
        </div>

        {/* Right Side */}
        <div className="track-right">
          <div className="track-form">
            <h2><FaTicketAlt style={{ marginRight: '8px' }} />Track Your Complaint</h2>

            <input
              type="text"
              value={ticketId}
              onChange={e => setTicketId(e.target.value)}
              placeholder="Enter your Ticket ID"
            />
            <button onClick={handleTrack}><FaListAlt style={{ marginRight: '8px', color:'white' }} />Get Complaint Status</button>

            {error && <p className="error">{error}</p>}

            {complaint && (
              <div className="complaint-details">
                <h3><FaRegFileAlt style={{ marginRight: '8px' }} />Complaint Details</h3>
                <p><FaTicketAlt /> <strong>Ticket ID:</strong> {complaint.ticketId}</p>
                <p><FaUser /> <strong>Name:</strong> {complaint.firstName} {complaint.lastName}</p>
                <p><FaListAlt /> <strong>Category:</strong> {complaint.category}</p>
                <p><FaRegFileAlt /> <strong>Description:</strong> {complaint.description}</p>
                <p><FaHourglassHalf /> <strong>Status:</strong> {complaint.status}</p>
                <hr />
                <h4>Response:</h4>
                  <label htmlFor="">{complaint.response || "Not yet responded"}</label>
              </div>
            )}
          </div>
        </div>
        
      </div>
      <footer className="footer">
              © 2025 City Council • About • Contact
            </footer>
    </>
  );
}
