const mongoose = require('mongoose');
const SensorLocation = require('./models/SensorLocation');
const AQI = require('./models/AQI');
const seedData = require('./seedData.json');

mongoose.connect('mongodb://127.0.0.1:27017/airguard', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const calculateOverallAQI = (pollutants) => {
  return Math.max(
    pollutants.pm2_5?.aqi || 0,
    pollutants.pm10?.aqi || 0,
    pollutants.o3?.aqi || 0,
    pollutants.no2?.aqi || 0,
    pollutants.so2?.aqi || 0,
    pollutants.co?.aqi || 0
  );
};

const getAQICategory = (aqi) => {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
};

const seedDB = async () => {
  try {
    // Clear existing data
    await SensorLocation.deleteMany({});
    await AQI.deleteMany({});
    console.log('Database cleared!');

    // Insert sensor locations
    const sensors = await SensorLocation.insertMany(seedData.sensorLocations);
    console.log(`${sensors.length} sensor locations added!`);

    // Process AQI records
    const aqiRecords = [];
    for (const record of seedData.aqiRecords) {
      const sensor = sensors.find(s => s.zone === record.zone);
      if (!sensor) continue;

      const overallAQI = calculateOverallAQI(record.pollutants);
      const category = getAQICategory(overallAQI);

      aqiRecords.push({
        ...record,
        sensorId: sensor._id,
        overallAQI,
        category,
        dominantPollutant: Object.entries(record.pollutants)
          .sort((a, b) => b[1].aqi - a[1].aqi)[0][0]
      });
    }

    // Insert AQI records
    const insertedRecords = await AQI.insertMany(aqiRecords);
    console.log(`${insertedRecords.length} AQI records added!`);

    // Update sensors with latest AQI
    for (const sensor of sensors) {
      const latestRecord = insertedRecords
        .filter(r => r.zone === sensor.zone)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
      
      if (latestRecord) {
        sensor.aqi = latestRecord.overallAQI;
        await sensor.save();
      }
    }
    console.log('Sensor AQI values updated!');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedDB();