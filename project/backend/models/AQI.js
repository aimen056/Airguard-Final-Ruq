const mongoose = require('mongoose');

const AQISchema = new mongoose.Schema({
  zone: { type: String, required: true },
  date: { type: String, required: true },
  category: { type: String, required: true },
  humidity: { type: Number, required: true },
  pressure: { type: Number, required: true },
  temperature: { type: Number, required: true },
  pollutants: [
    {
      name: { type: String, required: true },
      aqi: { type: Number, required: true },
    },
  ],
  trend: [
    {
      time: { type: String, required: true },
      aqi: { type: Number, required: true },
    },
  ],
});

module.exports = mongoose.model('AQI', AQISchema);