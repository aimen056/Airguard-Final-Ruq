const axios = require("axios");

const getObservationsByMonitoringSite = async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const latitude = parseFloat(lat) || 33.6995;
    const longitude = parseFloat(lon) || 73.0363;
    const apiKey = process.env.AIRNOW_API_KEY;

    if (!apiKey) {
      console.error("API key is missing");
      return res.status(500).json({ error: "API key not set" });
    }

    const bboxSize = 8;
    const bbox = [
      longitude - bboxSize,
      latitude - bboxSize,
      longitude + bboxSize,
      latitude + bboxSize,
    ].join(",");

    const url = `https://www.airnowapi.org/aq/data/?parameters=OZONE,PM25,PM10,CO,NO2&BBOX=${bbox}&dataType=A&format=application/json&verbose=0&monitorType=0&API_KEY=${apiKey}`;

    console.log("API URL:", url.replace(apiKey, "HIDDEN"));

    const response = await axios.get(url);

    console.log("Raw API Response:", response.data); // Log full API response

    if (!Array.isArray(response.data) || !response.data.length) {
      console.error("No monitoring data found");
      return res.status(404).json({ error: "No monitoring data found" });
    }

    const parameters = new Set(["OZONE", "PM2.5", "PM10", "CO", "NO2"]);

    const results = response.data
      .filter((item) => parameters.has(item.Parameter.toUpperCase()))
      .filter((item) => item.AQI !== -999 && item.Concentration !== -999)
      .map((item) => ({
        parameter: item.Parameter,
        aqi: item.AQI,
      }));

    console.log("Filtered Observations Data:", results);
    res.json(results);
  } catch (error) {
    console.error("AirNow API Error:", error.message);
    res.status(500).json({
      error: "Failed to fetch air quality data",
      details: error.message,
    });
  }
};

module.exports = { getObservationsByMonitoringSite };