import { useState, useEffect } from "react";
import axios from "axios";
import "../Style/EmployeesData.css";
import { Link } from "react-router-dom";
const EmpList = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/employees/usersData"
      );
      setEmployees(response.data);
      console.log(response.data);
    } catch (err) {
      console.error("Failed to fetch employees:", err);
    }
  };
  useEffect(() => {
    fetchEmployees();
  }, []);

  function blockAccount(empId) {
    return async () => {
      try {
        const response = await axios.put(
          "http://localhost:5000/employees/blockAccount",
          {
            id_user: empId,
          }
        );
        console.log(response.data);
        window.location.reload();
      } catch (err) {
        console.error("Failed to block account:", err);
      }
    };
  }
  function unBlockAccount(empId) {
    return async () => {
      try {
        const response = await axios.put(
          "http://localhost:5000/employees/unblockAccount",
          {
            id_user: empId,
          }
        );
        console.log(response.data);
        window.location.reload();
      } catch (err) {
        console.error("Failed to unblock account:", err);
      }
    };
  }

  return (
    <div className="table-emp-list">
      <table>
        <tr>
          <th>Imię i nazwisko </th>
          <th>Email </th>
          <th>Numer telefonu </th>
          <th>Rola </th>
          <th>Zmiana </th>
          <th>Stanowisko </th>
          <th>Zobacz szczegóły</th>
          <th>Blokuj konto</th>
        </tr>
        {employees.map((emp) => (
          <tr key={emp.id_user}>
            <td>
              {emp.first_name} {emp.last_name}
            </td>
            <td>{emp.email}</td>
            <td>{emp.phone}</td>
            <td>{emp.role_id === 1 ? "Pracownik" : "Kierownik"}</td>
            <td>
              {emp.shift_id === 1
                ? " Rano"
                : emp.shift_id === 2
                ? " Popołudnie"
                : " Nocki"}
            </td>
            <td>
              {emp.dept_id === 1
                ? "produkcja"
                : emp.dept_id === 2
                ? "gotowanie"
                : "magazyn"}
            </td>
            <td>
              <Link to="/EmpDetails" state={{ userId: emp.id_user }}>
                <button className="btn btn-outline-dark">Zobacz</button>
              </Link>
            </td>
            <td>
              {emp.blocked === 0 ? (
                <button
                  onClick={blockAccount(emp.id_user)}
                  className="btn btn-outline-danger"
                >
                  Blokuj
                </button>
              ) : (
                <button
                  onClick={unBlockAccount(emp.id_user)}
                  className="btn btn-outline-success"
                >
                  Odblokuj
                </button>
              )}
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
};

export default EmpList;
