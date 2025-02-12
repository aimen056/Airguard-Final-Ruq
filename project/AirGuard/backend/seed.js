const mongoose = require('mongoose');
const AQI = require('./models/AQI');

mongoose.connect('mongodb://127.0.0.1:27017/airguard', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedData = [
  {
    zone: 'Zone 1',
    date: 'today',
    category: 'Moderate',
    humidity: 60,
    pressure: 1013,
    temperature: 25,
    pollutants: [
      { name: 'PM2.5', aqi: 120 },
      { name: 'PM10', aqi: 90 },
      { name: 'NO2', aqi: 50 },
      { name: 'SO2', aqi: 30 },
      { name: 'CO', aqi: 10 },
      { name: 'O3', aqi: 70 },
    ],
    trend: Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      aqi: Math.floor(Math.random() * 300),
    })),
  },
];

const seedDB = async () => {
  await AQI.deleteMany({});
  await AQI.insertMany(seedData);
  console.log('Database seeded!');
  mongoose.connection.close();
};

seedDB();