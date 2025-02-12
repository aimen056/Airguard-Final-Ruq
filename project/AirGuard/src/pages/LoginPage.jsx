import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [currentView, setCurrentView] = useState("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    contact: "",
    dob: "",
    country: "Pakistan",
    city: "",
    notificationType: "",
    alertFrequency: "",
    diseases: [],
    wantsAlerts: false,
  });

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Login attempt with:", formData);
  
    if (!formData.email || !formData.password) {
      alert("Please enter email and password.");
      return;
    }
  
    // Check for specific credentials
    if (formData.email === "airguardteam@gmail.com" && formData.password === "airguardteam") {
      console.log("Login successful. Redirecting to Dashboard...");
      localStorage.setItem("token", "dummy-token-for-airguardteam");
      localStorage.setItem("user", JSON.stringify({ email: formData.email, loggedIn: true }));
      alert("Login successful! Redirecting to Dashboard...");
      navigate("/dashboard");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5002/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
  
      const data = await response.json();
      console.log("Login Response:", data);
  
      if (response.ok) {
        console.log("Login successful. Redirecting to User Dashboard...");
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify({ ...data.user, loggedIn: true }));
        alert("Login successful! Redirecting to User Dashboard...");
        navigate("/userdashboard"); 
      } else {
        console.log("Login failed:", data);
        alert(data.error || "Login failed!");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong during login.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      if (type === "checkbox") {
        if (name === "wantsAlerts") {
          return {
            ...prev,
            wantsAlerts: checked,
            ...(checked ? {} : { diseases: [], notificationType: "", alertFrequency: "" }),
          };
        } else if (name === "diseases") {
          return {
            ...prev,
            diseases: checked ? [...prev.diseases, value] : prev.diseases.filter((d) => d !== value),
          };
        } else {
          return { ...prev, [name]: checked };
        }
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (formData.password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    if (!formData.email.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }

    if (formData.wantsAlerts) {
      setCurrentView("alert");
      return;
    }

    await registerUser();
  };

  const handleAlertSubmit = async (e) => {
    e.preventDefault();

    if (!formData.notificationType || !formData.alertFrequency) {
      alert("Please select both notification type and alert frequency.");
      return;
    }

    await registerUser();
  };

  const registerUser = async () => {
    try {
      const response = await fetch("http://localhost:5002/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          contact: formData.contact || "",
          dob: formData.dob || "",
          country: formData.country || "",
          city: formData.city || "",
          wantsAlerts: formData.wantsAlerts,
          ...(formData.wantsAlerts && {
            diseases: formData.diseases || [],
            notificationType: formData.notificationType || "",
            alertFrequency: formData.alertFrequency || "",
          }),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      alert(data.message);
      setCurrentView("thankyou");
    } catch (error) {
      console.error("Signup error:", error);
      alert(error.message || "Something went wrong during signup.");
    }
  };

  const handleForgotPassword = async (event) => {
    event.preventDefault();
  
    if (!formData.email) {
      alert("Please enter your email");
      return;
    }
  
    try {
      // Send a request to your backend to generate a reset link
      const response = await fetch("http://localhost:5002/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Open the user's email client with a pre-filled email
        const subject = "Password Reset Request";
        const body = `Click the link below to reset your password:\n\n${data.resetLink}`; // Assuming the backend returns a reset link
        const mailtoLink = `mailto:${formData.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  
        // Open the default email client
        window.location.href = mailtoLink;
  
        alert("Password reset link sent to your email!");
      } else {
        alert(data.error || "Something went wrong!");
      }
    } catch (error) {
      console.error("Error sending reset link:", error);
      alert("Failed to send reset link. Please try again later.");
    }
  };

  const toggleView = (view) => {
    if (view === "signup" && currentView === "login" && formData.email) {
      setFormData((prev) => ({ ...prev, email: prev.email }));
    }
    setCurrentView(view);
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-gradient-to-r from-green-900 to-orange-400 font-sans">
      <div className="w-full max-w-screen-lg bg-white rounded-lg shadow-lg overflow-hidden flex flex-col sm:flex-row">
        {currentView === 'thankyou' ? (
          <div className="w-full h-full flex">
            <div className="w-full sm:w-1/2 bg-gradient-to-r from-orange-400 to-green-900 text-white flex flex-col justify-center items-center p-8">
              <h1 className="text-3xl mb-4">Thank You for Registering!</h1>
              <p className="text-lg">Your account has been created successfully.</p>
            </div>
            <div className="w-full sm:w-1/2 p-8 flex flex-col items-center">
              <h2 className="text-[#00796B] text-2xl mb-4">What’s Next?</h2>
              <p className="mb-4">Explore your Dashboard or set up additional preferences.</p>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="bg-[#00796B] text-white px-4 py-2 rounded hover:bg-orange-400 transition duration-300 animate-flipIn"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        ) : currentView === 'forgotPassword' ? (
          <div className="w-full h-full flex flex-col items-center p-8">
    <h2 className="text-[#00796B] text-3xl mb-4">Reset Password</h2>
    <p className="mb-4 text-center">Enter your email to receive password reset instructions.</p>
    <form onSubmit={handleForgotPassword} className="flex flex-col gap-4 w-full max-w-sm">
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder="Email"
        className="border border-gray-400 bg-gray-100 text-gray-800 rounded p-2 focus:ring-2 focus:ring-gray-300"
        required
      />
      <button
        type="submit"
        className="bg-[#00796B] text-white px-4 py-2 rounded hover:bg-orange-400 transition duration-300"
      >
        Send Reset Link
      </button>
      <button
        type="button"
        onClick={() => setCurrentView('login')}
        className="text-orange-400 hover:underline text-sm"
      >
        Back to Login
      </button>
    </form>
  </div>
        ) : currentView === 'alert' ? (
          <div className="flex justify-between w-full max-w-screen-lg bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="w-full sm:w-1/2 bg-gradient-to-r from-orange-400 to-green-900 text-white flex flex-col justify-center items-center p-8">
              <h1 className="text-3xl mb-4 animate-flipIn">Alert Preferences</h1>
              <p className="text-lg animate-flipIn">Set up personalized alerts for better health and updates.</p>
            </div>
            <div className="w-full sm:w-1/2 p-8 flex flex-col">
              <h2 className="text-[#00796B] text-2xl mb-4">Set Alerts</h2>
              <form onSubmit={handleAlertSubmit} className="flex flex-col gap-4">
                <select
                  name="notificationType"
                  value={formData.notificationType}
                  onChange={handleInputChange}
                  className="border border-gray-400 bg-gray-100 text-gray-800 rounded p-2 focus:ring-2 focus:ring-gray-300"
                  required
                >
                  <option value="">Notification Type</option>
                  <option value="Email">Email</option>
                  <option value="SMS">SMS</option>
                </select>
                <select
                  name="alertFrequency"
                  value={formData.alertFrequency}
                  onChange={handleInputChange}
                  className="border border-gray-400 bg-gray-100 text-gray-800 rounded p-2 focus:ring-2 focus:ring-gray-300"
                  required
                >
                  <option value="">Alert Frequency</option>
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                </select>
                <p className="text-sm">Do you have a history of any of these diseases?</p>
                {['Respiratory conditions', 'Cardiovascular disease', 'Chronic Diseases & Other Conditions'].map((disease) => (
                  <label key={disease} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="diseases"
                      value={disease}
                      onChange={handleInputChange}
                      className="w-4 h-4 border border-gray-400 bg-white-100 text-gray-800 rounded focus:ring-2 focus:ring-gray-300"
                    />
                    {disease}
                  </label>
                ))}
                <button
                  type="submit"
                  className="bg-[#00796B] text-white px-4 py-2 rounded hover:bg-orange-400 transition duration-300"
                >
                  Finish
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col sm:flex-row">
            <div className="w-full sm:w-1/2 bg-gradient-to-r from-orange-400 to-green-900 text-white flex flex-col justify-center items-center p-8">
              <h1 className="text-3xl mb-4 animate-flipIn">
                {currentView === 'signup' ? 'Join Us Today!' : 'Welcome Back!'}
              </h1>
              <p className="text-lg animate-flipIn">
                {currentView === 'signup'
                  ? 'Create your account to access personalized updates.'
                  : 'Sign in to continue to your Dashboard.'}
              </p>
              <secondary button
                onClick={() => toggleView(currentView === 'signup' ? 'login' : 'signup')}
                className="border border-white rounded-full px-6 py-2 mt-4 hover:bg-white hover:text-[#00796B] transition duration-300"
              >
                {currentView === 'signup'
                  ? 'Already have an account? Sign In'
                  : "Don't have an account? Sign Up"}
              </secondary>
            </div>
            <div className="w-full sm:w-1/2 p-8 flex flex-col items-center">
              <h2 className="text-[#00796B] text-3xl mb-4 animate-flipIn">
                {currentView === 'signup' ? 'Create Account' : 'Sign In'}
              </h2>
              <form
                onSubmit={currentView === "signup" ? handleSignUpSubmit : handleLogin}
                className="flex flex-col gap-4 w-full max-w-sm animate-flipIn"
              >
                {currentView === 'signup' ? (
                  <>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Full Name"
                      className="border border-gray-400 bg-gray-100 text-gray-800 rounded p-2 focus:ring-2 focus:ring-gray-300"
                      required
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email"
                      className="border border-gray-400 bg-gray-100 text-gray-800 rounded p-2 focus:ring-2 focus:ring-gray-300"
                      required
                    />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Password"
                      className="border border-gray-400 bg-gray-100 text-gray-800 rounded p-2 focus:ring-2 focus:ring-gray-300"
                      required
                    />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm Password"
                      className="border border-gray-400 bg-gray-100 text-gray-800 rounded p-2 focus:ring-2 focus:ring-gray-300"
                      required
                    />
                    <input
                      type="text"
                      name="contact"
                      value={formData.contact}
                      onChange={handleInputChange}
                      placeholder="Contact Number"
                      className="border border-gray-400 bg-gray-100 text-gray-800 rounded p-2 focus:ring-2 focus:ring-gray-300"
                    />
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      className="border border-gray-400 bg-gray-100 text-gray-800 rounded p-2 focus:ring-2 focus:ring-gray-300"
                      required
                    />
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="City"
                      className="border border-gray-400 bg-gray-100 text-gray-800 rounded p-2 focus:ring-2 focus:ring-gray-300"
                    />
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="border border-gray-400 bg-gray-100 text-gray-800 rounded p-2 focus:ring-2 focus:ring-gray-300"
                    >
                      <option value="Pakistan">Pakistan</option>
                      <option value="USA">USA</option>
                      <option value="UK">UK</option>
                    </select>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="wantsAlerts"
                        checked={formData.wantsAlerts}
                        onChange={handleInputChange}
                        className="w-4 h-4 border border-gray-400 bg-white text-gray-800 rounded focus:ring-2 focus:ring-gray-300"
                      />
                      I want to receive alerts
                    </label>
                  </>
                ) : (
                  <>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email"
                      className="border border-gray-400 bg-gray-100 text-gray-800 rounded p-2 focus:ring-2 focus:ring-gray-300"
                      required
                    />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Password"
                      className="border border-gray-400 bg-gray-100 text-gray-800 rounded p-2 focus:ring-2 focus:ring-gray-300"
                      required
                    />
                    <div className="options flex justify-between items-center mt-2">
                      <label className="flex items-center gap-1 text-gray-800">
                        <input type="checkbox" className="w-4 h-4 border border-gray-400 bg-white text-gray-800 rounded focus:ring-2 focus:ring-gray-300" /> Remember Me
                      </label>
                      <a
                        href="#"
                        className="text-orange-400 hover:underline text-sm"
                        onClick={() => setCurrentView('forgotPassword')}
                      >
                        Forgot Password?
                      </a>
                    </div>
                  </>
                )}
                <button
                  type="submit"
                  className="bg-[#00796B] text-white px-4 py-2 rounded hover:bg-orange-400 transition duration-300"
                >
                  {currentView === "signup" ? "Sign Up" : "Sign In"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;