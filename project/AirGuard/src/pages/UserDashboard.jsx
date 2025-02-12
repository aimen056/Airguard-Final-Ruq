import React, { useEffect, useState } from "react";
import HomeMap from "../components/HomeMap";
import { useAirQuality } from "../context/AirQualityContext";
import AqiPieChart from "../components/Home/aqiPieChart";
import { useObservations } from "../context/AirObservationContext";
import AqiCard from "../components/Home/AqiCard";
import GaugeChart from "../components/Home/GuageChart";
import { useDispatch, useSelector } from "react-redux";
import { fetchReports } from "../redux/features/repPollutionSlice";
import { NavLink } from "react-router-dom";
import Heatmap from "../components/Home/Heatmap";
import data from "../constants/data";
import AqiRecommendations from "../components/Home/AqiRecommendations";
const UserDashboard = () => {

  const dispatch = useDispatch();
  const { pollutions, status } = useSelector((state) => state.pollution);

  useEffect(() => {
    dispatch(fetchReports());
  }, [dispatch]);

  const { observationData } = useObservations();
  console.log("Observation Data in Dashboard:", observationData);

  const { airNowData, error } = useAirQuality();

  if(error) {
    console.error("Error fetching AirNow data:", error);
    return;
  }
  // Assuming airNowData contains the AQI value
  const currentAqi = Array.isArray(airNowData) && airNowData.length > 0 ? airNowData[0].AQI : 'N/A';
  // const { data: airNowData, error } = useAirNowData(); // using default coordinates
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="pt-16 bg-background dark:bg-background dark:text-[#E4E4E7]">
      <div className="p-5 text-primaryText dark:text-secondaryText ">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 bg-[url('./assets/Lightbg.png')] dark:bg-[url('./assets/Darkbg.png')] bg-no-repeat bg-cover bg-center rounded-3xl md:col-span-2 p-4 gap-4 shadow-2xl">
            <div className="bg-surfaceColor/60 rounded-2xl p-4">
              <HomeMap fullscreen={false} />
            </div>
            <div className="bg-surfaceColor/60 rounded-2xl p-4">
              <div className="bg-surfaceColor p-3 rounded-2xl">
                <GaugeChart />
              </div>
              <div className="bg-surfaceColor p-3 rounded-2xl">
                <AqiCard />
              </div>
            </div>
          </div>
          <div className="bg-surfaceColor  rounded-3xl shadow-2xl p-4 gap-4">
            <div className="rounded-2xl bg-gradient-to-bl from-red-300 via-orange-300 to-amber-300 dark:bg-gradient-to-bl dark:from-emerald-500 dark:from-10%  dark:via-teal-700 dark:to-50% dark:to-cyan-900 h-full">
            <div >
              <h2 className="text-2xl font-semibold p-6 text-center text-white">Welcome {user.username}</h2>
              <AqiRecommendations aqi={currentAqi} />

            </div>
            </div>
          </div>

          <div className="bg-surfaceColor dark:bg-surfaceColor rounded-3xl shadow-2xl flex align-middle justify-center items-center">
            <AqiPieChart />
          </div>
          <div className="bg-surfaceColor dark:bg-surfaceColor rounded-3xl shadow-2xl">
            <div className="flex flex-col h-full">
              <h2 className="text-lg uppercase font-semibold text-center mt-6">
                Heatmap Chart
              </h2>
              <div className=" items-center ">
                <Heatmap data={data} width={700} height={400} />
              </div>
            </div>
          </div>
          <div className="bg-surfaceColor dark:bg-surfaceColor rounded-3xl">
            <div className="bg-surfaceColor dark:bg-surfaceColor p-4 rounded-2xl shadow-2xl">
              <h3 className="text-lg font-semibold text-center uppercase mb-4">
                Recent Pollution Reports
              </h3>

              {status === "loading" ? (
                <p>Loading reports...</p>
              ) : pollutions.length === 0 ? (
                <p className="text-gray-500">
                  No pollution reports submitted yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {pollutions.slice(0, 1).map((report, key) => (
                    <div
                      key={report.id}
                      className="bg-white dark:bg-background shadow-md rounded-2xl p-4 border border-gray-300 dark:border-gray-700"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Pollution Type:
                          </p>
                          <p className="text-lg font-semibold">
                            {report.pollutionType}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Location:
                          </p>
                          <p className="text-lg font-semibold">
                            {report.location}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Date Reported:
                          </p>
                          <p className="text-lg font-semibold">{report.date}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Status:
                          </p>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              report.resolved
                                ? "bg-green-500 text-white"
                                : "bg-red-500 text-white"
                            }`}
                          >
                            {report.resolved ? "Resolved" : "Unresolved"}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-500">
                          Description:
                        </p>
                        <p className="text-gray-800 dark:text-gray-300">
                          {report.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Styled Button */}
              <div className="text-center mt-6">
                <button className="bg-primaryBtnBg  text-primaryBtnText font-semibold py-2 px-6 rounded-lg shadow-md transition">
                  <NavLink to={"/report"}>View / Manage Reports</NavLink>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      //{" "}
    </div>
  );
};


export default UserDashboard;