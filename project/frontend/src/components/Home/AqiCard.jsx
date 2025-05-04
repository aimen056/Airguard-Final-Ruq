// import React from "react";

// const AqiCard = ({ aqiData, highestAQI, categoryColors, getAqiCategory, selectedZone }) => {
//   const currentCategory = getAqiCategory(highestAQI);
//   const categoryLabel = currentCategory.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
//   const className = categoryColors[currentCategory];

//   return (
//     <div className={`p-5 rounded-lg shadow-lg text-primaryBtnText dark:text-white  bg-opacity-60 w-full`}>
//         <div className="flex items-center justify-evenly gap-4">
//         <div className={`p-3 rounded-full ${className} bg-opacity-50 flex items-center justify-center`}>
//           <span className="text-xl">{getEmoji(currentCategory)}</span>
//         </div>
//         <div className="flex-1">
//         <h2 className="text-xl font-bold">Air Quality Index</h2>
//           <p className="text-base">{selectedZone}</p>
//           <p className="text-xs opacity-80">Current</p>
//         </div>
//       </div>

//       <div className={`mt-3 p-3 rounded-md ${className} bg-opacity-40 dark:bg-white dark:bg-opacity-10 flex justify-center`}>
//         <div className="text-center">
//           <h2 className="text-3xl font-bold">{highestAQI}</h2>
//           <p className="text-base">{categoryLabel}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Helper function for emojis
// function getEmoji(category) {
//   const emojiMap = {
//     good: "😊",
//     moderate: "😐",
//     unhealthySensitive: "😷",
//     unhealthy: "😨",
//     veryUnhealthy: "😱",
//     hazardous: "☠️"
//   };
//   return emojiMap[category] || "—";
// }

// export default AqiCard;

import React from "react";
import { PieChart, Pie, Cell } from "recharts";

const AqiCard = ({ highestAQI, categoryColors, getAqiCategory, selectedZone }) => {
  const currentCategory = getAqiCategory(highestAQI);
  const categoryLabel = currentCategory
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
  const className = categoryColors[currentCategory];

  // Gauge configuration
  const categories = [
    { name: "Good", value: 50, color: "#00E400" },
    { name: "Moderate", value: 50, color: "#FFFF00" },
    { name: "UnhealthySensitive", value: 50, color: "#FF7E00" },
    { name: "Unhealthy", value: 50, color: "#FF0000" },
    { name: "VeryUnhealthy", value: 50, color: "#8F3F97" },
    { name: "Hazardous", value: 50, color: "#7E0023" },
  ];

  const RADIAN = Math.PI / 180;
  const cx = 75;
  const cy = 75;
  const iR = 50;
  const oR = 70;
  const totalAQI = categories.length * 50;
  const angle = 180 * (1 - Math.min(highestAQI, 300) / totalAQI);
  const needleLength = (iR + oR) / 2;
  const x1 = cx + needleLength * Math.cos(-RADIAN * angle);
  const y1 = cy + needleLength * Math.sin(-RADIAN * angle);

  return (
    <div className="w-full h-full p-4 rounded-xl shadow-lg bg-white dark:bg-gray-800 flex flex-col border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <div>
        <h2 className="text-xl font-bold">Air Quality Index</h2>
          <p className="text-base text-gray-500 dark:text-gray-400 truncate max-w-[140px]">
            {selectedZone || "Unknown location"}
          </p>
        </div>
        <div className={`p-2 rounded-full ${className} bg-opacity-50 flex-shrink-0 w-10 h-10 flex items-center justify-center`}>
          <span className="text-lg">{getEmoji(currentCategory)}</span>
        </div>
      </div>

      {/* Single Gauge */}
      <div className="flex-grow flex items-center justify-center relative my-2">
        <PieChart width={150} height={130} className="-mt-2 -mb-3">
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
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                className="opacity-90 hover:opacity-100 transition-opacity"
              />
            ))}
          </Pie>
          {/* Needle and center dot */}
          <g>
            <circle cx={cx} cy={cy} r={4} fill="black" className="dark:fill-gray-200" />
            <path
              d={`M${cx} ${cy} L${x1} ${y1}`}
              stroke="black"
              strokeWidth={2}
              className="dark:stroke-gray-200"
              strokeLinecap="round"
            />
          </g>
        </PieChart>
      </div>

      {/* AQI value display below gauge */}
      <div className={`mt-3 p-3 rounded-md ${className} bg-opacity-40 dark:bg-white dark:bg-opacity-10 flex justify-center`}>
         <div className="text-center">
         <h2 className="text-3xl font-bold">{highestAQI}</h2>
          <p className="text-base">{categoryLabel}</p>
        </div>
   </div>

      {/* Legend */}
      <div className="flex justify-center gap-1 mt-1">
        {categories.map((category, index) => (
          <div
            key={index}
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: category.color }}
            title={category.name}
          />
        ))}
      </div>
    </div>
  );
};

// Helper function for emojis
function getEmoji(category) {
  const emojiMap = {
    good: "😊",
    moderate: "😐",
    unhealthySensitive: "😷",
    unhealthy: "😨",
    veryUnhealthy: "😱",
    hazardous: "☠️"
  };
  return emojiMap[category] || "—";
}

export default AqiCard;