const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  phone: String,

  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },

  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role', // Reference the Role model
    required: true,
  },

  twoFAEnabled: {
    type: Boolean,
    default: false,
  },

  twoFACode: String,
  twoFACodeExpires: Date,
});

module.exports = mongoose.model('Users', UserSchema);
