import React, { useState } from "react";
import { Link } from "react-router-dom";
import AirGuardlogo from "../assets/AirGuardlogo.png";
import HomeIcon from "../assets/icons/house-door-fill.svg";
import ShieldIcon from "../assets/icons/shield-shaded.svg";
import MenuIcon from "../assets/icons/menu-button-wide-fill.svg";
import aboutus from "../assets/icons/about.svg";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header>
      <nav className="bg-white border-b shadow-sm">
        <div className="w-full px-4 py-1 flex items-center justify-between">
          {/* Logo aligned left */}
          <Link to="/" className="flex items-center">
            <img src={AirGuardlogo} alt="Logo" className="h-14" />
          </Link>

          {/* Navbar Links Centered */}
          <div className="lg:flex items-center justify-center flex-1 hidden lg:block relative">
            <ul className="flex items-center space-x-8">
              <li>
                <Link
                  to="/"
                  className="flex flex-col items-center text-gray-700 hover:text-green-600 transition no-underline"
                >
               <div className="w-12 h-12 flex justify-center items-center rounded-full hover:bg-green-100 transition-colors duration-300">
  <img 
    src={HomeIcon} 
    alt="Home" 
    className="w-6 h-6 transition-colors duration-300" 
    style={{
      filter: 'invert(43%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(60%) contrast(90%)', // Gray color
    }}
    onMouseOver={(e) => 
      e.currentTarget.style.filter = 'invert(42%) sepia(71%) saturate(329%) hue-rotate(89deg) brightness(90%) contrast(89%)' // Green color on hover
    }
    onMouseOut={(e) => 
      e.currentTarget.style.filter = 'invert(43%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(60%) contrast(90%)' // Reset to gray
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
                  to="/about-air-quality"
                  className="flex flex-col items-center text-gray-700 hover:text-green-600 transition no-underline"
                >
                 <div className="w-12 h-12 flex justify-center items-center rounded-full hover:bg-green-100 transition-colors duration-300">
  <img 
    src={ShieldIcon} 
    alt="Shield" 
    className="w-6 h-6 transition-all duration-300"
    style={{
      filter: 'invert(43%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(60%) contrast(90%)', // Initial gray color
    }}
    onMouseOver={(e) => 
      e.currentTarget.style.filter = 'invert(42%) sepia(71%) saturate(329%) hue-rotate(89deg) brightness(90%) contrast(89%)'// Green on hover
    }
    onMouseOut={(e) => 
      e.currentTarget.style.filter = 'invert(43%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(60%) contrast(90%)' // Reset to gray
    }
  />
</div>

                  <span className="mt-1 text-sm font-semibold">About Air Quality</span>
                </Link>
              </li>
              {/* Vertical Divider */}
              <li>
                <div className="h-10 border-l border-gray-300"></div>
              </li>
              <li>
                <Link
                  to="/about-us"
                  className="flex flex-col items-center text-gray-700 hover:text-green-600 transition no-underline"
                >
                 <div className="w-12 h-12 flex justify-center items-center rounded-full hover:bg-green-100 transition-colors duration-300">
  <img 
    src={aboutus} 
    alt="aboutus" 
    className="w-6 h-6 transition-all duration-300"
    style={{
      filter: 'invert(43%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(60%) contrast(90%)', // Initial gray color
    }}
    onMouseOver={(e) => 
      e.currentTarget.style.filter = 'invert(42%) sepia(71%) saturate(329%) hue-rotate(89deg) brightness(90%) contrast(89%)'// Green on hover
    }
    onMouseOut={(e) => 
      e.currentTarget.style.filter = 'invert(43%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(60%) contrast(90%)' // Reset to gray
    }
  />
</div>

                  <span className="mt-1 text-sm font-semibold">About Us</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Login Button on Right aligned */}
          <div className="hidden lg:block ml-auto">
            <Link
              to="/login"
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition no-underline"
            >
              LOGIN
            </Link>
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
                  to="/"
                  className="text-gray-700 hover:text-green-600 transition no-underline"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about-air-quality"
                  className="text-gray-700 hover:text-green-600 transition no-underline"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About Air Quality
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-red-500 hover:text-red-600 transition no-underline"
                  onClick={() => setIsMenuOpen(false)}
                >
                  LOGIN
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
