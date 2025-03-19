const PollutionReport = require("../models/ReportModel");
// Create a pollution report
const createPollutionReport = async (req, res) => {
  try {
    const report = new PollutionReport(req.body);
    await report.save();
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: "Failed to create report", error });
  }
};

// Get all pollution reports
const getAllPollutionReports = async (req, res) => {
  try {
    const reports = await PollutionReport.find();
    res.status(200).json(reports); // Ensure this is an array
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reports", error });
  }
};

// Update a pollution report
const updatePollutionReport = async (req, res) => {
  try {
    const updatedReport = await PollutionReport.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedReport);
  } catch (error) {
    res.status(500).json({ message: "Failed to update report", error });
  }
};

// Delete a pollution report
const deletePollutionReport = async (req, res) => {
  try {
    await PollutionReport.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Report deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete report", error });
  }
};


// Replace export with:
module.exports = { createPollutionReport, getAllPollutionReports, updatePollutionReport,deletePollutionReport };