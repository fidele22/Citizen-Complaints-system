// scripts/createAdmin.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/Users');
const Role = require('../models/userRoles')
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log(' Connected to MongoDB');
  createAdmin();
}).catch((err) => {
  console.error(' MongoDB connection error:', err);
});

const createAdmin = async () => {
  try {
      // Fetch the ObjectId of the 'admin' role
    const adminRole = await Role.findOne({ name: 'ADMIN' });

    const adminExists = await User.findOne({ email: 'admin@example.com' });
    if (adminExists) {
      console.log(' Admin already exists.');
      process.exit();
    }

    const hashedPassword = await bcrypt.hash('admin123', 10); // Hash the password

    const admin = new User({
      firstName: 'Admin',
      lastName: 'User',
      phone: '123456789',
      email: 'admin@gmail.com',
  
      password: hashedPassword,
      role: adminRole._id, // Assign role by ID
     
    });

    await admin.save();
    console.log(' Admin user created.');
  } catch (err) {
    console.error(' Error creating admin:', err);
  } finally {
    process.exit();
  }
};


