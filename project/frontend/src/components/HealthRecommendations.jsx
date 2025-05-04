import React from "react";

const HealthRecommendations = ({ userData }) => {
  // Calculate age from date of birth
  const calculateAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };


  const age = calculateAge(userData?.dob);
  const ageGroup = age < 18 ? "child" : age >= 65 ? "senior" : "adult";
  const conditions = userData?.diseases || []; 
  
  const hasValidConditions = conditions.some(condition => 
    recommendations.hasOwnProperty(condition)
  );
  // EPA, WHO, CDC recommendations by condition and age group
  const recommendations = {
    "Respiratory conditions": {
      child: [
        "EPA recommends children with respiratory conditions avoid outdoor activities when air quality is poor.",
        "WHO suggests using air purifiers with HEPA filters in children's bedrooms.",
        "CDC advises keeping rescue inhalers readily available for children with asthma."
      ],
      adult: [
        "EPA suggests adults with respiratory conditions check air quality forecasts daily.",
        "WHO recommends wearing N95 masks when air quality is unhealthy.",
        "CDC advises creating an asthma action plan if you have chronic respiratory issues."
      ],
      senior: [
        "EPA recommends seniors with respiratory conditions stay indoors on high pollution days.",
        "WHO suggests seniors get annual flu and pneumonia vaccinations.",
        "CDC advises maintaining good indoor air quality by reducing dust and mold."
      ]
    },
    "Cardiovascular disease": {
      child: [
        "EPA recommends limiting strenuous outdoor activities for children with heart conditions when air quality is poor.",
        "WHO suggests regular cardiovascular screenings for children with known heart conditions.",
        "CDC advises maintaining a heart-healthy diet low in sodium and saturated fats."
      ],
      adult: [
        "EPA suggests adults with heart disease avoid outdoor exercise when air quality is unhealthy.",
        "WHO recommends monitoring blood pressure regularly if you have cardiovascular disease.",
        "CDC advises at least 150 minutes of moderate exercise per week for heart health."
      ],
      senior: [
        "EPA recommends seniors with heart conditions stay in air-conditioned environments on hot, polluted days.",
        "WHO suggests seniors with cardiovascular disease avoid exposure to secondhand smoke.",
        "CDC advises managing stress through relaxation techniques to support heart health."
      ]
    },
    "Chronic Diseases & Other Conditions": {
      child: [
        "EPA recommends children with chronic conditions have an emergency plan for poor air quality days.",
        "WHO suggests regular medical check-ups for children with chronic illnesses.",
        "CDC advises maintaining a consistent medication schedule for chronic conditions."
      ],
      adult: [
        "EPA suggests adults with chronic conditions monitor local air quality alerts regularly.",
        "WHO recommends staying hydrated to help manage many chronic conditions.",
        "CDC advises getting adequate sleep to support overall health with chronic conditions."
      ],
      senior: [
        "EPA recommends seniors with chronic conditions keep emergency contacts readily available.",
        "WHO suggests seniors with chronic diseases get annual comprehensive health exams.",
        "CDC advises maintaining social connections to support mental health with chronic illness."
      ]
    }
  };

  // General recommendations for all users
  const generalRecommendations = [
    "Check local air quality forecasts daily.",
    "Stay hydrated to help your body cope with environmental stressors.",
    "Consider using an air purifier in your home, especially in bedrooms.",
    "Keep windows closed on days with poor air quality.",
    "Have a plan for where to go if you need cleaner air (e.g., libraries, malls with good filtration)."
  ];
  

  return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Health Recommendations
          </h2>
          
          {age && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Personalized for {ageGroup === "child" ? "children" : ageGroup === "senior" ? "seniors" : "adults"} (age {age})
            </p>
          )}
          
          {hasValidConditions ? (
            <div>
              {conditions
                .filter(condition => recommendations[condition]) // Only show conditions that exist in recommendations
                .map((condition) => (
                  <div key={condition} className="mb-6">
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                      {condition}
                    </h3>
                    <ul className="list-disc pl-5 space-y-2">
                      {recommendations[condition][ageGroup].map((rec, index) => (
                        <li key={index} className="text-gray-600 dark:text-gray-300">
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                  General Recommendations
                </h3>
                <ul className="list-disc pl-5 space-y-2">
                  {generalRecommendations.map((rec, index) => (
                    <li key={index} className="text-gray-600 dark:text-gray-300">
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (

        <div>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            No specific health conditions selected. Here are general recommendations:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            {generalRecommendations.map((rec, index) => (
              <li key={index} className="text-gray-600 dark:text-gray-300">
                {rec}
              </li>
            ))}
          </ul>
          {age && ageGroup === "senior" && (
            <div className="mt-4">
              <p className="text-gray-600 dark:text-gray-300">
                As a senior, consider getting regular health check-ups and staying 
                up-to-date with vaccinations.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HealthRecommendations;