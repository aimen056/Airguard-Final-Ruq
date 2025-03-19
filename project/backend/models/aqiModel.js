const AQI = require('./AQI');

const getAQIData = async (zone, date) => {
  try {
    // Fetch data from the database
    const aqiData = await AQI.findOne({ zone, date });

    if (!aqiData) {
      // If no data exists, return a default response
      return {
        zone,
        date,
        category: 'Moderate',
        humidity: Math.floor(Math.random() * 100),
        pressure: Math.floor(Math.random() * 1000),
        temperature: Math.floor(Math.random() * 40),
        pollutants: [
          { name: 'PM2.5', aqi: Math.floor(Math.random() * 300) },
          { name: 'PM10', aqi: Math.floor(Math.random() * 300) },
          { name: 'NO2', aqi: Math.floor(Math.random() * 300) },
          { name: 'SO2', aqi: Math.floor(Math.random() * 300) },
          { name: 'CO', aqi: Math.floor(Math.random() * 300) },
          { name: 'O3', aqi: Math.floor(Math.random() * 300) },
        ],
        trend: Array.from({ length: 24 }, (_, i) => ({
          time: `${i}:00`,
          aqi: Math.floor(Math.random() * 300),
        })),
      };
    }

    return aqiData;
  } catch (error) {
    console.error('Error fetching AQI data from database:', error);
    throw error;
  }
};

module.exports = {
  getAQIData,
};