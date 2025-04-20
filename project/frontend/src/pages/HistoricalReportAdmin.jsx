import React from "react";
import { useEffect, useState } from "react";

const HistoricalReportAdmin = () => {
  const [historicalData, setHistoricalData] = useState(null);
  const [selectedZone, setSelectedZone] = useState("All Zones");
  const [timeRange, setTimeRange] = useState("24h");

  // Dummy historical data for all zones
  const dummyHistoricalData = {
    "Zone 1": generateZoneHistory("Zone 1", "Downtown Commercial Area", 33.546768, 73.184011, 45, 142),
    "Zone 2": generateZoneHistory("Zone 2", "Industrial Zone East", 33.548322, 73.184974, 78, 192),
    "Zone 3": generateZoneHistory("Zone 3", "Residential District North", 33.545026, 73.18469, 32, 89),
    "Zone 4": generateZoneHistory("Zone 4", "University Campus", 33.543215, 73.182456, 22, 61)
  };

  useEffect(() => {
    // Simulate API fetch with dummy data
    const timer = setTimeout(() => {
      const dataToDisplay = selectedZone === "All Zones" 
        ? Object.values(dummyHistoricalData).flat() 
        : dummyHistoricalData[selectedZone];
      
      // Apply time range filter
      const now = new Date();
      let filteredData = dataToDisplay;
      
      if (timeRange === "24h") {
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        filteredData = dataToDisplay.filter(item => new Date(item.timestamp) > oneDayAgo);
      } else if (timeRange === "7d") {
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filteredData = dataToDisplay.filter(item => new Date(item.timestamp) > oneWeekAgo);
      }
      
      setHistoricalData(filteredData);
    }, 500);

    return () => clearTimeout(timer);
  }, [selectedZone, timeRange]);

  return (
    <div className="pt-16 bg-background dark:bg-background dark:text-[#E4E4E7] min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Historical Air Quality Reports</h1>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="w-full sm:w-1/2">
            <label htmlFor="zone-select" className="block text-sm font-medium mb-1">Select Zone</label>
            <select
              id="zone-select"
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-800"
            >
              <option value="All Zones">All Zones</option>
              <option value="Zone 1">Zone 1 - Downtown Commercial Area</option>
              <option value="Zone 2">Zone 2 - Industrial Zone East</option>
              <option value="Zone 3">Zone 3 - Residential District North</option>
              <option value="Zone 4">Zone 4 - University Campus</option>
            </select>
          </div>
          <div className="w-full sm:w-1/2">
            <label htmlFor="time-range" className="block text-sm font-medium mb-1">Time Range</label>
            <select
              id="time-range"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-800"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="all">All Data</option>
            </select>
          </div>
        </div>
        
        {/* Data Display */}
        {historicalData ? (
          historicalData.length > 0 ? (
            <div className="space-y-6">
              {historicalData.map((report, index) => (
                <div key={index} className="border rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-3">
                    <h2 className="text-lg font-semibold">
                      {report.zone} - {report.locationName}
                    </h2>
                    <div className="flex items-center gap-2 mt-2 md:mt-0">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        report.overallAQI <= 50 ? 'bg-green-100 text-green-800' :
                        report.overallAQI <= 100 ? 'bg-yellow-100 text-yellow-800' :
                        report.overallAQI <= 150 ? 'bg-orange-100 text-orange-800' :
                        report.overallAQI <= 200 ? 'bg-red-100 text-red-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        AQI: {report.overallAQI} ({report.category})
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(report.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Pollutants */}
                    <div>
                      <h3 className="font-medium mb-2">Pollutants (μg/m³)</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(report.pollutants).map(([key, value]) => (
                          <div key={key} className="border p-2 rounded">
                            <div className="text-sm font-medium capitalize">{key.replace('_', ' ')}</div>
                            <div className="text-lg">{value.concentration}</div>
                            <div className="text-xs text-gray-500">AQI: {value.aqi}</div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 text-sm">
                        <span className="font-medium">Dominant Pollutant:</span> {report.dominantPollutant}
                      </div>
                    </div>
                    
                    {/* Weather Data */}
                    <div>
                      <h3 className="font-medium mb-2">Weather Conditions</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="border p-2 rounded">
                          <div className="text-sm font-medium">Temperature</div>
                          <div className="text-lg">{report.meteorologicalData.temperature} °C</div>
                        </div>
                        <div className="border p-2 rounded">
                          <div className="text-sm font-medium">Humidity</div>
                          <div className="text-lg">{report.meteorologicalData.humidity}%</div>
                        </div>
                        <div className="border p-2 rounded">
                          <div className="text-sm font-medium">Wind Speed</div>
                          <div className="text-lg">{report.meteorologicalData.windSpeed} m/s</div>
                        </div>
                        <div className="border p-2 rounded">
                          <div className="text-sm font-medium">Pressure</div>
                          <div className="text-lg">{report.meteorologicalData.pressure} hPa</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p>No historical data available for the selected filters.</p>
            </div>
          )
        ) : (
          <div className="text-center py-10">
            <p>Loading historical data...</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to generate historical data for a zone
function generateZoneHistory(zone, locationName, lat, lon, basePm2_5, baseAqi) {
  const history = [];
  const now = new Date();
  
  // Generate data for the last 7 days, every 3 hours
  for (let daysBack = 0; daysBack < 7; daysBack++) {
    for (let hours = 0; hours < 24; hours += 3) {
      const timestamp = new Date(now);
      timestamp.setDate(now.getDate() - daysBack);
      timestamp.setHours(now.getHours() - hours, 0, 0, 0);
      
      // Simulate some variation in the data
      const variationFactor = 0.8 + Math.random() * 0.4; // 0.8-1.2
      const pm2_5 = Math.round(basePm2_5 * variationFactor);
      const aqi = Math.round(baseAqi * variationFactor);
      
      // Determine category based on AQI
      let category;
      if (aqi <= 50) category = "Good";
      else if (aqi <= 100) category = "Moderate";
      else if (aqi <= 150) category = "Unhealthy for Sensitive Groups";
      else if (aqi <= 200) category = "Unhealthy";
      else if (aqi <= 300) category = "Very Unhealthy";
      else category = "Hazardous";
      
      history.push({
        zone,
        locationName,
        lat,
        lon,
        timestamp: timestamp.toISOString(),
        meteorologicalData: {
          temperature: Math.round((20 + Math.random() * 10) * 10) / 10,
          humidity: Math.round(50 + Math.random() * 30),
          pressure: Math.round(1010 + Math.random() * 10),
          windSpeed: Math.round((1 + Math.random() * 5) * 10) / 10,
          windDirection: Math.round(Math.random() * 360),
          precipitation: Math.random() > 0.8 ? Math.round(Math.random() * 5) : 0
        },
        pollutants: {
          pm2_5: { concentration: pm2_5, aqi: Math.round(pm2_5 * 2.5) },
          pm10: { concentration: Math.round(pm2_5 * 1.5), aqi: Math.round(pm2_5 * 1.5) },
          o3: { concentration: Math.round(20 + Math.random() * 30), aqi: Math.round(20 + Math.random() * 30) },
          no2: { concentration: Math.round(15 + Math.random() * 40), aqi: Math.round(15 + Math.random() * 40) },
          so2: { concentration: Math.round(5 + Math.random() * 20), aqi: Math.round(5 + Math.random() * 20) },
          co: { concentration: Math.round((0.5 + Math.random() * 3) * 10) / 10, aqi: Math.round((0.5 + Math.random() * 3) * 10) }
        },
        overallAQI: aqi,
        category,
        dominantPollutant: "pm2_5"
      });
    }
  }
  
  return history;
}

export default HistoricalReportAdmin;