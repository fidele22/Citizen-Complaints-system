import React from 'react';
import './footersystem.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>CCS</h3>
          <ul>
            <li><a>Careers</a></li>
            <li><a>Terms of Service</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Support</h3>
          <ul>
            <li><a >FAQ</a></li>
            <li><a>Contact Us</a></li>
            <li><a>Help Center</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a  rel="noreferrer">📘</a>
            <a rel="noreferrer">🐦</a>
            <a  rel="noreferrer">💼</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Citizen complaints system. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
