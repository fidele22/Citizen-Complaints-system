import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { FaTimes } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import './rolestyling.css'; // Ensure this has your overlay and form styles

const AddRole = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/roles/addRole`, formData);
      toast.success('Role added successfully!');
      setFormData({ name: '', description: '' });
      onClose(); // Close the overlay
    } catch (error) {
      toast.error('Failed to add role!');
      console.error('Error creating service:', error);
    }
  };

  return (
    <div className="add-role-form-container">
      <div className="add-role-form">
        <button className="close-btn" onClick={onClose}><FaTimes /></button>
        <h2>Add New Role</h2>
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label>Role Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className='form-group'>
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} />
          </div>
          <button type="submit">Add Role</button>
        </form>
      </div>


    </div>
  );
};

export default AddRole;
