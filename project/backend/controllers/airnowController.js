const axios = require("axios");

const getAirNowCurrentData = async (req, res) => {
    try {
      const { lat, lon, distance } = req.query;
      const latitude = lat || 33.5474;
      const longitude = lon || 73.1849;
      const dist = distance || 25;
      const apiKey = process.env.AIRNOW_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'API key not set' });
      }
      // Use JSON format for the response
      const format = 'application/json';
      const url = `https://www.airnowapi.org/aq/observation/latLong/current/?format=${format}&latitude=${latitude}&longitude=${longitude}&distance=${dist}&API_KEY=${apiKey}`;
      
      const response = await axios.get(url);
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching AirNow current data:", error.response ? error.response.data : error.message);
      res.status(500).json({ error: 'Failed to fetch AirNow current data' });
    }
  };

  module.exports = {
    getAirNowCurrentData,
  };
  