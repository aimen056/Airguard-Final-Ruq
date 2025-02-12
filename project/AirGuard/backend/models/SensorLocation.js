const mongoose = require('mongoose');

const SensorLocationSchema = new mongoose.Schema({
  zone: { type: String, required: true },
  lat: { type: Number, required: true },
  lon: { type: Number, required: true },
  aqi: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('SensorLocation', SensorLocationSchema);