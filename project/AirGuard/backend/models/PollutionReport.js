const mongoose = require('mongoose');

const PollutionReportSchema = new mongoose.Schema({
  description: { type: String, required: true },
  user: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  location: { type: String, required: true },
  pollutionType: { type: String, required: true },
  date: { type: String, required: true }, // Storing as a string to match frontend format
}, { timestamps: true });

module.exports = mongoose.model('PollutionReport', PollutionReportSchema);