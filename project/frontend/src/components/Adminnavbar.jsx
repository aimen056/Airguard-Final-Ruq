import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import AirGuardlogo from "../assets/AirGuardlogo.png";
import HomeIcon from "../assets/icons/house-door-fill.svg";
import LogsIcon from "../assets/icons/file-earmark-text-fill.svg"; // Example icon for logs
import MenuIcon from "../assets/icons/menu-button-wide-fill.svg";
import { BsFillMoonFill, BsFillSunFill } from "react-icons/bs"; // Import icons for dark mode toggle
import { FiLogOut } from "react-icons/fi"; // Import logout icon

const AdminNavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // State for dark mode
  const navigate = useNavigate(); // Hook for navigation

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    document.documentElement.classList.toggle("dark"); // Toggle dark mode class on the root element
  };

  // Function to handle logout
  const handleLogout = () => {
    // Clear user authentication tokens or session
    localStorage.removeItem("authToken"); // Example: Remove token from localStorage
    localStorage.removeItem("userRole"); // Example: Remove user role

    // Redirect to the login page
    navigate("/");
  };

  return (
    <header className="w-full">
      <nav className="bg-white border-b shadow-sm w-full">
        <div className="w-full px-4 py-1 flex items-center justify-between">
          {/* Logo aligned left */}
          <Link to="/dashboard" className="flex items-center">
            <img src={AirGuardlogo} alt="Logo" className="h-14" />
          </Link>

          {/* Navbar Links Centered */}
          <div className="lg:flex items-center justify-center flex-1 hidden lg:block relative">
            <ul className="flex items-center space-x-8">
              <li>
                <Link
                  to="/dashboard"
                  className="flex flex-col items-center text-gray-700 hover:text-green-600 transition no-underline"
                >
                  <div className="w-12 h-12 flex justify-center items-center rounded-full hover:bg-green-100 transition-colors duration-300">
                    <img
                      src={HomeIcon}
                      alt="Home"
                      className="w-6 h-6 transition-colors duration-300"
                      style={{
                        filter:
                          "invert(43%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(60%) contrast(90%)", // Gray color
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.filter =
                          "invert(42%) sepia(71%) saturate(329%) hue-rotate(89deg) brightness(90%) contrast(89%)") // Green color on hover
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.filter =
                          "invert(43%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(60%) contrast(90%)") // Reset to gray
                      }
                    />
                  </div>
                  <span className="mt-1 text-sm font-semibold">Home</span>
                </Link>
              </li>
              {/* Vertical Divider */}
              <li>
                <div className="h-10 border-l border-gray-300"></div>
              </li>
              <li>
                <Link
                  to="/historicalReportAdmin"
                  className="flex flex-col items-center text-gray-700 hover:text-green-600 transition no-underline"
                >
                  <div className="w-12 h-12 flex justify-center items-center rounded-full hover:bg-green-100 transition-colors duration-300">
                    <img
                      src={LogsIcon}
                      alt="Logs"
                      className="w-6 h-6 transition-all duration-300"
                      style={{
                        filter:
                          "invert(43%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(60%) contrast(90%)", // Initial gray color
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.filter =
                          "invert(42%) sepia(71%) saturate(329%) hue-rotate(89deg) brightness(90%) contrast(89%)") // Green on hover
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.filter =
                          "invert(43%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(60%) contrast(90%)") // Reset to gray
                      }
                    />
                  </div>
                  <span className="mt-1 text-sm font-semibold">Logs</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Dark Mode Toggle Button and Logout Button */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-300"
            >
              {darkMode ? (
                <BsFillSunFill className="h-5 w-5 text-yellow-500" /> // Sun icon for light mode
              ) : (
                <BsFillMoonFill className="h-5 w-5 text-gray-700" /> // Moon icon for dark mode
              )}
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-300"
            >
              <FiLogOut className="h-5 w-5 text-gray-700" /> {/* Logout icon */}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              className="text-[#FF7F50] bg-[#00796B] p-2 rounded-lg border border-[#00796B] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[#00796B]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <img src={MenuIcon} alt="Menu" className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t">
            <ul className="flex flex-col items-center space-y-4 py-4">
              <li>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-green-600 transition no-underline"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/historicalReportAdmin"
                  className="text-gray-700 hover:text-green-600 transition no-underline"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Logs
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-green-600 transition no-underline"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

export default AdminNavBar;