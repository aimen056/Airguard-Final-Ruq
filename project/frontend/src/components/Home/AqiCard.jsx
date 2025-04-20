import React from "react";

const AqiCard = ({ aqiData, highestAQI, categoryColors, getAqiCategory, selectedZone }) => {
  const currentCategory = getAqiCategory(highestAQI);
  const categoryLabel = currentCategory.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
  const className = categoryColors[currentCategory];

  return (
    <div className={`p-5 rounded-lg shadow-lg text-primaryBtnText dark:text-white  bg-opacity-60 w-full`}>
        <div className="flex items-center justify-evenly gap-4">
        <div className={`p-3 rounded-full ${className} bg-opacity-50 flex items-center justify-center`}>
          <span className="text-xl">{getEmoji(currentCategory)}</span>
        </div>
        <div className="flex-1">
        <h2 className="text-xl font-bold">Air Quality Index</h2>
          <p className="text-base">{selectedZone}</p>
          <p className="text-xs opacity-80">Current</p>
        </div>
      </div>

      <div className={`mt-3 p-3 rounded-md ${className} bg-opacity-40 dark:bg-white dark:bg-opacity-10 flex justify-center`}>
        <div className="text-center">
          <h2 className="text-3xl font-bold">{highestAQI}</h2>
          <p className="text-base">{categoryLabel}</p>
        </div>
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