import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar"; // Import the Sidebar component

function Profile() {
  const [user, setUser] = useState(null); // State to hold user data
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve the current user role from localStorage
    const currentUserRole = localStorage.getItem("currentUserRole");

    // Based on the role, retrieve the respective user data (student or admin)
    if (currentUserRole === "student") {
      const storedStudentUser = localStorage.getItem("studentUser");
      if (storedStudentUser) {
        setUser(JSON.parse(storedStudentUser)); // Parse and set student data
      }
    } else if (currentUserRole === "admin") {
      const storedAdminUser = localStorage.getItem("adminUser");
      if (storedAdminUser) {
        setUser(JSON.parse(storedAdminUser)); // Parse and set admin data
      }
    }
  }, []);

  const handleViewDashboard = () => {
    navigate("/dashboard"); // Navigate to Dashboard
  };

  const handleLogout = () => {
    navigate("/"); // Redirect to the Welcome component
  };

  return (
    <div className="dashboard-layout">
      <Sidebar
        onViewDashboard={handleViewDashboard}
        onLogout={handleLogout}
        showRegister={false} // Hide the Register button
        showProfile={false} // Hide the View Profile button
        showMessage={false} // Hide the Send Message button
        showDashboard={true} // Show the Dashboard button
        showLogout={true} // Show the Logout button
        dashboardLabel="Dashboard" // Label for the Dashboard button
        logoutLabel="Logout" // Label for the Logout button
      />

      <div className="dashboard-content">
        <h1>Bow Course Registration System</h1>
        <h2>User Profile</h2>
        {user ? (
          <div>
            <p>First Name: {user.firstName}</p>
            <p>Last Name: {user.lastName}</p>
            <p>Email: {user.email}</p>
            <p>Phone: {user.phone}</p>
            <p>Birthday: {user.birthday}</p>
            {/* Conditionally render the program field only for students */}
            {user.status === "student" && <p>Program: {user.program}</p>}
            <p>Username: {user.username}</p>
            {/* Display "Student ID" for students and "Admin ID" for admins */}
            <p>
              {user.status === "student" ? "Student ID" : "Admin ID"}:{" "}
              {user.userID}
            </p>
          </div>
        ) : (
          <p>No profile data available</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
