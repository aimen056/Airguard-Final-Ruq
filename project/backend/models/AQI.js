const mongoose = require('mongoose');

const AQISchema = new mongoose.Schema({
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
  timestamp: { 
    type: Date, 
    required: true,
    default: Date.now,
    index: true 
  },
  overallAQI: {
    type: Number,
    required: true,
    min: 0,
    max: 500
  },
  category: {
    type: String,
    required: true,
    enum: ['Good', 'Moderate', 'Unhealthy for Sensitive Groups', 'Unhealthy', 'Very Unhealthy', 'Hazardous']
  },
  healthImplications: String,
  cautionaryStatement: String,
  meteorologicalData: {
    temperature: { type: Number },          // in °C
    humidity: { type: Number },            // in %
    pressure: { type: Number },            // in hPa
    windSpeed: { type: Number },           // in m/s
    windDirection: { type: Number },       // in degrees
    precipitation: { type: Number }        // in mm
  },
  pollutants: {
    pm2_5: {
      concentration: { type: Number },     // in µg/m³
      aqi: { type: Number }
    },
    pm10: {
      concentration: { type: Number },     // in µg/m³
      aqi: { type: Number }
    },
    o3: {
      concentration: { type: Number },     // in ppb
      aqi: { type: Number }
    },
    no2: {
      concentration: { type: Number },     // in ppb
      aqi: { type: Number }
    },
    so2: {
      concentration: { type: Number },     // in ppb
      aqi: { type: Number }
    },
    co: {
      concentration: { type: Number },    // in ppm
      aqi: { type: Number }
    }
  },
  dominantPollutant: {
    type: String,
    enum: ['PM2.5', 'PM10', 'O3', 'NO2', 'SO2', 'CO']
  },
  trendData: [{
    timestamp: { type: Date },
    aqi: { type: Number },
    dominantPollutant: String
  }],
  sensorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SensorLocation',
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for faster queries
AQISchema.index({ zone: 1, timestamp: -1 });
AQISchema.index({ 'pollutants.pm2_5.aqi': 1 });
AQISchema.index({ 'pollutants.pm10.aqi': 1 });
AQISchema.index({ category: 1 });

// Virtual for formatted date
AQISchema.virtual('formattedDate').get(function() {
  return this.timestamp.toISOString().split('T')[0];
});

// Pre-save hook to calculate overall AQI and category
AQISchema.pre('save', function(next) {
  if (!this.isModified('pollutants')) return next();
  
  // Calculate overall AQI (simplified - in practice would use proper AQI calculation)
  const pollutantAQIs = [
    this.pollutants.pm2_5?.aqi || 0,
    this.pollutants.pm10?.aqi || 0,
    this.pollutants.o3?.aqi || 0,
    this.pollutants.no2?.aqi || 0,
    this.pollutants.so2?.aqi || 0,
    this.pollutants.co?.aqi || 0
  ];
  
  this.overallAQI = Math.max(...pollutantAQIs);
  this.dominantPollutant = this.getDominantPollutant();
  this.category = this.getAQICategory(this.overallAQI);
  
  next();
});

// Method to determine AQI category
AQISchema.methods.getAQICategory = function(aqi) {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
};

// Method to determine dominant pollutant
AQISchema.methods.getDominantPollutant = function() {
  const pollutants = this.pollutants;
  let maxAqi = -1;
  let dominant = '';
  
  if (pollutants.pm2_5?.aqi > maxAqi) {
    maxAqi = pollutants.pm2_5.aqi;
    dominant = 'PM2.5';
  }
  if (pollutants.pm10?.aqi > maxAqi) {
    maxAqi = pollutants.pm10.aqi;
    dominant = 'PM10';
  }
  if (pollutants.o3?.aqi > maxAqi) {
    maxAqi = pollutants.o3.aqi;
    dominant = 'O3';
  }
  if (pollutants.no2?.aqi > maxAqi) {
    maxAqi = pollutants.no2.aqi;
    dominant = 'NO2';
  }
  if (pollutants.so2?.aqi > maxAqi) {
    maxAqi = pollutants.so2.aqi;
    dominant = 'SO2';
  }
  if (pollutants.co?.aqi > maxAqi) {
    dominant = 'CO';
  }
  
  return dominant;
};

module.exports = mongoose.model('AQI', AQISchema);