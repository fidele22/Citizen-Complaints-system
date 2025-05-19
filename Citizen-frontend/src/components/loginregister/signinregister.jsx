import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Navbar from '../citizensPage/navbar';
import 'react-toastify/dist/ReactToastify.css';

import './LoginSignup.css';


const LoginSignup = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [otp, setOTP] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();
  
    const newErrors = {};
    if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';
    if (!password) newErrors.password = 'Password is required';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Invalid email address or password');
      return;
    }
  
    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/authentication/login`, { email, password });
  
      if (res.data.requires2FA) {
        navigate('/verify-otp', { state: { email: res.data.email } });
      } else {
        const { token, role, _id, privileges } = res.data;
        const tabId = Date.now() + Math.random().toString(36);
        sessionStorage.setItem(`token_${tabId}`, token);
        sessionStorage.setItem(`privileges_${tabId}`, JSON.stringify(privileges));
        sessionStorage.setItem('userId', _id);
        sessionStorage.setItem('role', role);
        sessionStorage.setItem('currentTab', tabId);
  
        switch (role) {
          case 'ADMIN':
            navigate('/admin-dashboard');
            break;
          case 'ELECTRICITY':
            navigate('/electricity');
            break;
          case 'HEALTH':
            navigate('/health');
            break;
          default:
            navigate('/');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error('Invalid email or password');
    }
  };
  

 

  const toggle = () => {
    setIsSignIn(!isSignIn);
  };


  
 
    return (
      <>
        <Navbar />
        <div className="login-page">
          <div className="login-left">
            <h2>Welcome Back!</h2>
            <p>Log in to continue to the Citizen Engagement System.</p>
        
          </div>
    
          <div className="login-right">
            <div className="login-box">
              <h2 className="login-title">Login</h2>
              <form onSubmit={handleLogin} className="login-form">
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
    
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
    
                <button type="submit" className="login-button">Login</button>
              </form>
              <p className="register-link">
                Don't have an account? <a href="/register">Register</a>
             

              </p>
            </div>
          </div>
             <ToastContainer position="top-right" autoClose={6000} />
        </div>
      </>
    );
  };

export default LoginSignup;
