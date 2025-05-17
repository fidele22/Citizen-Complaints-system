// src/components/LandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaCommentDots, FaPaperPlane,FaSearch} from 'react-icons/fa';
import Navbar from './navbar';
import './landingPage.css';

const LandingPage = () => (
  <>
    <div className="hero-container">
    < Navbar />

      <div className="hero-overlay">
        <h2 className="hero-title">
          Welcome to the Citizen Engagement System
        </h2>
        <p className="hero-text">
          Share your complaints or feedback about public services. We route
          them to the right institutions and keep you updated on the progress.
        </p>
        <Link to="/complaint">
          <button className="hero-button">Submit a Complaint</button>
        </Link>
      </div>
    </div>
    <div className="service-offer">
      <div className="service-card">
        <div className="icon-circle blue">
          <FaPaperPlane />
        </div>
        <h3>Submit</h3>
        <p>Send any complaints to any institution for categorization.</p>
        <Link to="/complaint">
          <button><FaPaperPlane style={{ marginRight: '5px' }} />Send Complaint</button>
        </Link>
      </div>

      <div className="service-card">
        <div className="icon-circle green">
          <FaSearch />
        </div>
        <h3>Track</h3>
        <p>Check your complaint based on the ID provided.</p>
        <Link to="/trackProgress">
          <button><FaSearch style={{ marginRight: '5px' }} />Check Progress</button>
        </Link>
      </div>

      <div className="service-card">
        <div className="icon-circle yellow">
          <FaCommentDots />
        </div>
        <h3>Feedback</h3>
        <p>Send feedback by filling out the service satisfaction survey.</p>
        <button><FaCommentDots style={{ marginRight: '5px' }} />Feedback</button>
      </div>
    </div>
    {/* Now any content you add here will flow *below* the hero */}
    <footer className="footer">
      © 2025 City Council • <Link to="/about">About</Link> • <Link to="/contact">Contact</Link>
    </footer>
  </>
);

export default LandingPage;
