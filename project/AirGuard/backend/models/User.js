const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true , unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: true  },
  contact: { type: String },
  dob: { type: Date },
  country: { type: String },
  city: { type: String },
  diseases: [String],
  wantsAlerts: { type: Boolean },
  notificationType: { type: String },
  alertFrequency: { type: String },
  resetToken: { type: String },
  tokenExpiry:{ type: Date } 
});

const User = mongoose.model('User', userSchema);
module.exports = User;
