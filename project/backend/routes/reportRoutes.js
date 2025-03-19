const express = require('express');
const router = express.Router();
const PollutionReport = require('../models/pollutionreport'); // Ensure this points to the correct file

// Route to create a new pollution report
router.post('/', async (req, res) => {
  try {
    const { description, user, location, pollutionType, date } = req.body;

    // Create a new pollution report
    const newReport = new PollutionReport({
      description,
      user,
      location,
      pollutionType,
      date,
    });

    // Save the report to the database
    const savedReport = await newReport.save();

    // Send the saved report as a response
    res.status(201).json(savedReport);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to get all pollution reports
router.get('/', async (req, res) => {
  try {
    const reports = await PollutionReport.find();
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to get a specific pollution report by ID
router.get('/:id', async (req, res) => {
  try {
    const report = await PollutionReport.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to update a pollution report by ID
router.put('/:id', async (req, res) => {
  try {
    const { description, user, location, pollutionType, date, isVerified } = req.body;

    const updatedReport = await PollutionReport.findByIdAndUpdate(
      req.params.id,
      {
        description,
        user,
        location,
        pollutionType,
        date,
        isVerified,
      },
      { new: true } // Return the updated document
    );

    if (!updatedReport) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json(updatedReport);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to delete a pollution report by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedReport = await PollutionReport.findByIdAndDelete(req.params.id);
    if (!deletedReport) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.json({ message: 'Report deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;