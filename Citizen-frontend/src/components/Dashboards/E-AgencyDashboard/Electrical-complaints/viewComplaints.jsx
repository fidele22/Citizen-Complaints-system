import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ComplaintList.css';

const ComplaintList = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const complaintsPerPage = 6;
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showResponseBox, setShowResponseBox] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [updatedStatus, setUpdatedStatus] = useState('');
  const [respondToComplaintId, setRespondToComplaintId] = useState(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await axios.get(
          'http://localhost:5000/api/complaints/get-categorized-complaints?category=Electricity'
        );
        setComplaints(res.data);
        setFilteredComplaints(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching complaints:', err);
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  useEffect(() => {
    let filtered = complaints;

    if (statusFilter) {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }

    if (startDate) {
      filtered = filtered.filter(
        (c) => new Date(c.submittedAt) >= new Date(startDate)
      );
    }

    if (endDate) {
      filtered = filtered.filter(
        (c) => new Date(c.submittedAt) <= new Date(endDate)
      );
    }

    setFilteredComplaints(filtered);
    setCurrentPage(1);
  }, [statusFilter, startDate, endDate, complaints]);

  const totalPages = Math.ceil(filteredComplaints.length / complaintsPerPage);
  const indexOfLast = currentPage * complaintsPerPage;
  const indexOfFirst = indexOfLast - complaintsPerPage;
  const currentComplaints = filteredComplaints.slice(indexOfFirst, indexOfLast);

  const goToNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleRespondClick = (complaintId) => {
    setRespondToComplaintId(complaintId);
    setShowResponseBox(true);
    setResponseText('');
    setUpdatedStatus('');
  };

  const handleSubmitResponse = async () => {
    try {
      await axios.put(`http://localhost:5000/api/complaints/update-complaints/${respondToComplaintId}`, {
        response: responseText,
        status: updatedStatus
      });

      // Refresh data
      const updated = complaints.map((c) =>
        c._id === respondToComplaintId
          ? { ...c, status: updatedStatus, response: responseText }
          : c
      );

      setComplaints(updated);
      setFilteredComplaints(updated);
      setShowResponseBox(false);
    } catch (err) {
      console.error('Error submitting response:', err);
    }
  };

  if (loading) return <p>Loading complaints...</p>;

  return (
    <div className="complaint-container">
      <h2>Electricity Complaints</h2>

      {/* Filters */}
      <div className="filters">
        <div className="filters-option">
          <label>Select Status</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        <div className="date-range">
          <div>
            <label>Start date</label><br />
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div>
            <label>End date</label><br />
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Complaint Cards */}
      <div className="complaint-grid">
        {currentComplaints.map((c) => (
          <div
            key={c._id}
            className={`complaint-card ${c.status.toLowerCase().replace(/\s/g, '-')}`}
          >
            <h3>{c.firstName} {c.lastName}</h3>
            <p><strong>Category:</strong> {c.category}</p>
            <p><strong>Description:</strong> {c.description.slice(0, 50)}...</p>
            <p><strong>Ticket ID:</strong> {c.ticketId || 'N/A'}</p>
            <p><strong>Status:</strong> <span className="status">{c.status}</span></p>
            <p><strong>Submitted:</strong> {new Date(c.submittedAt).toLocaleString()}</p>
            
            {/* Buttons */}
            <div className="card-buttons">
              <button className='view-detail-btn' onClick={() => setSelectedComplaint(c)}>View Details</button>
              <button
    onClick={() => handleRespondClick(c._id)}
    disabled={c.status === 'Resolved'}
    style={{
      backgroundColor: c.status === 'Resolved' ? '#ccc' : '',
      cursor: c.status === 'Resolved' ? 'not-allowed' : 'pointer'
    }}
  >
    Respond
    </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button onClick={goToPrevious} disabled={currentPage === 1}>Previous</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={goToNext} disabled={currentPage === totalPages}>Next</button>
      </div>

      {/* Complaint Details Modal */}
      {selectedComplaint && (
        <div className="complaint-details-overlay">
          <div className="complaint-details">
            <button className="close-btn" onClick={() => setSelectedComplaint(null)}>X</button>
            <h2>Complaint Details</h2>

            <div className="details-section">
              <h3>🧑 Person Information</h3>
              <p><strong>First Name:</strong> {selectedComplaint.firstName}</p>
              <p><strong>Last Name:</strong> {selectedComplaint.lastName}</p>
              <p><strong>Provence:</strong> {selectedComplaint.provence}</p>
              <p><strong>District:</strong> {selectedComplaint.district}</p>
              <p><strong>Notification channel:</strong> {selectedComplaint.notifyValue}</p>
            </div>

            <div className="details-section">
              <h3>📋 Complaint Information</h3>
              <p><strong>Category:</strong> {selectedComplaint.category}</p>
              <p><strong>Status:</strong> {selectedComplaint.status}</p>
              <p><strong>Ticket ID:</strong> {selectedComplaint.ticketId || 'N/A'}</p>
              <p><strong>Submitted At:</strong> {new Date(selectedComplaint.submittedAt).toLocaleString()}</p>
              <p><strong>Complaint Description:</strong> {selectedComplaint.description}</p>
            </div>

            <div className="details-section">
              <h3>📋 Response Information</h3>
              <p><strong>Complaint Response:</strong> {selectedComplaint.response}</p>
            </div>
          </div>
        </div>
      )}

      {/* Response Overlay Box */}
      {showResponseBox && (
        <div className="response-overlay">
          <div className="response-box">
            <h3>Respond to Complaint</h3>
            <textarea
              rows="4"
              placeholder="Write your response here..."
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
            ></textarea>
            <div>
              <label>Status:</label>
              <select value={updatedStatus} onChange={(e) => setUpdatedStatus(e.target.value)}>
                <option value="">Select status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
            <div className="response-buttons">
              <button  onClick={handleSubmitResponse}>Submit</button>
              <button onClick={() => setShowResponseBox(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintList;
