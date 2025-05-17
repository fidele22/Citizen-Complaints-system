import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaTimes, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2';
import AddUser from './AddUser';
import '../css/users.css';
import '../css/AddUser.css';
import '../css/swal-model.css';


const ViewItems = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [usersPerPage] = useState(5);
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    role: '',
  });

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/userdata/users`);
      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        console.error("Received data is not an array:", response.data);
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const [roles, setRoles] = useState([]);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const fetchUserRoles = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/roles`);
        setRoles(response.data);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };
    fetchUserRoles();
  }, []);

  const handleEditClick = (user) => {
    setEditingUser(user._id);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      email: user.email,
      role: user.role ? user.role._id : '',
    });
  };

  const handleDeleteClick = async (userId) => {
    const { value: isConfirmed } = await Swal.fire({
      title: 'Are you sure you want to delete this user?',
      text: "You won't be able to recover this user!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      customClass: { popup: 'custom-swal' }
    });

    if (isConfirmed) {
      try {
        await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/userdata/${userId}`);
        setUsers(users.filter(user => user._id !== userId));
        Swal.fire({
          title: 'Deleted!',
          text: 'User has been deleted.',
          icon: 'success',
          customClass: { popup: 'custom-swal' },
        });
      } catch (error) {
        console.error('Error deleting user:', error);
        Swal.fire('Error!', 'Failed to delete this user.', 'error');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/userdata/${editingUser}`, formData, {
        headers: { 'Content-Type': 'application/json' }
      });

      const updatedRole = roles.find(role => role._id === formData.role);
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === editingUser
            ? { ...user, ...formData, role: updatedRole || { _id: formData.role } }
            : user
        )
      );

      Swal.fire({
        title: 'Success!',
        text: 'User data updated successfully',
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: { popup: 'custom-swal' },
      });
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
      setModalMessage('Error updating user');
      Swal.fire({
        title: 'Error!',
        text: 'Failed to update user data',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: { popup: 'custom-swal' },
      });
    }
  };

  const handleCloseForm = () => {
    setEditingUser(null);
  };

  // Filter users by search term only
  const filteredUsers = users.filter(user =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  return (
    <div className="view-users">
      <div className="users-headers-title">
        <h2>System User Management</h2>
        <button className="add-new-user-btn" onClick={() => setShowAddUserForm(true)}><FaPlus /></button>
      </div>

      {/* Removed toggle buttons for employees/clients */}

      <div className='items-table'>
        <div className="searchbar">
          <input
            type="text"
            placeholder="Search by first name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="user-cards-container">
          {currentUsers.map(user => (
     <div key={user._id} className="user-card">
     <div className="user-card-avatar">
       {/* Using initials avatar */}
       <div className="avatar">
         {user.firstName[0].toUpperCase()}{user.lastName[0]?.toUpperCase() || ''}
       </div>
       {/* Or, to use icon instead, replace above div with:
       <FaUserCircle size={64} color="#4a90e2" />
       */}
     </div>
   
     <div className="user-card-info">
       <h3>{user.firstName} {user.lastName}</h3>
       <span className="user-role">{user.role?.name || 'No Role'} institution Agency</span>
       <p><strong>Email:</strong> {user.email}</p>
       <p><strong>Phone:</strong> {user.phone}</p>
     </div>
   
     <div className="user-card-actions">
       <FaEdit className="icon edit" onClick={() => handleEditClick(user)} />
       <FaTrash className="icon delete" onClick={() => handleDeleteClick(user._id)} />
     </div>
   </div>
   
    
          ))}
        </div>

        <div className="pagination-controls">
          <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
        </div>

        {/* Add User Form */}
        {showAddUserForm && (
          <div className="add-overlay">
            <div className="add-user-form-container">
              <button className="close-adduser-form" onClick={() => setShowAddUserForm(false)}>
                <FaTimes size={32} />
              </button>
              <AddUser onUserAdded={() => {
                fetchUsers();
                setShowAddUserForm(false);
              }} />
            </div>
          </div>
        )}

        {/* Edit User Form */}
        {editingUser && (
          <div className="editing-userdata-ovelay">
            <div className="editinguser-form">
              <form onSubmit={handleSubmit}>
                <button className='edit-user-close-btn' onClick={handleCloseForm}>
                  <FaTimes size={44} />
                </button>
                <h2>Edit User</h2>
                <label>First Name</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
                <label>Last Name</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
                <label>Phone</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
                <label>Email</label>
                <input type="text" name="email" value={formData.email} onChange={handleChange} />
                <label>Role</label>
                <select name="role" value={formData.role} onChange={handleChange}>
                  <option value="">Select Role</option>
                  {roles.map((role) => (
                    <option key={role._id} value={role._id}>{role.name}</option>
                  ))}
                </select>
                <button type="submit" className='update-user-btn'>Update</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewItems;
