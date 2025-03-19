import React from "react";
import { useAirQuality } from "../../context/AirQualityContext";
import { getAqiCategory } from "../../constants/aqiColors";

const AqiCard = () => {
  const { airNowData, error } = useAirQuality();

  if (error) {
    return <p className="text-red-500 text-center">Error fetching data</p>;
  }

  if (!Array.isArray(airNowData) || airNowData.length === 0) {
    return <p className="text-gray-500 text-center">No data available</p>;
  }
  const aqi = airNowData[0]?.AQI || "N/A";

//   const aqi = 400; // Temporary AQI value
  const { label, className, icon: Icon } = getAqiCategory(aqi);
  const parameter = airNowData[0]?.ParameterName || "Unknown";
  const dateObserved = airNowData[0]?.DateObserved || "Unknown";

  return (
    <div className={`p-5 rounded-lg shadow-lg text-primaryBtnText dark:text-white ${className} bg-opacity-60 w-full`}>
      {/* Top Section with Icon */}
      <div className="flex items-center justify-evenly gap-4">
        <div className={`p-4 rounded-full ${className} bg-opacity-50 flex items-center justify-center`}>
          {Icon && <Icon className="w-12 h-12" />} {/* ✅ Correct way to render */}
        </div>
        <div>
          <h2 className="text-xl font-bold">Air Quality Index</h2>
          <p className="text-lg">{parameter}</p>
          <p className="text-sm opacity-80">{dateObserved}</p>
        </div>
      </div>

      {/* AQI Details */}
      <div className={`mt-4 p-4 rounded-md ${className} bg-opacity-40 dark:bg-white dark:bg-opacity-10 flex justify-center align-middle items-center`}>
        <div>
          <h2 className="text-4xl font-bold">{aqi}</h2>
          <p className="text-lg">{label}</p>
        </div>
      </div>
    </div>
  );
};

export default AqiCard;