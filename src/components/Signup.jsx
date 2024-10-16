import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar"; // Import the Sidebar component

function Signup() {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthday: "",
    program: "", // Keep program field in the state, but it will be conditionally rendered
    username: "",
    password: "",
    role: "", // Default role is empty to ensure the user selects one
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userID =
      user.role === "student"
        ? "SD" + Math.floor(Math.random() * 10000)
        : "AD" + Math.floor(Math.random() * 10000); // Generates a random ID based on role

    // Add the status field based on the role selected
    const userData = { ...user, userID, status: user.role };

    // Use different localStorage keys for student and admin
    if (user.role === "student") {
      localStorage.setItem("studentUser", JSON.stringify(userData));
    } else if (user.role === "admin") {
      localStorage.setItem("adminUser", JSON.stringify(userData));
    }

    // Navigate to the dashboard
    navigate("/login");
  };

  // Functions to handle navigation for sidebar buttons
  const goHome = () => {
    navigate("/"); // Navigate back to home page
  };

  const goToProgramsCourses = () => {
    navigate("/programs"); // Navigate to programs and courses page
  };

  return (
    <div className="dashboard-layout">
      <Sidebar
        onViewDashboard={goHome} // Home button
        onViewProfile={goToProgramsCourses} // Programs & Courses button
        showRegister={false} // Hide the Register button
        showProfile={true} // Show Programs & Courses button
        showDashboard={true} // Show Home button
        showLogout={false} // Hide the Signup button
        showLogin={false} // Hide the Login button
        dashboardLabel="Home" // Label for Home button
        profileLabel="Programs & Courses" // Label for Programs & Courses button
      />

      <div className="dashboard-content">
        <h1>Bow Course Registration System</h1>
        <h2>Signup</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="firstName"
            placeholder="First Name"
            onChange={handleChange}
            required
          />
          <input
            name="lastName"
            placeholder="Last Name"
            onChange={handleChange}
            required
          />
          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            name="phone"
            placeholder="Phone"
            onChange={handleChange}
            required
          />
          <input
            name="birthday"
            type="date"
            placeholder="Birthday"
            onChange={handleChange}
            required
          />

          {/* Conditionally render the program selection if the user is a student */}
          {user.role === "student" && (
            <select name="program" onChange={handleChange} required>
              <option value="">Select Program</option>
              <option value="Diploma">
                Software Development - Diploma (2 years)
              </option>
              <option value="Post-Diploma">
                Software Development - Post-Diploma (1 year)
              </option>
              <option value="Certificate">
                Software Development - Certificate (6 months)
              </option>
            </select>
          )}

          <input
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          {/* Role Selection: Student or Admin with Placeholder */}
          <select
            name="role"
            value={user.role}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select Role
            </option>
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>

          <button type="submit">Signup</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
