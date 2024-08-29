import React, { useState } from "react";

import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

function CreateDelivery() {
  const [courseCode, setCourseCode] = useState("");
  const [courseYear, setCourseYear] = useState("");
  const [courseSemester, setCourseSemester] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    // Simple input validation
    if (!courseCode || !courseYear || !courseSemester) {
      setError("All fields are required.");
      setSuccess("");
      return;
    }

    // Check if the course exists
    fetch(`http://localhost:8080/api/v1/courses/code/${courseCode}`)
      .then((response) => {
        if (response.status === 404) {
          throw new Error("Course not found");
        }
        return response.json();
      })
      .then((courseData) => {
        // If the course exists, proceed to create the course instance
        const newCourseDelivery = {
          course: {
            id: courseData.data.id,
            courseTitle: courseData.data.courseTitle,
            courseCode: courseData.data.courseCode,
            courseDescription: courseData.data.courseDescription,
          },
          year: courseYear,
          semester: courseSemester,
        };

        return fetch("http://localhost:8080/api/v1/instances", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newCourseDelivery),
        });
      })
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message);
        }
        return response.json();
      })
      .then((data) => {
        setError("");
        setSuccess("Course session created");
        setTimeout(() => setSuccess(""), 4000);
        setCourseCode("");
        setCourseYear("");
        setCourseSemester("");
      })
      .catch((error) => {
        setError(error.message);
        setSuccess("");
        setTimeout(() => setError(""), 5000);
      });
  };

  return (
    <>
      <div>
        {error && <div style={{ color: "red" }}>{error}</div>}
        {success && <div style={{ color: "green" }}>{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <div>
              <input
                type="text"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                placeholder="Course Code"
                required
                className="input-field"
              />
            </div>
            <div>
              <input
                type="text"
                value={courseYear}
                onChange={(e) => setCourseYear(e.target.value)}
                placeholder="Year"
                required
                className="input-field"
              />
            </div>
            <div>
              <input
                type="text"
                value={courseSemester}
                onChange={(e) => setCourseSemester(e.target.value)}
                placeholder="Semester"
                required
                className="input-field"
              />
            </div>
            <Button type="submit" variant="outlined" startIcon={<AddIcon />}>
              Create
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

export default CreateDelivery;
