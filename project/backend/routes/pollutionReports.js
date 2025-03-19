const express = require('express');
const router = express.Router();
const PollutionReport = require('../models/pollutionreport'); // Ensure this points to the correct file

// Get all pollution reports
router.get('/', async (req, res) => {
  try {
    const reports = await PollutionReport.find();
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Verify a pollution report
router.put('/:id', async (req, res) => {
  try {
    const report = await PollutionReport.findByIdAndUpdate(req.params.id, { isVerified: req.body.isVerified }, { new: true });
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;