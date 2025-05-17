const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  // Step 1: Personal Information
  firstName:    { type: String, required: true },
  lastName:     { type: String, required: true },
  birthDate:    { type: Date,   required: true },
  gender:       { type: String, enum: ['Male','Female','Other'], required: true },
  provence:  { type: String, required: true },
  district:     { type: String, required: true },
  idType:       { type: String, enum: ['Passport','National ID'], required: true },
  idNumber:     { type: String, required: true },

  // Step 2: Complaint Details
  category:     { type: String, required: true },
  description:  { type: String, required: true },

  // Step 3: Notify Plan
  notifyVia:    { type: String, enum: ['email','phone'], required: true },
  notifyValue:  { type: String, required: true },

  // System fields
  ticketId:     { type: String, unique: true, index: true },
  status:       { type: String, enum: ['Pending','In Progress','Resolved'], default: 'Pending' },
  response:     { type: String, default: '' },
  submittedAt:  { type: Date, default: Date.now },
});

module.exports = mongoose.model('Complaint', complaintSchema);
