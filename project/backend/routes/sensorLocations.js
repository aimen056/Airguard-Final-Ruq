const express = require('express');
const router = express.Router();
const SensorLocation = require('../models/SensorLocation');

// Get all sensor locations
router.get('/', async (req, res) => {
  try {
    const locations = await SensorLocation.find();
    res.json(locations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new sensor location
router.post('/', async (req, res) => {
  const { zone, lat, lon, aqi } = req.body;
  const newLocation = new SensorLocation({ zone, lat, lon, aqi });

  try {
    const savedLocation = await newLocation.save();
    res.status(201).json(savedLocation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;