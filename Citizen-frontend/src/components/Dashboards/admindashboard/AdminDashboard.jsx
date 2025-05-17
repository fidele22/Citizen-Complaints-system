import React, { useState,useRef,useEffect } from 'react';
import { FaHome, FaBars, FaTimes } from 'react-icons/fa';
import Navbar from './adminNavbar/Navigationbar';
import Navigation from '../navbar/TopNavbar';
// import Footer from '../footer/Footer';
import AdminOverview from './adminOverview/AdminOverview';
import ViewUser  from './user/users';
import UserRole from './roles/viewRoles';
import ViewComplaintRecords from './complaints/viewComplaints';

import UserProfile from '../UserProfile/profile';
import './css/adminDashboard.css';
import ComplaintAnalytics from './analytics/dataVisualization';


const AdminDashboard = () => {
  const [currentPage, setCurrentPage] = useState('overview');
  const [privileges, setPrivileges] = useState([]);
  const [isNavVisible, setIsNavVisible] = useState(false); // State for navigation visibility
  const navRef = useRef(); 

  const renderContent = () => {
    switch (currentPage) {
      case 'adminoverview':
        return <AdminOverview />;
      case 'view-Users':
        return <ViewUser  />;
      case 'user-roles':
        return <UserRole />;
      case 'reception_data_report':
        return <ComplaintAnalytics />;
      case 'view_reception_records':
        return <ViewComplaintRecords />;

      case 'user-profile':
        return <UserProfile />;
    
      default:
        return <AdminOverview />;
    }
  };

  const toggleNav = () => {
    setIsNavVisible(!isNavVisible); // Toggle the navigation visibility

  };
  const closeNav = () => {
    setIsNavVisible(false); // Function to close the navigation

  };

  useEffect(() => {

    const handleClickOutside = (event) => {

      if (navRef.current && !navRef.current.contains(event.target)) {

        closeNav(); // Close navigation if clicked outside

      }

    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {

      document.removeEventListener('mousedown', handleClickOutside);

    };

  }, []);
  return (
    <div className={`admin-dashboard `}>
      
      <div>
      <Navigation setCurrentPage={setCurrentPage} toggleNav={toggleNav}  isNavVisible={isNavVisible} />
      
      </div>

      <Navbar setCurrentPage={setCurrentPage} isVisible={isNavVisible} 
        privileges={privileges} closeNav={closeNav}  />
      
      <div className="Admincontent-page">
        <div className="Admincontent">
          {renderContent()}
       
        </div>
        {/* <Footer /> */}
      </div>
    
    </div>
  );
};

export default AdminDashboard;