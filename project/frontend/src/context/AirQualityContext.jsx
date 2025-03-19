import React, { createContext, useContext, useState, useEffect } from "react";

const AirQualityContext = createContext();

export const AirQualityProvider = ({ children }) => {
  const [airNowData, setAirNowData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAirQualityData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5002/api/aqi?zone=Zone%201&date=today"
        );
        if (!response.ok) throw new Error("Failed to fetch air quality data");
        const data = await response.json();
        setAirNowData(data);
      } catch (error) {
        console.error("Error fetching AQI data:", error);
        setError(error.message);
      }
    };

    fetchAirQualityData();
  }, []);

  return (
    <AirQualityContext.Provider value={{ airNowData, error }}>
      {children}
    </AirQualityContext.Provider>
  );
};

export const useAirQuality = () => useContext(AirQualityContext);
