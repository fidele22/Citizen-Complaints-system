
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
//import PrivateRoute from './Component/ProtectedRoute'
import VerifyOTP from './components/loginregister/OtpVerification';
import LoginForm from './components/loginregister/signinregister';
import ForgotPassword  from './components/resetpassword/sendrestpasswordlink';
import ResetPassword from './components/resetpassword/resetpassword';
import AdminDashboard from './components/Dashboards/admindashboard/AdminDashboard';
import ProtectedRoute from './components/protection/ProtectedRoute';
import HealthAgency from './components/Dashboards/H-AgencyDashboard/H-dashboard';
import CitizensPlatform from './components/citizensPage/landingPage';
import ComplaintForm from './components/citizensPage/sendComplaintForm';  
import ComplaintTrackProgress from './components/citizensPage/trackProgress';

// agencies dashboard 
import ElectricalAgency from './components/Dashboards/E-AgencyDashboard/E-dashboard';
// import LoginSignup  from './components/loginregister/signinregister'
import './App.css';


function App() {
  return (

    <Router>
      <div className='app'>
      
        <Routes>
        
          <Route path="/" element={<CitizensPlatform />} />
          <Route path="/complaint" element={<ComplaintForm />} />
          <Route path="/trackProgress" element={<ComplaintTrackProgress />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

    
          <Route path="/admin-dashboard/*" element={<ProtectedRoute component={AdminDashboard} />} />
          <Route path="/health/*" element={<ProtectedRoute component={HealthAgency} />} />
          <Route path="/electricity/*" element={<ProtectedRoute component={ElectricalAgency} />} />
    
         
          
        </Routes>
      </div>
    </Router>
  
   
  );
}

export default App;
