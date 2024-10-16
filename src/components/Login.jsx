import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar"; // Import the Sidebar component

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Retrieve stored student and admin user data from localStorage
    const storedStudentUser = JSON.parse(localStorage.getItem("studentUser"));
    const storedAdminUser = JSON.parse(localStorage.getItem("adminUser"));

    // Check if the username and password match the stored student data
    if (
      storedStudentUser &&
      storedStudentUser.username === username &&
      storedStudentUser.password === password
    ) {
      // Set the current role to "student"
      localStorage.setItem("currentUserRole", "student");

      // Navigate to the dashboard
      navigate("/dashboard");
    }
    // Check if the username and password match the stored admin data
    else if (
      storedAdminUser &&
      storedAdminUser.username === username &&
      storedAdminUser.password === password
    ) {
      // Set the current role to "admin"
      localStorage.setItem("currentUserRole", "admin");

      // Navigate to the dashboard
      navigate("/dashboard");
    } else {
      // Display error if the login credentials are incorrect
      setError("Invalid username or password");
    }
  };

  const goHome = () => {
    navigate("/"); // Navigate back to home page
  };

  const goToProgramsCourses = () => {
    navigate("/programs"); // Navigate to the programs and courses component
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar with Home and Programs & Courses buttons */}
      <Sidebar
        onViewDashboard={goHome}
        onViewProfile={goToProgramsCourses} // Programs & Courses Button
        showRegister={false} // Hide the Register button
        showProfile={true} // Show Programs & Courses button
        showMessage={false} // Hide the Send Message button
        showDashboard={true} // Show Home button
        showLogout={false} // Hide the Logout button
        dashboardLabel="Home" // Updated label for the Home button
        profileLabel="Programs & Courses" // Label for Programs & Courses button
      />

      <div className="dashboard-content">
        <h1>Bow Course Registration System</h1>
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
