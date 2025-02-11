import { useEffect, useState } from "react";
import style from "./DashBoard.module.css";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";
import { IoSearchOutline } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import { departments, designations } from "../../assets/MenuList/SampleData";

const DashBoard = () => {
  const url = import.meta.env.VITE_API_URL;

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [empData, setEmpData] = useState([]);
  const [empPopupShow, setEmpPopupShow] = useState(false);
  const [empName, setEmpName] = useState("");
  const [empEmail, setEmpEmail] = useState("");
  const [empDepartment, setEmpDepartment] = useState("");
  const [empDesignation, setEmpDesignation] = useState("");
  const [errors, setErrors] = useState({});

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!empName.trim()) tempErrors.empName = "Name is required";
    if (!empEmail.trim()) {
      tempErrors.empEmail = "Email is required";
    } else if (!validateEmail(empEmail)) {
      tempErrors.empEmail = "Invalid email format";
    }
    if (!empDepartment) tempErrors.empDepartment = "Department is required";
    if (!empDesignation) tempErrors.empDesignation = "Designation is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const valueRest = () => {
    setEmpName("");
    setEmpEmail("");
    setEmpDepartment("");
    setEmpDesignation("");
    setErrors({});
  };

  async function getUserList() {
    try {
      const response = await fetch(`${url}/users`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - Failed to fetch users`);
      }

      const data = await response.json();
      console.log(data);
      setEmpData(data);
    } catch (error) {
      console.error("Failed to fetch user list:", error);
      alert("Failed to fetch user list. Please try again later.");
    }
  }

  async function getUserSearch(value) {
    try {
      const response = await fetch(
        `${url}/users?name=${encodeURIComponent(value)}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - Failed to search users`);
      }

      const data = await response.json();
      console.log(data);
      setEmpData(data);
    } catch (error) {
      console.error("User search failed:", error);
      alert(
        "Failed to find users. Please check your input or try again later."
      );
    }
  }

  async function empCreation() {
    try {
      const response = await fetch(`${url}/users`, {
        method: "POST",
        body: JSON.stringify({
          name: empName,
          email: empEmail,
          department: empDepartment,
          designation: empDesignation,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - Failed to create user`);
      }
      const data = await response.json();
      console.log(data);
      alert("Employee created successfully!");
      getUserList();
      setEmpPopupShow(false);
      valueRest();
    } catch (error) {
      console.error("Employee creation failed:", error);
      alert("Failed to create employee. Please try again later.");
    }
  }

  useEffect(() => {
    getUserList();
  }, []);

  return (
    <div className={style.container}>
      <div className={style.header}>
        <div className={style.headerLeft}>
          <p>User Dashboard</p>
        </div>
        <div className={style.headerRight}>
          <div className={style.userSearch}>
            <input
              type="text"
              placeholder="Search by name..."
              onChange={(e) => {
                const searchValue = e.target.value;
                if (searchValue) {
                  getUserSearch(searchValue);
                } else {
                  getUserSearch("");
                  getUserList();
                }
              }}
            />
            <IoSearchOutline />
          </div>
          <button
            onClick={() => {
              setEmpPopupShow(true);
            }}
          >
            Create user
          </button>
        </div>
      </div>
      <div className={style.dashBoardBody}>
        <div className={style.userTable}>
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 500 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Id</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Company</TableCell>
                    <TableCell>Website</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {empData &&
                    empData
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row, index) => (
                        <TableRow key={index} hover>
                          <TableCell>{row.id}</TableCell>
                          <TableCell>{row.name}</TableCell>
                          <TableCell>{row.username}</TableCell>
                          <TableCell>{row.phone}</TableCell>
                          <TableCell>{row.email}</TableCell>
                          <TableCell>{row.company?.name}</TableCell>
                          <TableCell>{row.website}</TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={empData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </div>
      </div>

      {empPopupShow && (
        <>
          <div
            className={style.overlay}
            onClick={() => {
              setEmpPopupShow(false);
            }}
          ></div>
          <div className={style.userCreatePopup}>
            <div className={style.popupHeader}>
              <p>Create Employee</p>
              <MdClose
                onClick={() => {
                  setEmpPopupShow(false);
                }}
              />
            </div>
            <div className={style.popupSection}>
              <div className={style.inputContainer}>
                <div className={style.inputValue}>
                  <div className={style.inputLabel}>
                    <label htmlFor="e-name">Name*</label>
                    {errors.empName && <p>{errors.empName}</p>}
                  </div>
                  <input
                    type="text"
                    name="e-name"
                    id="e-name"
                    placeholder="Enter your name"
                    value={empName}
                    onChange={(e) => {
                      setEmpName(e.target.value);
                    }}
                  />
                </div>
                <div className={style.inputValue}>
                  <div className={style.inputLabel}>
                    <label htmlFor="e-email">Email*</label>
                    {errors.empEmail && <p>{errors.empEmail}</p>}
                  </div>

                  <input
                    type="email"
                    name="e-email"
                    id="e-email"
                    placeholder="Enter your email"
                    value={empEmail}
                    onChange={(e) => {
                      setEmpEmail(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className={style.inputContainer}>
                <div className={style.inputValue}>
                  <div className={style.inputLabel}>
                    <label htmlFor="e-depart">Department*</label>

                    {errors.empDepartment && <p>{errors.empDepartment}</p>}
                  </div>
                  <select
                    name="e-depart"
                    id="e-depart"
                    value={empDepartment}
                    onChange={(e) => {
                      setEmpDepartment(e.target.value);
                    }}
                  >
                    <option value="">Select your department</option>
                    {departments &&
                      departments.map((list, i) => {
                        return (
                          <option key={i} value={list.name}>
                            {list.name}
                          </option>
                        );
                      })}
                  </select>
                </div>
                <div className={style.inputValue}>
                  <div className={style.inputLabel}>
                    <label htmlFor="e-designation">Designation*</label>
                    {errors.empDesignation && <p>{errors.empDesignation}</p>}
                  </div>

                  <select
                    name="e-designation"
                    id="e-designation"
                    value={empDesignation}
                    onChange={(e) => {
                      setEmpDesignation(e.target.value);
                    }}
                  >
                    <option value="">Select your designation</option>
                    {designations &&
                      designations.map((list, i) => {
                        return (
                          <option key={i} value={list.name}>
                            {list.name}
                          </option>
                        );
                      })}
                  </select>
                </div>
              </div>
            </div>
            <div className={style.popupButtonGroup}>
              <button
                onClick={() => {
                  setEmpPopupShow(false);
                  valueRest();
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (validateForm()) {
                    empCreation();
                  }
                }}
              >
                Create
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashBoard;
