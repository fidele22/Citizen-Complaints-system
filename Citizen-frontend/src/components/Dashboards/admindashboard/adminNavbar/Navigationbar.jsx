import React, { useEffect,useState, useRef } from 'react';
import axios from 'axios';
import { FaHome, FaUser , FaList, FaClipboardList,FaBox,
  FaWarehouse, FaBurn,FaBoxes, FaSignOutAlt } from 'react-icons/fa';
import './Navigationbar.css';

const Navbar = ({ setCurrentPage, privileges, isVisible, closeNav }) => {
  const navRef = useRef(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [activePage, setActivePage] = useState('');

  const handleLinkClick = (page) => {
    setCurrentPage(page);
    setActivePage(page);
    closeNav();
  };

  // Close navbar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isVisible && navRef.current && !navRef.current.contains(event.target)) {
        closeNav();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isVisible, closeNav]);

  // logout function
  const handleLogout = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/logout`);
      sessionStorage.clear();
      window.location.href = '/';
      window.history.pushState(null, null, '/');
      window.onpopstate = () => {
        window.location.href = '/';
      };
    } catch (error) {
      console.error('Error during logout:', error);
      alert('Error while logging out');
    }
  };
  return (
    <div ref={navRef} className={`navigation ${isVisible ? 'active' : 'hidden'}`}>

      <ul>
        <li className={activePage === 'adminoverview' ? 'active' : ''} onClick={() => handleLinkClick('adminoverview')}> <span><FaHome /></span>Overview</li>
        <li className={activePage === 'view_reception_records' ? 'active' : ''} onClick={() => handleLinkClick('view_reception_records')}> <span><FaClipboardList /></span>Complaints</li>
        
        <li className={activePage === 'reception_data_report' ? 'active' : ''} onClick={() => handleLinkClick('reception_data_report')}> <span><FaList /></span>Data Visualization</li>

        <li className={activePage === 'view-Users' ? 'active' : ''} onClick={() => handleLinkClick('view-Users')}><FaUser  /> Agencies</li>
        <li className={activePage === 'user-roles' ? 'active' : ''} onClick={() => handleLinkClick('user-roles')}><FaHome /> User Roles</li>
     <h3>Profile settings</h3>
    
        <li className={activePage === 'user-profile' ? 'active' : ''} onClick={() => handleLinkClick('user-profile')}><FaUser  /> Profile</li>

        
      </ul>
      <ol>
      <div className='logout-btn'>
             <li onClick={() => setShowLogoutConfirm(true)}>
               <FaSignOutAlt color='black' /> Logout
             </li>
             </div>
      </ol>
  
                   {/* Logout confirmation modal */}
      {showLogoutConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Are you sure you want to logout?</p>
            <div className="modal-buttons">
              <button className='confirm-logout' onClick={handleLogout}>Yes</button>
              <button className='cancel-logout' onClick={() => setShowLogoutConfirm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;