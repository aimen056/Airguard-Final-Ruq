// models/SensorLocation.js
const mongoose = require('mongoose');

const SensorLocationSchema = new mongoose.Schema({
  zone: { 
    type: String, 
    required: true,
    enum: ['Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'Zone 5'],
    index: true
  },
  locationName: {
    type: String,
    required: true,
    trim: true
  },
  lat: { 
    type: Number, 
    required: true 
  },
  lon: { 
    type: Number, 
    required: true 
  },
  aqi: {
    type: Number,
    required: true,
    min: 0,
    max: 500
  },
  threshold: { 
    type: Number, 
    default: 200 
  },
  pollutants: {
    pm2_5: { type: Number },
    pm10: { type: Number },
    o3: { type: Number },
    no2: { type: Number },
    so2: { type: Number },
    co: { type: Number }
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

SensorLocationSchema.pre('save', function(next) {
  if (this.isModified('pollutants')) {
    // Calculate individual pollutant AQIs using standard breakpoints
    const pm25Aqi = calculateAQI(this.pollutants.pm2_5, 'pm2.5');
    const pm10Aqi = calculateAQI(this.pollutants.pm10, 'pm10');
    const o3Aqi = calculateAQI(this.pollutants.o3, 'o3');
    const no2Aqi = calculateAQI(this.pollutants.no2, 'no2');
    const so2Aqi = calculateAQI(this.pollutants.so2, 'so2');
    const coAqi = calculateAQI(this.pollutants.co, 'co');
    
    // Overall AQI is the maximum of individual AQIs
    this.aqi = Math.max(pm25Aqi, pm10Aqi, o3Aqi, no2Aqi, so2Aqi, coAqi);
    this.lastUpdated = new Date();
  }
  next();
});

// Standard AQI calculation function
function calculateAQI(concentration, pollutant) {
  // Implement proper AQI breakpoint calculation based on EPA standards
  // This is a simplified version - you should implement the full formula
  const breakpoints = {
    'pm2.5': [[0, 12, 0, 50], [12.1, 35.4, 51, 100], /* ... */],
    'pm10': [[0, 54, 0, 50], [55, 154, 51, 100], /* ... */],
    // Add breakpoints for other pollutants
  };
  
  const ranges = breakpoints[pollutant];
  for (const [clow, chigh, ilow, ihigh] of ranges) {
    if (concentration >= clow && concentration <= chigh) {
      return Math.round(((ihigh - ilow)/(chigh - clow)) * (concentration - clow) + ilow);
    }
  }
  return 500; // Hazardous if above highest breakpoint
}

module.exports = mongoose.model('SensorLocation', SensorLocationSchema);