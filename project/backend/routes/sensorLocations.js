// routes/sensor-locations.js
const express = require('express');
const router = express.Router();
const SensorLocation = require('../models/SensorLocation');
const AQI = require('../models/AQI');

// Get all sensor locations with latest AQI data
router.get('/', async (req, res) => {
  try {
    const locations = await SensorLocation.find().sort({ createdAt: -1 });
    res.json(locations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new sensor location and create AQI record
router.post('/', async (req, res) => {
  try {
    const { zone, locationName, lat, lon, threshold, pollutants } = req.body;
    
    if (!zone || !locationName || !lat || !lon) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newLocation = new SensorLocation({ 
      zone,
      locationName,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      threshold: threshold || 200,
      pollutants: pollutants || {
        pm2_5: Math.floor(Math.random() * 200),
        pm10: Math.floor(Math.random() * 200),
        o3: Math.floor(Math.random() * 100),
        no2: Math.floor(Math.random() * 100),
        so2: Math.floor(Math.random() * 50),
        co: Math.floor(Math.random() * 10)
      }
    });

    const savedLocation = await newLocation.save();
    
    // Create corresponding AQI record
    await AQI.create({
      zone,
      locationName,
      sensorId: savedLocation._id,
      overallAQI: savedLocation.aqi,
      category: getAQICategory(savedLocation.aqi),
      pollutants: {
        pm2_5: { concentration: savedLocation.pollutants.pm2_5, aqi: Math.floor(savedLocation.pollutants.pm2_5 * 1.2) },
        pm10: { concentration: savedLocation.pollutants.pm10, aqi: savedLocation.pollutants.pm10 },
        o3: { concentration: savedLocation.pollutants.o3, aqi: Math.floor(savedLocation.pollutants.o3 * 1.5) },
        no2: { concentration: savedLocation.pollutants.no2, aqi: Math.floor(savedLocation.pollutants.no2 * 1.3) },
        so2: { concentration: savedLocation.pollutants.so2, aqi: Math.floor(savedLocation.pollutants.so2 * 1.3) },
        co: { concentration: savedLocation.pollutants.co, aqi: Math.floor(savedLocation.pollutants.co * 10) }
      },
      dominantPollutant: getDominantPollutant(savedLocation.pollutants)
    });

    res.status(201).json(savedLocation);
  } catch (err) {
    res.status(400).json({ 
      message: err.message.includes('validation failed') 
        ? 'Invalid data format' 
        : err.message 
    });
  }
});

// Helper functions
function getAQICategory(aqi) {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}

function getDominantPollutant(pollutants) {
  const values = [
    { name: 'PM2.5', value: pollutants.pm2_5 },
    { name: 'PM10', value: pollutants.pm10 },
    { name: 'O3', value: pollutants.o3 },
    { name: 'NO2', value: pollutants.no2 },
    { name: 'SO2', value: pollutants.so2 },
    { name: 'CO', value: pollutants.co * 10 }
  ];
  
  values.sort((a, b) => b.value - a.value);
  return values[0].name;
}

module.exports = router;