import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import "../Style/Messages.css";

export const SearchBar = ({ setResults }) => {
  const [search, setSearch] = useState("");
  const [employees, setEmployees] = useState([]);
  //funkcja do pobierania wszystkich pracowników
  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/employees/searchbar"
      );
      const result = response.data.filter((employee) => {
        return (
          employee && employee.first_name && employee.first_name.toLowerCase()
        );
      });
      setEmployees(result);
      setResults(result);
    } catch (err) {
      console.error("Failed to fetch employees:", err);
    }

    SearchBar.propTypes = {
      setResults: PropTypes.func.isRequired,
    };
  };
  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (value) => {
    setSearch(value);
    const filteredResults = employees.filter((employee) =>
      `${employee.first_name} ${employee.last_name}`
        .toLowerCase()
        .includes(value.toLowerCase())
    );
    setResults(filteredResults);
  };

  return (
    <div className="input-wrapper">
      <input
        placeholder="Szukaj pracownika"
        value={search}
        onChange={(e) => {
          handleChange(e.target.value);
        }}
      />
      <FaSearch id="search-employee" />
    </div>
  );
};
