import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './navbar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './complaintform.css';

const steps = [
  "Personal Information",
  "Complaint Details",
  "Notify Plan",
  "Complaint Summary"
];
const initialFormState = {
    firstName: "", lastName: "", birthDate: "",
    gender: "", provence: "", district: "",
    idType: "", idNumber: "",
    category: "", description: "",
    notifyVia: "", notifyValue: "",
  };

export default function ComplaintForm() {

  const [current, setCurrent] = useState(0);
  const [ticketId, setTicketId] = useState(""); // New state for ticket ID
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Use the initialFormState here
  const [form, setForm] = useState(initialFormState);

  
  
  const back = () => setCurrent(c => Math.max(c - 1, 0));
  const validateStep = () => {
    switch (current) {
      case 0:
        return (
          form.firstName.trim() &&
          form.lastName.trim() &&
          form.birthDate &&
          form.gender &&
          form.provence &&
          form.district &&
          form.idType &&
          form.idNumber.trim()
        );
      case 1:
        return form.category && form.description.trim();
      case 2:
        return (
          form.notifyVia &&
          form.notifyValue.trim() &&
          (
            form.notifyVia === "email"
              ? /\S+@\S+\.\S+/.test(form.notifyValue) // Email format
              : /^[0-9]{10,15}$/.test(form.notifyValue) // Phone number format
          )
        );
      default:
        return true;
    }
  };
  

  const next = () => {
    if (validateStep()) {
      setCurrent(c => Math.min(c + 1, steps.length - 1));
    } else {
      toast.error("Please fill in all required fields correctly.");
    }
  };
  
  const submit = async () => {
    if (!validateStep()) {
      toast.error("Please complete the notification info correctly.");
      return;
    }
  
    setIsSubmitting(true);
    try {
      const res = await axios.post("http://localhost:5000/api/complaints/submit", form);
      const id = res.data.ticketId;
      setTicketId(id);
      toast.success(`Complaint Submitted successfully! Ticket ID: ${id}`);
      setForm(initialFormState);
      setCurrent(0);
    } catch (err) {
      toast.error("Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  return (
    <div className="complaint-form">
            <Navbar />
      <div className="complaint-form-wrapper">
    

        {/* Progress Bar */}
        <div className="progress-bar">
          {steps.map((label, i) => (
            <div
              key={i}
              className={`progress-step ${
                i < current ? 'completed' : i === current ? 'active' : ''
              }`}
            >
              <div className="step-circle">{i + 1}</div>
              <div className="step-label">{label}</div>
            </div>
          ))}
        </div>

        {/* Step Contents */}
        <div className="step-content">
          {current === 0 && (
            <div className="person-information">
              <div className="person-input-field">
                <input name="firstName" onChange={handleChange} value={form.firstName} placeholder="First Name" required />
                <input name="lastName" onChange={handleChange} value={form.lastName} placeholder="Last Name" required />
                <input type="date" name="birthDate" onChange={handleChange} value={form.birthDate} />
              </div>
              <div className="person-input-field">
                <select name="gender" onChange={handleChange} value={form.gender}>
                  <option value="">Gender</option>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
                <select name="provence" onChange={handleChange} value={form.provence}>
                  <option value="">Provence</option>
                  <option>North</option>
                  <option>Western</option>
                  <option>Eastern</option>
                  <option>South</option>
                  <option>Kigali</option>
                </select>
                <input
                 name="district"
                 onChange={handleChange}
                 value={form.district}
                 placeholder="Enter your District"
                 required
               />
               
              </div>
              <div className="person-input-fiel">
                <select name="idType" onChange={handleChange} value={form.idType}>
                  <option value="">ID Type</option>
                  <option>Passport</option><option>National ID</option>
                </select>
                <input name="idNumber" onChange={handleChange} value={form.idNumber} placeholder="ID Number" />
              </div>
            </div>
          )}

          {current === 1 && (
            <>
              <select name="category" onChange={handleChange} value={form.category}>
                <option value="">Select Category</option>
                <option>Water</option><option>Electricity</option>
                <option>Roads</option><option>Healthcare</option>
                <option>Other</option>
              </select>
              <textarea
                name="description"
                onChange={handleChange}
                value={form.description}
                placeholder="Describe the issue"
              />
            </>
          )}

          {current === 2 && (
            <>
              <select name="notifyVia" onChange={handleChange} value={form.notifyVia}>
                <option value="">Notify me via</option>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
              </select>
              {form.notifyVia && (
                <input
                  name="notifyValue"
                  onChange={handleChange}
                  value={form.notifyValue}
                  placeholder={form.notifyVia === "email" ? "Your Email" : "Your Phone"}
                />
              )}
            </>
          )}

          {current === 3 && (
            <div className="summary-box">
              <h3>Please Confirm Your Details:</h3>
              <pre>{JSON.stringify(form, null, 2)}</pre>

            </div>
          )}
        </div>

        {ticketId && (
                <div className="ticket-id-box">
                  <h4>Your complaint Ticket ID:</h4>
                  <p className="ticket-id"><span>{ticketId}</span></p>
                  <p className="ticket-info">
                    Please record this ID carefully. It may be used for future tracking about complaint you sent.
                  </p>
                </div>
              )}
        {/* Navigation Buttons */}
        <div className="form-navigation">
          <button className="btn-back" onClick={back} disabled={current === 0}>Back</button>
          {current < steps.length - 1
            ? <button className="btn-next" onClick={next}>Next</button>
            : <button className="btn-submit" onClick={submit} disabled={isSubmitting}>
            {isSubmitting ? <><span className="loader" /> Sending...</> : "Submit"}
          </button>
          
          

          }
        </div>

        <ToastContainer position="top-right" autoClose={5000} />
      </div>
      <footer className="footer">
              © 2025 City Council • About • Contact
            </footer>
    </div>
  );
}
