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

import DeliveryDetails from "./DeliveryDetails";
import CreateDelivery from "./CreateDelivery";
import ErrorMessage from "../commons/ErrorMessage";
import LoadingMessage from "../commons/LoadingMessage";
import SuccessMessage from "../commons/SuccessMessage";

const columns = [
  { id: "courseTitle", label: "Course Title", align: "center", minWidth: 100 },
  { id: "session", label: "Year-Sem", minWidth: 100 },
  {
    id: "courseCode",
    label: "Code",
    minWidth: 100,
    align: "right",
  },
  {
    id: "action",
    label: "Action",
    minWidth: 120,
    align: "center",
  },
];

function Delivery() {
  const [delivery, setDelivery] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [year, setYear] = useState("2022"); // Default year
  const [semester, setSemester] = useState("1"); // Default semester
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchDelivery();
  }, [year, semester]);

  const fetchDelivery = () => {
    fetch(`http://localhost:8080/api/v1/instances/${year}/${semester}`)
      .then((response) => response.json())
      .then((data) => setDelivery(data.data))
      .catch((error) => console.error("Error fetching courses:", error));
  };

  const handleDeliveryClick = (delivery) => {
    setSelectedDelivery(delivery);
  };

  const closeDeliveryDetails = () => {
    setSelectedDelivery(null);
  };

  const handleRemove = (id) => {
    setIsLoading(true);
    fetch(`http://localhost:8080/api/v1/instances/${year}/${semester}/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        setTimeout(() => {
          if (response.ok) {
            setSuccess("Session Removed");
            fetchDelivery();
            setTimeout(() => setSuccess(""), 1500);
          } else {
            setError("Failed");
            console.error("Failed to remove course session");
            setTimeout(() => setError(""), 1500);
          }
          setIsLoading(false);
        }, 1500);
      })
      .catch((error) => {
        console.error("Error removing course:", error);
        setIsLoading(false);
      });
  };

  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  const handleSemesterChange = (e) => {
    setSemester(e.target.value);
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
      <div style={{ marginBottom: 20 }}>
        <label style={{ marginRight: "5px" }}>Year:</label>
        <input
          type="number"
          value={year}
          onChange={handleYearChange}
          placeholder="Year"
          style={{ marginRight: "10px", width: "150px" }}
        />
        <label style={{ marginRight: "5px" }}>Semester:</label>
        <select
          style={{ height: "28px", width: "50px" }}
          value={semester}
          onChange={handleSemesterChange}
        >
          {[...Array(8).keys()].map((i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </div>
      <div style={styles.container}>
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
                {delivery.length > 0 ? (
                  delivery
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((delivery) => (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={delivery.id}
                      >
                        <TableCell align="center">
                          <span
                            onClick={() => handleDeliveryClick(delivery)}
                            style={{
                              cursor: "pointer",
                              color: "blue",
                              textDecoration: "underline",
                            }}
                          >
                            {delivery.course.courseTitle}
                          </span>
                        </TableCell>
                        <TableCell>
                          {delivery.year}-{delivery.semester}
                        </TableCell>
                        <TableCell align="right">
                          {delivery.course.courseCode}
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            onClick={() => handleRemove(delivery.id)}
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
                      No Sessions Found. Filter Sessions By Year and Semester
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={delivery.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </div>
      {selectedDelivery && (
        <DeliveryDetails
          delivery={selectedDelivery}
          onClose={closeDeliveryDetails}
        />
      )}
    </div>
  );  
}

const styles = {
  container: {
    position: "relative",
  },
};

export default Delivery;
