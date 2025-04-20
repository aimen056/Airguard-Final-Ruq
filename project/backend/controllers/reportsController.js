const PollutionReport = require('../models/ReportModel');

// Create a new pollution report
exports.createPollutionReport = async (req, res) => {
  try {
    const { description, location, pollutionType } = req.body;
    const user = req.user?.name || "Anonymous";
    
    const newReport = new PollutionReport({
      description,
      location,
      pollutionType,
      user,
      date: new Date().toLocaleString()
    });

    await newReport.save();
    res.status(201).json(newReport);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all pollution reports
exports.getAllPollutionReports = async (req, res) => {
  try {
    const reports = await PollutionReport.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a pollution report (for admin verification)
exports.updatePollutionReport = async (req, res) => {
  try {
    const { isVerified, resolved } = req.body;
    const updatedReport = await PollutionReport.findByIdAndUpdate(
      req.params.id,
      { isVerified, resolved },
      { new: true }
    );
    res.json(updatedReport);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a pollution report
exports.deletePollutionReport = async (req, res) => {
  try {
    await PollutionReport.findByIdAndDelete(req.params.id);
    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

