import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import { Container } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";

interface IEmployee {
  employeeId?: number;
  employeeName: string;
  employeeSalary: number;
  employeeCity: string;
}

export default function Employee() {
  const [name, setName] = useState("");
  const [salary, setSalary] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<IEmployee[]>([]);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<IEmployee | null>(
    null
  );

  useEffect(() => {
    // Fetch all employees when the component mounts
    if (buttonClicked) fetchEmployees();
    return setButtonClicked(false);
  }, [buttonClicked]);

  const handleGetAllEmployees = () => {
    setButtonClicked(true);
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/employees"
      );
      console.log("Response data:", response.data);
      setEmployees(response.data);
    } catch (error) {
      //@ts-ignore
      console.error("Error fetching employees:", error.message);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Input validation
    if (!name || !salary || !city || isNaN(Number(salary))) {
      alert("Please enter valid information.");
      return;
    }

    const employee: IEmployee = {
      employeeName: name,
      employeeSalary: Number(salary),
      employeeCity: city,
    };
    setLoading(true);

    if (editingEmployee) {
      // Edit existing employee
      axios
        .put(
          `http://localhost:8080/api/v1/employees/${editingEmployee.employeeId}`,
          employee,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then(() => {
          alert(`Edited Employee ${editingEmployee.employeeName} successfully`);
        })
        .catch((error) => {
          console.log(error);
          alert("Error editing employee. Please try again.");
        })
        .finally(() => {
          setLoading(false);
          setEditingEmployee(null);
          // Fetch updated employee list
          fetchEmployees();
        });
    } else {
      // Add new employee
      axios
        .post("http://localhost:8080/api/v1/employees", employee, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then(() => {
          alert(`Added Employee ${employee.employeeName} successfully`);
        })
        .catch((error) => {
          console.log(error);
          alert("Error adding employee. Please try again.");
        })
        .finally(() => {
          setLoading(false);
          // Fetch updated employee list
          fetchEmployees();
        });
    }

    // Reset the form
    setName("");
    setSalary("");
    setCity("");
  };

  const handleEditEmployee = (employee: IEmployee) => {
    setEditingEmployee(employee);
    setName(employee.employeeName);
    setSalary(
      employee.employeeSalary ? employee.employeeSalary.toString() : ""
    );
    setCity(employee.employeeCity);
  };

  const handleDeleteEmployee = (employeeId: number) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      axios
        .delete(`http://localhost:8080/api/v1/employees/${employeeId}`)
        .then(() => {
          alert("Employee deleted successfully");
          // Fetch updated employee list
          fetchEmployees();
        })
        .catch((error) => {
          console.log(error);
          alert("Error deleting employee. Please try again.");
        });
    }
  };

  const paperStyle = {
    padding: "50px 20px 50px",
    width: 600,
    margin: "20px auto",
  };

  return (
    <Container>
      <Paper elevation={3} style={paperStyle}>
        <h1
          style={{
            color: "#1976d2",
            fontFamily: "Roboto, Helvetica, Arial, sans-serif",
          }}
        >
          Add/Edit Employee
        </h1>
        <Box
          component="form"
          sx={{
            "& > :not(style)": { margin: 1 },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            id="outlined-basic"
            label="Employee Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <TextField
            id="outlined-basic"
            label="Employee Salary"
            variant="outlined"
            type="number"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            fullWidth
          />
          <TextField
            id="outlined-basic"
            label="Employee City"
            variant="outlined"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            fullWidth
          />
          <Button
            color="primary"
            size="medium"
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Submitting..." : editingEmployee ? "Edit" : "Add"}
          </Button>

          <h1
            style={{
              color: "#1976d2",
              fontFamily: "Roboto, Helvetica, Arial, sans-serif",
            }}
          >
            Employee List
          </h1>

          <Button
            color="primary"
            variant="outlined"
            onClick={handleGetAllEmployees}
          >
            Get All Employees
          </Button>

          {/* Display the list of employees */}
          {employees.map((employee, index) => (
            <div key={index}>
              <p>Name: {employee.employeeName}</p>
              <p>Salary: {employee.employeeSalary}</p>
              <p>City: {employee.employeeCity}</p>
              <Button
                color="primary"
                variant="contained"
                onClick={() => handleEditEmployee(employee)}
              >
                Edit
              </Button>
              {"   "}
              <Button
                color="secondary"
                variant="contained"
                //@ts-ignore
                onClick={() => handleDeleteEmployee(employee.employeeId)}
              >
                Delete
              </Button>
              <hr />
            </div>
          ))}
        </Box>
      </Paper>
    </Container>
  );
}
