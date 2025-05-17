// src/components/Navbar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './nav.css'; // Use this for custom styles

const Navbar = () => {
  const { pathname } = useLocation();

  return (
    <nav className="navbar-custom">
      <div className="navbar-container">
        <div className="logo-section">
          <img src="/logo-icon.svg" alt="Logo" className="logo-icon" />
          <span className="logo-text">CivicSolve</span>
        </div>

        <div className="nav-links">
          <Link to="/" className={pathname === '/' ? 'active' : ''}>Home</Link>
          <Link to="/problems" className={pathname === '/problems' ? 'active' : ''}>Problems</Link>
          <Link to="/submit" className={pathname === '/submit' ? 'active' : ''}>Submit Problem</Link>
        </div>

        <div className="nav-buttons">
          <Link to="/login" className="sign-in-btn">⇨ Sign In</Link>
          <Link to="/register" className="create-account-btn">Create Account</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
