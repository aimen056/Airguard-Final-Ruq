import React from "react";
import { useEffect, useState } from "react";
const HistoricalReportAdmin = () => {
  const [historicalData, setHistoricalData] = useState(null);

  useEffect(() => {
    const lat = 50;
    const lon = 50;
    // Set start and end Unix timestamps (e.g., the last 24 hours)
    const now = Math.floor(Date.now() / 1000);
    const oneDayAgo = now - 24 * 60 * 60;
    
    fetch(`/api/aqi/historical?lat=${lat}&lon=${lon}&start=${oneDayAgo}&end=${now}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Historical AQI data:", data);
        setHistoricalData(data);
      })
      .catch((error) => console.error("Error fetching historical AQI:", error));
  }, []);

  return (
    <div className="pt-16 bg-background dark:bg-background dark:text-[#E4E4E7] h-screen">
      Logs
      {}
      <div>
      <h1>Historical Reports</h1>
      {historicalData ? (
        <div>
          {historicalData.list.map((item) => (
            <div key={item.dt} style={{ marginBottom: '1rem' }}>
              <p>Time: {new Date(item.dt * 1000).toLocaleString()}</p>
              <p>AQI: {item.main.aqi}</p>
              <p>PM2.5: {item.components.pm2_5} μg/m³</p>
              {/* Render more details as needed */}
            </div>
          ))}
        </div>
      ) : (
        <p>Loading historical data...</p>
      )}
    </div>
    </div>
  );
};

export default HistoricalReportAdmin;