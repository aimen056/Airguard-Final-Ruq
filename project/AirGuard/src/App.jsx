import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Provider } from "react-redux"; 
import { AuthProvider } from "./context/AuthContext";
import { AirQualityProvider } from "./context/AirQualityContext";
import { ObservationsProvider } from "./context/AirObservationContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import AboutAirQuality from "./pages/AboutAirQuality";
import LoginPage from "./pages/LoginPage";
import AboutUs from "./pages/AboutUs";
import Dashboard from "./pages/Dashboard";
import FullscreenMapPage from "./components/FullscreenMapPage";
import UserDashboard from "./pages/UserDashboard";
import HistoricalReport from "./pages/HistoricalReport";
import ManageAlert from "./pages/ManageAlert";
import ReportPollution from "./pages/ReportPollution";
import HomeMap from "./components/HomeMap";
import { Toaster } from "react-hot-toast";
import store from "./redux/store"; 
import UserNavBar from "./components/UserNavBar";


function Layout({ children }) {
  const location = useLocation();
  const hideHeaderFooter = location.pathname === "/login";
  const noFooterPages = ["/dashboard"]; // Pages without footer
  const userPages = ["/userdashboard", "/historicalReport", "/manageAlert", "/report"];
  
  const isUserPage = userPages.includes(location.pathname);
  const isNoFooterPage = noFooterPages.includes(location.pathname);

  return (
    <>
      {!hideHeaderFooter && !isUserPage && <Navbar />}
      {!hideHeaderFooter && isUserPage && <UserNavBar />}
      {children}
      {!hideHeaderFooter && !isUserPage && !isNoFooterPage && <Footer />}
    </>
  );
}



function App() {
  const [apiMessage, setApiMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5002/api/aqi?zone=Zone%201&date=today")
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => setApiMessage(data.message))
      .catch((error) => console.error("Error fetching API data:", error));
  }, []);

  return (
    <Provider store={store}>
      <AuthProvider>
        <AirQualityProvider>
          <ObservationsProvider>
            <BrowserRouter>
              <Toaster />
              <Routes>
                <Route path="/" element={<Layout><Home /></Layout>} />
                <Route path="/about-air-quality" element={<Layout><AboutAirQuality /></Layout>} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/about-us" element={<Layout><AboutUs /></Layout>} />
                <Route path="/fullscreenMap" element={<Layout><FullscreenMapPage /></Layout>} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Layout><Dashboard /></Layout>
                  </ProtectedRoute>
                } />
                <Route path="/userdashboard" element={
                  <ProtectedRoute>
                    <Layout><UserDashboard /></Layout>
                  </ProtectedRoute>
                } />
                <Route path="/historicalReport" element={<Layout><HistoricalReport /></Layout>} />
                <Route path="/manageAlert" element={<Layout><ManageAlert /></Layout>} />
                <Route path="/manageAlert/:id" element={<Layout><ManageAlert /></Layout>} />
                <Route path="/report" element={<Layout><ReportPollution /></Layout>} />
                <Route path="/homemap" element={<Layout><HomeMap /></Layout>} />
                <Route path="*" element={<div>Not Found</div>} />
              </Routes>
            </BrowserRouter>
          </ObservationsProvider>
        </AirQualityProvider>
      </AuthProvider>
    </Provider>
  );
}

export default App;