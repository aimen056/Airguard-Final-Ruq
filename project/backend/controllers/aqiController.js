const AQIModel = require('../models/aqiModel');

const getAQIData = async (req, res) => {
  const { zone, date } = req.query;

  try {
    const aqiData = await AQIModel.getAQIData(zone, date);
    res.json(aqiData);
  } catch (error) {
    console.error('Error fetching AQI data:', error);
    res.status(500).json({ error: 'Failed to fetch AQI data' });
  }
};

module.exports = {
  getAQIData,
};