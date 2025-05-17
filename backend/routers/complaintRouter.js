const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Complaint = require('../models/complaintModel');

// Helper to generate a unique ticket ID
function generateTicketId() {
  return 'CMP-' + Math.floor(100000 + Math.random() * 900000);
}

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


// POST /api/complaints/submit
router.post('/submit', async (req, res) => {
  try {
    const ticketId = generateTicketId();
    const data = {
      ...req.body,
      ticketId
    };
    const complaint = new Complaint(data);
    await complaint.save();

    // Check if user requested email notification
    if (data.notifyVia === 'email' && data.notifyValue) {
      const mailOptions = {
        from: `"Public Service Desk" <${process.env.EMAIL_USER}>`,
        to: data.notifyValue,
        subject: `Your Complaint Ticket ID: ${ticketId}`,
        text: `Dear ${data.firstName},\n\nThank you for submitting your complaint.\nYour Ticket ID is: ${ticketId}\n\nYou can use this ID to track the status of your complaint.\n\nBest regards,\nPublic Service Team`
      };

      // Send the email
      await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${data.notifyValue}`);
    }

    return res.status(201).json({ ticketId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to create complaint' });
  }
});


// GET all complaints
router.get('/get-complaints', async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ submittedAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch complaints', error: err.message });
  }
});
// GET complaints filtered by month and year (optional)
router.get('/get-complaints/monthly', async (req, res) => {
  try {
    const { month, year } = req.query;
    let filter = {};

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 1);
      filter.submittedAt = { $gte: startDate, $lt: endDate };
    }

    const complaints = await Complaint.find(filter).sort({ submittedAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch complaints', error: err.message });
  }
});

// GET: Track complaint by ticket ID
router.get('/track/:ticketId', async (req, res) => {
  const { ticketId } = req.params;
  try {
    const complaint = await Complaint.findOne({ ticketId });
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// (Admin) update status and response
router.put('/:ticketId', async (req, res) => {
  try {
    const updates = {
      status: req.body.status,
      response: req.body.response
    };
    const complaint = await Complaint.findOneAndUpdate(
      { ticketId: req.params.ticketId },
      updates,
      { new: true }
    );
    if (!complaint) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    return res.json(complaint);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to update complaint' });
  }
});

module.exports = router;
