const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const path = require('path');
require('dotenv').config(); 
const MongoStore = require('connect-mongo');
const session = require('express-session');
const connectDB = require('./configiration/database');

const app = express();
app.use(express.json()); // 
app.use(bodyParser.json()); // 
app.use(express.urlencoded({ extended: true }));

// imports of routes
const userdataRouter = require('./routers/userData');
 const roleRoutes = require('./routers/rolesRouters');
 const authenticationRoutes = require('./routers/authentication');
 const complaintsRoutes = require ('./routers/complaintRouter');


app.use(cors({
  origin: '*',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true, 
}));

connectDB();

app.use(session({
  secret: 'MVP-system-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true in production with HTTPS
}));

//routers path api 
app.use('/api/userdata', userdataRouter)
app.use('/api/roles', roleRoutes);
app.use('/api/complaints', complaintsRoutes);
app.use('/api/authentication', authenticationRoutes);

// Logout route
app.post('/api/logout', (req, res) => {
  console.log('Logout request received');
  try {
    res.status(200).json({ message: 'Logged out successfully. Please delete your token on the client side.' });
  } catch (err) {
    console.error('Error during logout:', err); // Log the error
    res.status(500).json({ message: 'Server error during logout' });
  }
});



 const PORT = process.env.PORT || 5000;
 app.listen(PORT, '0.0.0.0', () => {
  console.log("Server running on port 5000");
});


 