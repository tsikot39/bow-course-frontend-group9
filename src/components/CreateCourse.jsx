import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar"; // Import the Sidebar component

const CreateCourse = () => {
  const [course, setCourse] = useState({
    name: "",
    code: "",
    term: "",
    startDate: "",
    endDate: "",
    program: "", // Add program field to the course state
  });
  const [admin, setAdmin] = useState(null); // Store admin data
  const navigate = useNavigate();

  // Fetch admin data from localStorage on component mount
  useEffect(() => {
    const storedAdmin = JSON.parse(localStorage.getItem("adminUser"));
    if (storedAdmin) {
      setAdmin(storedAdmin);
    }
  }, []);

  // Handle input changes for the form
  const handleChange = (e) => {
    setCourse({
      ...course,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission and storing course data in localStorage
  const handleSubmit = (e) => {
    e.preventDefault();

    // Retrieve existing courses from localStorage or create an empty array if none exist
    const existingCourses =
      JSON.parse(localStorage.getItem("createdCourses")) || [];

    // Add a unique ID to the new course and store all the course data
    const newCourse = { ...course, id: Math.floor(Math.random() * 10000) };

    // Store the updated course list in localStorage
    localStorage.setItem(
      "createdCourses",
      JSON.stringify([...existingCourses, newCourse])
    );

    // Redirect back to dashboard after creating the course
    navigate("/dashboard");
  };

  // Handle logout action
  const handleLogout = () => {
    localStorage.removeItem("currentUserRole"); // Clear the current user role on logout
    navigate("/"); // Redirect to the home page after logout
  };

  // Handle navigating to dashboard
  const handleViewDashboard = () => {
    navigate("/dashboard"); // Navigate to the Dashboard
  };

  return (
    <div className="dashboard-layout">
      <Sidebar
        onViewDashboard={handleViewDashboard} // Redirect to Dashboard
        onLogout={handleLogout} // Handle Logout
        showDashboard={true} // Show Dashboard button
        showLogout={true} // Show Logout button
        dashboardLabel="Dashboard" // Ensure the label is "Dashboard"
      />

      <div className="dashboard-content">
        <h1>Bow Course Registration System</h1>
        <h2>Create New Course</h2>

        {admin && (
          <p>
            Hi there, {admin.firstName} ({admin.status})
          </p>
        )}

        <form onSubmit={handleSubmit}>
          {/* Add the Program Select Dropdown */}
          <select
            name="program"
            value={course.program}
            onChange={handleChange}
            required
          >
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

          {/* Add the Term Select Dropdown */}
          <select
            name="term"
            value={course.term}
            onChange={handleChange}
            required
          >
            <option value="">Select Term</option>
            <option value="Winter">Winter</option>
            <option value="Spring">Spring</option>
            <option value="Summer">Summer</option>
            <option value="Fall">Fall</option>
          </select>

          <input
            type="text"
            name="name"
            placeholder="Course Name"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="code"
            placeholder="Course Code"
            onChange={handleChange}
            required
          />

          <input
            type="date"
            name="startDate"
            placeholder="Start Date"
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="endDate"
            placeholder="End Date"
            onChange={handleChange}
            required
          />
          <button type="submit">Create Course</button>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;
