import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { AuthProvider } from "./context/AuthContext";
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
import HistoricalReportAdmin from "./pages/HistoricalReportAdmin";
import ManageAlert from "./pages/ManageAlert";
import ReportPollution from "./pages/ReportPollution";
import HomeMap from "./components/HomeMap";
import { Toaster } from "react-hot-toast";
import store from "./redux/store";
import UserNavBar from "./components/usernavbar";
import AdminNavBar from "./components/Adminnavbar";
import EditProfile from "./components/EditProfile";

function AuthInitializer({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    
    if (token && user) {
      setIsAuthenticated(true);
      setUserRole(user.email === "airguardteam@gmail.com" ? "admin" : "user");
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  return React.cloneElement(children, { isAuthenticated, userRole });
}

function Layout({ children, isAuthenticated, userRole }) {
  const location = useLocation();
  const hideHeaderFooter = location.pathname === "/login";
  const noFooterPages = ["/dashboard"];
  const userPages = ["/userdashboard", "/historicalReport", "/manageAlert", "/report", "/edit-profile"];
  const adminPages = ["/dashboard", "/historicalReportAdmin"];

  const isUserPage = userPages.includes(location.pathname);
  const isAdminPage = adminPages.includes(location.pathname);

  // Redirect logic based on authentication status
  if (isAuthenticated === false && location.pathname !== "/login") {
    return <Navigate to="/login" replace />;
  }

  if (isAuthenticated && location.pathname === "/login") {
    return <Navigate to={userRole === "admin" ? "/dashboard" : "/userdashboard"} replace />;
  }

  return (
    <>
      {!hideHeaderFooter && !isUserPage && !isAdminPage && <Navbar />}
      {!hideHeaderFooter && isUserPage && <UserNavBar />}
      {!hideHeaderFooter && isAdminPage && <AdminNavBar />}
      {children}
      {!hideHeaderFooter && !isUserPage && !isAdminPage && !noFooterPages.includes(location.pathname) && <Footer />}
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
        <BrowserRouter>
          <Toaster />
          <Routes>
            <Route path="/" element={
              <AuthInitializer>
                <Layout>
                  <Home />
                </Layout>
              </AuthInitializer>
            } />
            <Route path="/about-air-quality" element={
              <AuthInitializer>
                <Layout>
                  <AboutAirQuality />
                </Layout>
              </AuthInitializer>
            } />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/about-us" element={
              <AuthInitializer>
                <Layout>
                  <AboutUs />
                </Layout>
              </AuthInitializer>
            } />
            <Route path="/fullscreenMap" element={
              <AuthInitializer>
                <Layout>
                  <FullscreenMapPage />
                </Layout>
              </AuthInitializer>
            } />
            <Route path="/dashboard" element={
              <AuthInitializer>
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              </AuthInitializer>
            } />
            <Route path="/userdashboard" element={
              <AuthInitializer>
                <ProtectedRoute>
                  <Layout>
                    <UserDashboard />
                  </Layout>
                </ProtectedRoute>
              </AuthInitializer>
            } />
            <Route path="/historicalReportAdmin" element={
              <AuthInitializer>
                <Layout>
                  <HistoricalReportAdmin />
                </Layout>
              </AuthInitializer>
            } />
            <Route path="/historicalReport" element={
              <AuthInitializer>
                <Layout>
                  <HistoricalReport />
                </Layout>
              </AuthInitializer>
            } />
            <Route path="/manageAlert" element={
              <AuthInitializer>
                <Layout>
                  <ManageAlert />
                </Layout>
              </AuthInitializer>
            } />
            <Route path="/manageAlert/:id" element={
              <AuthInitializer>
                <Layout>
                  <ManageAlert />
                </Layout>
              </AuthInitializer>
            } />
            <Route path="/report" element={
              <AuthInitializer>
                <Layout>
                  <ReportPollution />
                </Layout>
              </AuthInitializer>
            } />
            <Route path="/homemap" element={
              <AuthInitializer>
                <Layout>
                  <HomeMap />
                </Layout>
              </AuthInitializer>
            } />
            <Route path="/edit-profile" element={
              <AuthInitializer>
                <ProtectedRoute>
                  <Layout>
                    <EditProfile />
                  </Layout>
                </ProtectedRoute>
              </AuthInitializer>
            } />
            <Route path="*" element={<div>Not Found</div>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  );
}

export default App;