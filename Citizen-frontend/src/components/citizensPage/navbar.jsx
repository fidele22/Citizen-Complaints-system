// src/components/Navbar.js
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './nav.css'; // Use this for custom styles

const Navbar = () => {
  const { pathname } = useLocation();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar-custom">
      <div className="navbar-container">
        <div className="logo-section">
          <span className="logo-text">CCS</span>
        </div>

        <div className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <Link to="/" className={pathname === '/' ? 'active' : ''}>Home</Link>
          <Link to="/complaint" className={pathname === '/complaint' ? 'active' : ''}>Submit complaint</Link>
          <Link to="/trackProgress" className={pathname === '/trackProgress' ? 'active' : ''}>Track Progress</Link>
        </div>

        <div className="nav-buttons">
          <Link to="/login" className="sign-in-btn">⇨ Sign In</Link>
        </div>

        <div className="mobile-menu-icon" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? '✖' : '☰'}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
