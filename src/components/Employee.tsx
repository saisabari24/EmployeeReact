import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import { Container } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";

interface IEmployee {
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

    console.log(employee);

    axios
      .post("http://localhost:8080/api/v1/employees", employee, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        // Reset the form or perform other actions here
        setName("");
        setSalary("");
        setCity("");
        // Fetch updated employee list
        //fetchEmployees();
        alert(`Added Employee ${employee.employeeName} successfully`);
      })
      .catch((error) => {
        console.log(error);
        // Handle the error, show a message to the user, etc.
        alert("Error adding employee. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
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
          Add Employee
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
            {loading ? "Submitting..." : "Submit"}
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
              <hr />
            </div>
          ))}
        </Box>
      </Paper>
    </Container>
  );
}
