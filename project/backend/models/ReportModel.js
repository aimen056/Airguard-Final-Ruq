const mongoose = require('mongoose');

const PollutionReportSchema = new mongoose.Schema({
  description: { type: String, required: true },
  user: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  location: { type: String, required: true },
  pollutionType: { type: String, required: true },
  date: { type: String, required: true },
  resolved: { type: Boolean, default: false } // Add this field for tracking resolution
}, { timestamps: true });

// Check if model already exists before defining
const PollutionReport = mongoose.models.PollutionReport || 
  mongoose.model('PollutionReport', PollutionReportSchema);

module.exports = PollutionReport;