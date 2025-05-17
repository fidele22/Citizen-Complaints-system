const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Role = require('../models/userRoles'); // Adjust path as needed

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
  createAdminRole();
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Create ADMIN role
async function createAdminRole() {
  try {
    const existingAdmin = await Role.findOne({ name: 'ADMIN' });
    if (existingAdmin) {
      console.log('ADMIN role already exists.');
      return mongoose.disconnect();
    }

    const adminRole = new Role({
      name: 'ADMIN',
      privileges: [
        'MANAGE_USERS',
        'VIEW_REPORTS',
        'ACCESS_DASHBOARD',
        'EDIT_SETTINGS',
        'APPROVE_REQUESTS'
      ],
      description: 'Administrator with full access'
    });

    await adminRole.save();
    console.log('ADMIN role created successfully.');
  } catch (err) {
    console.error('Error creating ADMIN role:', err);
  } finally {
    mongoose.disconnect();
  }
}
