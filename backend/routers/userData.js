
const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const upload = require('../middlewares/upload');
const multer = require('multer');
const path = require('path');
const Role = require('../models/userRoles')




router.get('/users', async (req, res) => {
  try {
    // Find the Role document for ADMIN
    const adminRole = await Role.findOne({ name: 'ADMIN' });
    if (!adminRole) {
      return res.status(500).json({ message: 'Admin role not found' });
    }

    // Fetch users whose role is NOT adminRole._id
    const users = await User.find({ role: { $ne: adminRole._id } })
      .populate('role', 'name') // populate role field and only select 'name'
      .select('-password -twoFACode -twoFACodeExpires'); // exclude sensitive fields

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
// PUT update user
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, phone, email, role } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { firstName, lastName, phone, email, role },
      { new: true }
    ).populate('role');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE user
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


//overview page 
// GET: Count forms grouped by status
// router.get('/status-summary-overview', async (req, res) => {
//   try {
//     const allStatuses = ['Pending', 'In Progress', 'Completed', 'Uncompleted', 'Paid', 'UnPaid'];

//     const rawSummary = await ReceptionForm.aggregate([
//       {
//         $group: {
//           _id: '$status',
//           count: { $sum: 1 }
//         }
//       }
//     ]);

//     const summary = allStatuses.map(status => {
//       const found = rawSummary.find(s => s._id === status);
//       return { status, count: found ? found.count : 0 };
//     });

//     res.json(summary);
//   } catch (error) {
//     console.error('Error getting status summary:', error);
//     res.status(500).json({ message: 'Server error', error });
//   }
// });


module.exports = router;
