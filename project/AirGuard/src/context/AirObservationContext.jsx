import React, { createContext, useContext, useEffect, useState } from "react";

// Create context
const ObservationsContext = createContext();

export const ObservationsProvider = ({ children }) => {
  const [observationData, setObservationsData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchObservationsData = async () => {
      try {
        setLoading(true);
      const response = await fetch(`/api/airObs/observations`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        console.log("Filtered AirNow Data:", result);
        setObservationsData(result); 
      } catch (err) {
        console.error("Error fetching AirNow data:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchObservationsData();
  }, []);

  return (
    <ObservationsContext.Provider value={{ observationData, error, loading }}>
      {children}
    </ObservationsContext.Provider>
  );
};

export const useObservations = () => {
  return useContext(ObservationsContext);
};