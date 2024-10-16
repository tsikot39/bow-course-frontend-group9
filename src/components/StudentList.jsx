import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [admin, setAdmin] = useState(null); // State for storing admin details
  const navigate = useNavigate();

  // Fetch student data from localStorage using the "studentUser" key
  useEffect(() => {
    const storedStudent = JSON.parse(localStorage.getItem("studentUser"));
    if (storedStudent) {
      setStudents([storedStudent]); // Assuming single student, so wrapped in an array
    }

    // Fetch admin data from localStorage
    const storedAdmin = JSON.parse(localStorage.getItem("adminUser"));
    if (storedAdmin) {
      setAdmin(storedAdmin); // Store admin details
    }
  }, []);

  const handleViewDashboard = () => {
    navigate("/dashboard"); // Navigate to the dashboard
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUserRole"); // Clear user session or role
    navigate("/"); // Navigate to home or login page after logout
  };

  return (
    <div className="dashboard-layout">
      <Sidebar
        showDashboard={true}
        onViewDashboard={handleViewDashboard}
        showLogout={true}
        onLogout={handleLogout}
        dashboardLabel="Dashboard"
      />
      <div className="dashboard-content">
        <h1>Bow Course Registration System</h1>
        <h2>Registered Students</h2>

        {/* Display the admin's name and role */}
        {admin && (
          <p>
            Hi there, {admin.firstName} ({admin.status})
          </p>
        )}

        {students.length > 0 ? (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "left",
                  }}
                >
                  Name
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "left",
                  }}
                >
                  Student ID
                </th>

                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "left",
                  }}
                >
                  Program
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.userID}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {student.firstName} {student.lastName}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {student.userID}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {student.program}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No students registered yet.</p>
        )}
      </div>
    </div>
  );
};

export default StudentList;
