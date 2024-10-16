import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import coursesData from "../data/coursesData";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [program, setProgram] = useState(""); // New state for selected program
  const [term, setTerm] = useState(""); // State for selected term
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const currentUserRole = localStorage.getItem("currentUserRole");

    let storedUser;
    if (currentUserRole === "student") {
      storedUser = JSON.parse(localStorage.getItem("studentUser"));
    } else if (currentUserRole === "admin") {
      storedUser = JSON.parse(localStorage.getItem("adminUser"));
    }

    if (storedUser) {
      setUser(storedUser);
    }

    if (currentUserRole === "student") {
      const storedCourses = localStorage.getItem("selectedCourses");
      if (storedCourses) {
        setSelectedCourses(JSON.parse(storedCourses));
      }
    }
  }, []);

  const handleProgramChange = (e) => {
    const selectedProgram = e.target.value;
    setProgram(selectedProgram);

    filterCourses(selectedProgram, term); // Filter courses by both program and term
  };

  const handleTermChange = (e) => {
    const selectedTerm = e.target.value;
    setTerm(selectedTerm);

    filterCourses(program, selectedTerm); // Filter courses by both program and term
  };

  const filterCourses = (program, term) => {
    const createdCourses =
      JSON.parse(localStorage.getItem("createdCourses")) || [];
    const allCourses = [...coursesData, ...createdCourses];

    // Filter based on both program and term
    const filtered = allCourses.filter(
      (course) =>
        (!program || course.program === program) &&
        (!term || course.term === term)
    );

    setFilteredCourses(filtered);
  };

  const handleEditCourse = (course) => {
    setIsEditing(true);
    setCurrentCourse(course);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();

    // Get the existing created courses from localStorage
    const createdCourses =
      JSON.parse(localStorage.getItem("createdCourses")) || [];

    // Map through the courses and replace the edited course by its ID
    const updatedCourses = createdCourses.map((c) =>
      c.id === currentCourse.id ? currentCourse : c
    );

    // Save the updated course list back to localStorage
    localStorage.setItem("createdCourses", JSON.stringify(updatedCourses));

    // Reset editing state and update the course list in the component
    setIsEditing(false);
    setFilteredCourses((prev) =>
      prev.map((c) => (c.id === currentCourse.id ? currentCourse : c))
    );
  };

  const handleDeleteCourse = (courseId) => {
    const createdCourses =
      JSON.parse(localStorage.getItem("createdCourses")) || [];
    const updatedCourses = createdCourses.filter(
      (course) => course.id !== courseId
    );
    localStorage.setItem("createdCourses", JSON.stringify(updatedCourses));

    setFilteredCourses(
      filteredCourses.filter((course) => course.id !== courseId)
    );
  };

  const handleCreateCourse = () => {
    navigate("/create-course");
  };

  const handleRegisterCourses = () => {
    navigate("/courses");
  };

  const handleViewProfile = () => {
    navigate("/profile");
  };

  const handleViewStudents = () => {
    navigate("/students");
  };

  const handleSendMessage = () => {
    navigate("/message");
  };

  const handleViewMessages = () => {
    navigate("/messages");
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUserRole");
    navigate("/");
  };

  const handleRemoveCourse = (courseId) => {
    const updatedCourses = selectedCourses.filter(
      (course) => course.id !== courseId
    );
    setSelectedCourses(updatedCourses);
    localStorage.setItem("selectedCourses", JSON.stringify(updatedCourses));
  };

  return (
    <div className="dashboard-layout">
      <Sidebar
        onViewDashboard={() => navigate("/dashboard")}
        onCreateCourse={
          user && user.status === "admin" ? handleCreateCourse : null
        }
        onRegister={
          user && user.status === "student" ? handleRegisterCourses : null
        }
        onViewProfile={handleViewProfile}
        onViewStudents={handleViewStudents}
        onSendMessage={
          user && user.status === "student" ? handleSendMessage : null
        }
        onViewMessages={
          user && user.status === "admin" ? handleViewMessages : null
        }
        onLogout={handleLogout}
        showCreateCourse={user && user.status === "admin"}
        showRegister={user && user.status === "student"}
        showProfile={true}
        showViewStudents={user && user.status === "admin"}
        showViewMessages={user && user.status === "admin"}
        showMessage={user && user.status === "student"}
        showLogout={true}
      />

      <div className="dashboard-content">
        <h1>Bow Course Registration System</h1>
        <h2>Dashboard</h2>
        {user ? (
          <div>
            {user.status === "admin" ? (
              <div>
                <p>
                  Hi there, {user.firstName} ({user.status})
                </p>
                <p>&nbsp;</p>
                <div>
                  <label>View & Manage Courses</label>
                  <select
                    value={program}
                    onChange={handleProgramChange}
                    required
                  >
                    <option value="" disabled>
                      Select Program
                    </option>
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
                </div>
                <div>
                  <select value={term} onChange={handleTermChange} required>
                    <option value="" disabled>
                      Select Term
                    </option>
                    <option value="Spring">Spring</option>
                    <option value="Summer">Summer</option>
                    <option value="Fall">Fall</option>
                    <option value="Winter">Winter</option>
                  </select>
                </div>

                {isEditing && currentCourse ? (
                  <form onSubmit={handleEditSubmit}>
                    <label>Edit Course</label>
                    <input
                      type="text"
                      name="name"
                      value={currentCourse.name}
                      onChange={(e) =>
                        setCurrentCourse({
                          ...currentCourse,
                          name: e.target.value,
                        })
                      }
                      required
                    />
                    <input
                      type="text"
                      name="code"
                      value={currentCourse.code}
                      onChange={(e) =>
                        setCurrentCourse({
                          ...currentCourse,
                          code: e.target.value,
                        })
                      }
                      required
                    />
                    <select
                      name="program"
                      value={currentCourse.program}
                      onChange={(e) =>
                        setCurrentCourse({
                          ...currentCourse,
                          program: e.target.value,
                        })
                      }
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
                    <select
                      name="term"
                      value={currentCourse.term}
                      onChange={(e) =>
                        setCurrentCourse({
                          ...currentCourse,
                          term: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Select Term</option>
                      <option value="Spring">Spring</option>
                      <option value="Summer">Summer</option>
                      <option value="Fall">Fall</option>
                      <option value="Winter">Winter</option>
                    </select>
                    <input
                      type="date"
                      name="startDate"
                      value={currentCourse.startDate}
                      onChange={(e) =>
                        setCurrentCourse({
                          ...currentCourse,
                          startDate: e.target.value,
                        })
                      }
                      required
                    />
                    <input
                      type="date"
                      name="endDate"
                      value={currentCourse.endDate}
                      onChange={(e) =>
                        setCurrentCourse({
                          ...currentCourse,
                          endDate: e.target.value,
                        })
                      }
                      required
                    />
                    <button type="submit">Save Changes</button>
                  </form>
                ) : (
                  term &&
                  (filteredCourses.length > 0 ? (
                    <ul className="courses-list">
                      {filteredCourses.map((course) => (
                        <li key={course.id}>
                          {course.name} ({course.code}) - {course.term}
                          <div className="button-group">
                            <button onClick={() => handleEditCourse(course)}>
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteCourse(course.id)}
                            >
                              Remove
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>
                      No courses available for the selected program and term.
                    </p>
                  ))
                )}
              </div>
            ) : (
              <div>
                <p>
                  Hi there, {user.firstName} ({user.status})
                </p>
                <p>Student ID: {user.userID}</p>
                <p>Program: {user.program}</p>
                <p>Department: Software Development</p>

                <div className="selected-courses-section">
                  <label>Selected Courses</label>
                  {selectedCourses.length > 0 ? (
                    <ul className="selected-courses-list">
                      {selectedCourses.map((course) => (
                        <li key={course.id}>
                          {course.name} ({course.code}) - {course.term}
                          <button onClick={() => handleRemoveCourse(course.id)}>
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No courses selected.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p>No user data available</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
