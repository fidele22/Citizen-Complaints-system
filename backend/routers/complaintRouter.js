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

// GET all complaints (with optional category filter)
router.get('/get-categorized-complaints', async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    const complaints = await Complaint.find(query).sort({ submittedAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch complaints', error: err.message });
  }
});

// PATCH: Update complaint response and status
// PUT /api/complaints/:id
router.put('/update-complaints/:id', async (req, res) => {
  try {
    const { status, response } = req.body;
    const updated = await Complaint.findByIdAndUpdate(req.params.id, { status, response }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update complaint' });
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

// GET /api/complaints/overview
router.get('/overview-data', async (req, res) => {
  try {
    const total = await Complaint.countDocuments();

    const statusCounts = await Complaint.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const categoryCounts = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const electricityByProvince = await Complaint.aggregate([
      { $match: { category: 'Electricity' } },
      { $group: { _id: '$provence', count: { $sum: 1 } } }
    ]);

    const latestComplaints = await Complaint.find()
      .sort({ submittedAt: -1 })
      .limit(5);

    res.json({
      total,
      statusCounts: Object.fromEntries(statusCounts.map(i => [i._id, i.count])),
      categoryCounts: Object.fromEntries(categoryCounts.map(i => [i._id, i.count])),
      electricityByProvince: electricityByProvince.map(i => ({
        province: i._id,
        count: i.count
      })),
      latestComplaints
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching overview', error: err.message });
  }
});
// GET /api/complaints/overview-data
router.get('/overview-electrity-data', async (req, res) => {
  try {
    const electricityComplaints = await Complaint.find({ category: 'Electricity' }).sort({ submittedAt: -1 });

    const total = electricityComplaints.length;
    const pending = electricityComplaints.filter(c => c.status === 'Pending').length;
    const inProgress = electricityComplaints.filter(c => c.status === 'In Progress').length;
    const resolved = electricityComplaints.filter(c => c.status === 'Resolved').length;

    const latestThree = electricityComplaints.slice(0, 3); // latest 3 complaints

    res.json({
      total,
      pending,
      inProgress,
      resolved,
      latestThree,
      allComplaints: electricityComplaints, // if you still need full data for charts
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch complaints overview data' });
  }
});
// GET /api/complaints/overview-data
router.get('/overview-health-data', async (req, res) => {
  try {
    const HealthcareComplaints = await Complaint.find({ category: 'Healthcare' }).sort({ submittedAt: -1 });

    const total = HealthcareComplaints.length;
    const pending = HealthcareComplaints.filter(c => c.status === 'Pending').length;
    const inProgress = HealthcareComplaints.filter(c => c.status === 'In Progress').length;
    const resolved = HealthcareComplaints.filter(c => c.status === 'Resolved').length;

    const latestThree = HealthcareComplaints.slice(0, 3); // latest 3 complaints

    res.json({
      total,
      pending,
      inProgress,
      resolved,
      latestThree,
      allComplaints: HealthcareComplaints, // if you still need full data for charts
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch complaints overview data' });
  }
});
module.exports = router;
