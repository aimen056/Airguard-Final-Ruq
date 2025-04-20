// controllers/aqiController.js
const AQI = require('../models/AQI');
const SensorLocation = require('../models/SensorLocation');

const getAQIData = async (req, res) => {
  const { zone, date } = req.query;

  try {
    // First try to get AQI data from AQI collection
    let aqiData = await AQI.findOne({ zone })
      .sort({ timestamp: -1 })
      .lean();

    if (!aqiData) {
      // If no AQI data exists, get the latest from sensor locations
      const sensorData = await SensorLocation.findOne({ zone })
        .sort({ updatedAt: -1 });

      if (sensorData) {
        aqiData = {
          zone,
          locationName: sensorData.locationName,
          overallAQI: sensorData.aqi,
          category: getAQICategory(sensorData.aqi),
          meteorologicalData: {
            temperature: null,
            humidity: null,
            pressure: null
          },
          pollutants: [
            { name: 'PM2.5', aqi: Math.floor(sensorData.aqi * 0.8) },
            { name: 'PM10', aqi: sensorData.aqi },
            { name: 'NO2', aqi: Math.floor(sensorData.aqi * 0.6) },
            { name: 'SO2', aqi: Math.floor(sensorData.aqi * 0.4) },
            { name: 'CO', aqi: Math.floor(sensorData.aqi * 0.3) },
            { name: 'O3', aqi: Math.floor(sensorData.aqi * 0.5) },
          ],
          trend: Array.from({ length: 24 }, (_, i) => ({
            time: `${i}:00`,
            aqi: Math.floor(sensorData.aqi * (0.8 + Math.random() * 0.4))
          }))
        };
      }
    }

    if (!aqiData) {
      return res.status(404).json({ error: 'No data available for this zone' });
    }

    res.json(aqiData);
  } catch (error) {
    console.error('Error fetching AQI data:', error);
    res.status(500).json({ error: 'Failed to fetch AQI data' });
  }
};

function getAQICategory(aqi) {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}

module.exports = {
  getAQIData,
};