import React, { useEffect, useState } from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

import CreateCourse from "./CreateCourse";
import CourseDetails from "./CourseDetails";
import ErrorMessage from "../commons/ErrorMessage";
import LoadingMessage from "../commons/LoadingMessage";
import SuccessMessage from "../commons/SuccessMessage";

const columns = [
  { id: "courseTitle", label: "Course Title", align: "center", minWidth: 100 },
  { id: "courseCode", label: "Code", minWidth: 100 },
  {
    id: "createdAt",
    label: "Date Added",
    minWidth: 100,
    align: "center",
  },
  {
    id: "action",
    label: "Action",
    minWidth: 120,
    align: "center",
  },
];

function Courses() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = () => {
    fetch("http://localhost:8080/api/v1/courses")
      .then((response) => response.json())
      .then((json) => {
        if (Array.isArray(json.data)) {
          setCourses(json.data);
        } else {
          console.error("No courses found");
          setCourses([]);
        }
      })
      .catch((error) => console.error("Error fetching courses:", error));
  };

  const handleRemove = (id) => {
    setIsLoading(true);
    fetch(`http://localhost:8080/api/v1/courses/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        setTimeout(() => {
          if (response.ok) {
            setSuccess("Course Removed");
            fetchCourses();
            setTimeout(() => setSuccess(""), 1500);
          } else {
            setError("Failed");
            console.error("Failed to remove course");
            setTimeout(() => setError(""), 1500);
          }
          setIsLoading(false);
        }, 1500);
      })
      .catch((error) => console.error("Error removing course:", error));
  };

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
  };

  const closeCourseDetails = () => {
    setSelectedCourse(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = +event.target.value;
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  return (
    <div>
      <div style={{ position: "relative" }}>
        {isLoading && <LoadingMessage message="Deleting..." />}
        {success && !isLoading && <SuccessMessage message={success} />}
        {error && !isLoading && <ErrorMessage message={error} />}
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{
                        minWidth: column.minWidth,
                        fontWeight: "bold",
                        backgroundColor: "#d8d8d8",
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {courses.length > 0 ? (
                  courses
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((course) => (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={course.id}
                      >
                        <TableCell align="center">
                          <span
                            onClick={() => handleCourseClick(course)}
                            style={{
                              cursor: "pointer",
                              color: "blue",
                              textDecoration: "underline",
                            }}
                          >
                            {course.courseTitle}
                          </span>
                        </TableCell>
                        <TableCell>{course.courseCode}</TableCell>
                        <TableCell align="center">{course.createdAt}</TableCell>
                        <TableCell align="center">
                          <Button
                            onClick={() => handleRemove(course.id)}
                            variant="outlined"
                            size="small"
                            startIcon={<DeleteIcon />}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      style={{ textAlign: "center", fontStyle: "italic" }}
                    >
                      No courses available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={courses.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </div>
      {selectedCourse && (
        <CourseDetails course={selectedCourse} onClose={closeCourseDetails} />
      )}
    </div>
  );  
}

export default Courses;
