import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";

const ViewMessages = () => {
  const [messages, setMessages] = useState([]);
  const [admin, setAdmin] = useState(null); // State for storing admin details
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch messages from localStorage
    const storedMessages = JSON.parse(localStorage.getItem("messages")) || [];
    setMessages(storedMessages);

    // Fetch admin data from localStorage
    const storedAdmin = JSON.parse(localStorage.getItem("adminUser"));
    if (storedAdmin) {
      setAdmin(storedAdmin); // Store admin details
    }
  }, []);

  const handleViewDashboard = () => {
    navigate("/dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUserRole");
    navigate("/");
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
        <h2>Messages from Students</h2>

        {/* Display the admin's name and role */}
        {admin && (
          <p>
            Hi there, {admin.firstName} ({admin.status})
          </p>
        )}

        {messages.length > 0 ? (
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
                  Sender
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
                  Message
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "left",
                  }}
                >
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <tr key={msg._id}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {msg.sender}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {msg.userID}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {msg.message}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {/* Use msg.timestamp instead of createdAt */}
                    {msg.timestamp
                      ? new Date(msg.timestamp).toLocaleString()
                      : "No date available"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No messages available.</p>
        )}
      </div>
    </div>
  );
};

export default ViewMessages;
