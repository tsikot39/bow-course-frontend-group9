import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

function Courses() {
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [term, setTerm] = useState(""); // Term selection
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term
  const [createdCourses, setCreatedCourses] = useState([]); // Store courses from localStorage
  const [student, setStudent] = useState(null); // Store student data
  const navigate = useNavigate();

  // Fetch student data on component mount
  useEffect(() => {
    const storedStudent = JSON.parse(localStorage.getItem("studentUser"));
    if (storedStudent) {
      setStudent(storedStudent);
    }
  }, []);

  // Fetch courses from localStorage when the term is selected
  useEffect(() => {
    if (term) {
      const storedCourses =
        JSON.parse(localStorage.getItem("createdCourses")) || [];
      setCreatedCourses(storedCourses.filter((course) => course.term === term));
    }
  }, [term]);

  // Load selected courses from localStorage on component mount
  useEffect(() => {
    const storedSelectedCourses = localStorage.getItem("selectedCourses");
    if (storedSelectedCourses) {
      setSelectedCourses(JSON.parse(storedSelectedCourses));
    }
  }, []);

  // Helper function to check if a course is already selected in the same term
  const isCourseSelectedInTerm = (course) => {
    return selectedCourses.some(
      (selectedCourse) =>
        selectedCourse.id === course.id && selectedCourse.term === course.term
    );
  };

  const handleCourseSelect = (course) => {
    // Validate that no more than 5 courses can be selected
    if (selectedCourses.length >= 5) {
      setErrorMessage("You can only register for up to 5 courses per term.");
      return;
    }

    // Validate that the same course can't be selected twice in the same term
    if (isCourseSelectedInTerm(course)) {
      setErrorMessage(
        "You cannot register for the same course twice in the same term."
      );
      return;
    }

    // Clear any previous errors and add the selected course
    setErrorMessage("");
    const updatedCourses = [...selectedCourses, course];
    setSelectedCourses(updatedCourses);
    localStorage.setItem("selectedCourses", JSON.stringify(updatedCourses)); // Save to localStorage
  };

  const handleCourseRemove = (course) => {
    const updatedCourses = selectedCourses.filter((c) => c.id !== course.id);
    setSelectedCourses(updatedCourses);
    localStorage.setItem("selectedCourses", JSON.stringify(updatedCourses)); // Update localStorage
  };

  const handleSaveCourses = () => {
    // Ensure a term is selected
    if (!term) {
      setErrorMessage("Please select a term before saving courses.");
      return;
    }

    // Ensure at least 2 courses are selected
    if (selectedCourses.length < 2) {
      setErrorMessage("You must register for at least 2 courses.");
      return;
    }

    // Clear error and save courses to localStorage if condition is met
    setErrorMessage("");
    localStorage.setItem("selectedCourses", JSON.stringify(selectedCourses));
    navigate("/dashboard");
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const handleLogout = () => {
    navigate("/"); // Redirect to the welcome page
  };

  // Filter courses based on the selected term from localStorage and search term
  const filteredCourses = createdCourses.filter(
    (course) =>
      (searchTerm === "" || // Match the search term (name or code) or show all if search term is not provided
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase())) &&
      !isCourseSelectedInTerm(course) // Exclude already selected courses in the same term
  );

  return (
    <div className="dashboard-layout">
      <Sidebar
        onViewDashboard={handleBackToDashboard}
        onLogout={handleLogout}
        showRegister={false} // Hide "Register for Courses" button since we're in courses
        showProfile={false} // Hide "View Profile" button
        showMessage={false} // Hide "Send Message" button
        showDashboard={true} // Show "Dashboard" button
        showLogout={true} // Show "Logout" button
        dashboardLabel="Dashboard"
        logoutLabel="Logout"
      />

      <div className="dashboard-content">
        <h1>Bow Course Registration System</h1>
        <h2>Register for Courses</h2>

        {/* Display the student's name */}
        {student && (
          <p>
            Hi there, {student.firstName} ({student.status})
          </p>
        )}

        {/* Display error message */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {/* Term Selection */}
        <div className="select-term-section">
          <label>Select Term</label>
          <select
            value={term}
            onChange={(e) => {
              setTerm(e.target.value);
              if (e.target.value) {
                setErrorMessage(""); // Clear the error message once a term is selected
              }
            }}
            required
          >
            <option value="" disabled>
              Choose Term
            </option>
            <option value="Spring">Spring</option>
            <option value="Summer">Summer</option>
            <option value="Fall">Fall</option>
            <option value="Winter">Winter</option>
          </select>
        </div>

        {/* Search Input (enabled only after selecting a term) */}
        {term && (
          <div className="search-section">
            <label>Search Courses</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by course name or code"
            />
          </div>
        )}

        {/* Show courses only after selecting a term */}
        {term && (
          <ul className="courses-list">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <li key={course.id}>
                  {course.name} ({course.code}) - {course.term}
                  <button onClick={() => handleCourseSelect(course)}>
                    Add
                  </button>
                </li>
              ))
            ) : (
              <p>
                No courses available for the selected term or search criteria.
              </p>
            )}
          </ul>
        )}

        <label>Selected Courses</label>
        {selectedCourses.length > 0 ? (
          <ul className="selected-courses-list">
            {selectedCourses.map((course) => (
              <li key={course.id}>
                {course.name} ({course.code}) - {course.term}
                <button onClick={() => handleCourseRemove(course)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No courses selected.</p> // Display message if no selected courses
        )}

        <button onClick={handleSaveCourses}>Save Courses</button>
      </div>
    </div>
  );
}

export default Courses;
