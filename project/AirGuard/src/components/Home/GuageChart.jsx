import React from "react";
import { PieChart, Pie, Cell } from "recharts";
import { useAirQuality } from "../../context/AirQualityContext";

// AQI Categories with Fixed Colors
const categories = [
  { name: "Good", value: 50, color: "#00E400" }, // Green
  { name: "Moderate", value: 50, color: "#FFFF00" }, // Yellow
  { name: "Unhealthy for Sensitive Groups", value: 50, color: "#FF7E00" }, // Orange
  { name: "Unhealthy", value: 50, color: "#FF0000" }, // Red
  { name: "Very Unhealthy", value: 50, color: "#8F3F97" }, // Purple
  { name: "Hazardous", value: 50, color: "#7E0023" }, // Maroon
];

const RADIAN = Math.PI / 180;
const cx = 200; // Center X
const cy = 200; // Center Y
const iR = 80; // Inner Radius
const oR = 130; // Outer Radius

const GaugeChart = () => {
  const { airNowData, error } = useAirQuality();

  if (error) {
    return <p className="text-red-500 text-center">Error fetching data</p>;
  }

  if (!Array.isArray(airNowData) || airNowData.length === 0) {
    return <p className="text-gray-500 text-center">No data available</p>;
  }

  // Extract AQI and Category Number
  const aqi = airNowData[0]?.AQI || 'N/A'
  const categoryIndex = airNowData[0]?.Category?.Number || 1; // Default to 1 (Good)

  // Ensure categoryIndex is within range (1 to 6)
  const validIndex = Math.min(Math.max(categoryIndex, 1), 6);

  // Calculate Needle Angle Based on Category
  const totalAQI = categories.length * 50;
  const angle = 180 * (1 - aqi / totalAQI);

  // Calculate Needle Position
  const needleLength = (iR + oR) / 2;
  const x0 = cx;
  const y0 = cy;
  const x1 = x0 + needleLength * Math.cos(-RADIAN * angle);
  const y1 = y0 + needleLength * Math.sin(-RADIAN * angle);

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-lg font-bold">AQI Gauge</h2>
      <PieChart width={400} height={300}>
        {/* Gauge Chart */}
        <Pie
          dataKey="value"
          startAngle={180}
          endAngle={0}
          data={categories}
          cx={cx}
          cy={cy}
          innerRadius={iR}
          outerRadius={oR}
          stroke="none"
        >
          {categories.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>

        {/* Needle */}
        <g>
          <circle cx={x0} cy={y0} r={6} fill="black" stroke="none" />
          <path d={`M${x0} ${y0} L${x1} ${y1}`} stroke="black" strokeWidth="4" />
        </g>
      </PieChart>

      {/* AQI Details */}
      {/* <p className="text-xl font-semibold">{airNowData[0].Category.Name}</p>
      <p className="text-2xl font-bold">{aqi}</p>
      <p className="text-sm">{airNowData[0].ReportingArea}, {airNowData[0].StateCode}</p> */}
    </div>
  );
};

export default GaugeChart;