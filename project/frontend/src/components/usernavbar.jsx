import React, { useRef, useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import {
  BsExclamationTriangleFill,
  BsFileEarmarkTextFill,
  BsFillBellFill,
  BsFillMoonFill,
  BsFillSunFill,
  BsGridFill,
  BsList,
  BsPersonCircle,
} from "react-icons/bs";
import { motion } from "framer-motion"; // For animation
import logo from "../assets/logoonly.png";
import "./Usernavbar.css";

const UserNavBar = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate
  const [dark, setDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const menuRef = useRef();
  const hamburgerRef = useRef();

  useEffect(() => {
    setSelectedTab(location.pathname);
    localStorage.setItem("selectedTab", location.pathname);
  }, [location.pathname]);

  const handleChangeTab = (tab) => {
    setSelectedTab(tab);
    localStorage.setItem("selectedTab", tab);
  };

  const darkModeHandler = () => {
    setDark((prev) => !prev);
    document.documentElement.classList.toggle("dark");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        !hamburgerRef.current.contains(e.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    setProfileMenuOpen(false); // Close the profile menu
    navigate("/"); // Navigate to home ("/")
  };

  const navLinks = [
    { to: "/userdashboard", icon: <BsGridFill />, label: "Home" },
    { to: "/historicalReport", icon: <BsFileEarmarkTextFill />, label: "Logs" },
    { to: "/manageAlert", icon: <BsFillBellFill />, label: "Manage Alert" },
    { to: "/report", icon: <BsExclamationTriangleFill />, label: "Report" },
  ];

  return (
    <nav className="bg-navBarbg dark:bg-navBarbg text-primaryText backdrop-blur-md dark:text-primaryText flex fixed top-0 left-0 w-full justify-between p-px border-gray-400/35 border-b-[1px] h-16 font-semibold z-20">
      {/* Logo Section */}
      <div className="flex items-center justify-center rounded-3xl w-1/2 md:w-1/6 p-2 font-bold gap-2">
        <img className="object-scale-down h-10" src={logo} alt="Logo" />
        <NavLink to="/userdashboard">
          <span>AIR</span>
          <span className="text-[#FE7D41]">GUARD</span>
        </NavLink>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex flex-row justify-evenly items-center rounded-3xl md:w-2/3 p-2 relative">
        {navLinks.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => handleChangeTab(to)}
            className={`relative z-10 flex flex-row items-center gap-2 px-3 py-1.5 text-sm uppercase cursor-pointer transition-colors ${
              selectedTab === to
                ? " text-primaryBtnText dark:text-primaryBtnText font-bold"
                : "text-primaryText  hover:text-primaryBtnBg hover:dark:text-primaryBtnBg dark:text-primaryText"
            }`}
          >
            {icon}
            <p>{label}</p>
            {selectedTab === to && (
              <motion.div
                layoutId="tab-highlight"
                className="absolute inset-0 rounded-full bg-primaryBtnBg"
                style={{ zIndex: -1 }}
                transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
              />
            )}
          </NavLink>
        ))}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          className="md:hidden flex flex-col text-base bg-white dark:bg-background absolute top-16 left-0 w-full border-t border-gray-200 dark:border-gray-600"
          id="navbar-sticky"
        >
          {navLinks.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className="py-2 px-4 flex font-normal text-sm items-center gap-5 bg:text-white dark:text-primaryText text-primaryText/80 bg-surfaceColor w-full border-b border-b-gray-400/30 md:bg-transparent uppercase"
              onClick={() => setSelectedTab(to)}
            >
              {icon}
              <p>{label}</p>
            </NavLink>
          ))}
        </div>
      )}

      {/* Right-side Items */}
      <div className="flex flex-row justify-evenly items-center rounded-3xl w-1/2 md:w-1/6 p-3">
        {/* Dark Mode Toggle */}
        <button onClick={darkModeHandler}>
          {dark ? (
            <BsFillSunFill className="h-5 w-5" />
          ) : (
            <BsFillMoonFill className="h-5 w-5" />
          )}
        </button>

        {/* Profile Icon */}
        <div className="relative flex items-center justify-center">
          <BsPersonCircle
            className="h-6 w-6 cursor-pointer"
            onClick={() => setProfileMenuOpen((prev) => !prev)}
          />
          
{profileMenuOpen && (
  <div className="absolute top-11 left-1/2 transform -translate-x-1/2 z-50 w-32 text-base dark:text-gray-100 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700">
    <ul className="py-2 text-center">
      <li 
        className="px-4 py-2 text-sm dark:hover:text-primaryText dark:hover:bg-gray-600 hover:bg-gray-100 border-b border-b-gray-400 cursor-pointer"
        onClick={() => {
          setProfileMenuOpen(false);
          navigate("/edit-profile");
        }}
      >
        Profile
      </li>
      <li
        className="px-4 py-2 text-sm dark:hover:text-primaryText dark:hover:bg-gray-600 hover:bg-gray-100 cursor-pointer"
        onClick={handleLogout}
      >
        Logout
      </li>
    </ul>
  </div>
)}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          ref={hamburgerRef}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden focus:outline-none dark:text-primaryText/60"
          aria-controls="navbar-sticky"
          aria-expanded={isMenuOpen ? "true" : "false"}
        >
          <BsList className="h-6 w-6" />
        </button>
      </div>
    </nav>
  );
};

export default UserNavBar;
