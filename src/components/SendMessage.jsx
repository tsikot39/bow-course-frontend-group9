import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";

const SendMessage = () => {
  const [message, setMessage] = useState("");
  const [confirmation, setConfirmation] = useState(""); // State for confirmation message
  const [student, setStudent] = useState(null); // State to store student details
  const navigate = useNavigate();

  // Fetch student data when the component mounts
  useEffect(() => {
    const storedStudent = JSON.parse(localStorage.getItem("studentUser"));
    if (storedStudent) {
      setStudent(storedStudent);
    }
  }, []);

  // Function to handle message submission
  const handleSendMessage = () => {
    if (!message.trim()) {
      setConfirmation("Please enter a message."); // Set error if no message
      return;
    }

    // Retrieve any existing messages from localStorage
    const storedMessages = JSON.parse(localStorage.getItem("messages")) || [];

    // Construct the message object with the student's userID
    const newMessage = {
      id: Date.now(),
      sender: student ? `${student.firstName} ${student.lastName}` : "Unknown", // Set sender name
      userID: student ? student.userID : "Unknown ID", // Add student userID
      message: message,
      timestamp: new Date().toLocaleString(),
    };

    // Update localStorage with the new message
    localStorage.setItem(
      "messages",
      JSON.stringify([...storedMessages, newMessage])
    );

    // Clear the message textarea after sending and show confirmation
    setMessage("");
    setConfirmation("Message sent to admin.");
  };

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
        <h2>Send Message to Admin</h2>

        <div>
          {student && (
            <p>
              Hi there, {student.firstName} ({student.status})
            </p>
          )}
        </div>

        {/* Display confirmation message with error message style */}
        {confirmation && <p className="error-message">{confirmation}</p>}

        <textarea
          rows="5"
          placeholder="Type your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "5px",
          }}
        />
        <button
          onClick={handleSendMessage}
          style={{
            padding: "10px 20px",
            backgroundColor: "#3498db",
            color: "white",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Send to Admin
        </button>
      </div>
    </div>
  );
};

export default SendMessage;
