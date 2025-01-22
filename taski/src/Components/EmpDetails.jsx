import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Validation from "./ValEmpData";
import "../Style/EmployeesData.css";
const EmpDetails = () => {
  const location = useLocation();
  const [errors, setErrors] = useState({});
  const id = location.state.userId;
  const [values, setValues] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    role_id: "",
    shift_id: "",
    dept_id: "",
    country: "",
    post_code: "",
    city: "",
    street: "",
    house_number: "",
    block_number: "",
    bank_account: "",
    date_of_birth: "",
  });

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/Allemployees/userData`,
          {
            params: { user: id },
          }
        );
        setValues(response.data[0]);
      } catch (err) {
        console.error("Failed to fetch employee:", err);
      }
    };
    fetchEmployee();
  }, [id]);

  const handleInput = (e) => {
    const { name, value } = e.target;

    // Specjalna obsługa dla daty
    if (name === "date_of_birth") {
      setValues((prev) => ({
        ...prev,
        [name]: value, // `value` już jest w formacie yyyy-MM-dd
      }));
    } else {
      setValues((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = async () => {
    const validationErrors = Validation(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axios.put(
          `http://localhost:5000/userData/employee`,
          {
            userId: id,
            ...values,
          }
        );

        if (response.data.message === "Success") {
          window.location.reload();
        }
      } catch (err) {
        console.error("Failed to save changes:", err);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return ""; // Obsługa pustych wartości
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Dodaj zero wiodące
    const day = String(date.getDate()).padStart(2, "0"); // Dodaj zero wiodące
    return `${year}-${month}-${day}`; // Zwróć w formacie yyyy-MM-dd
  };

  return (
    <div className="emp-details-wrapper">
      <table key={values.id_user}>
        <tr>
          <td>Imię</td>
          <td>
            <input
              type="text"
              name="first_name"
              value={values.first_name}
              onChange={handleInput}
            />
          </td>
        </tr>
        {errors.first_name && (
          <span className="text-danger">{errors.first_name}</span>
        )}
        <tr>
          <td>Nazwisko</td>
          <td>
            <input
              type="text"
              name="last_name"
              value={values.last_name}
              onChange={handleInput}
            />
          </td>
        </tr>
        {errors.last_name && (
          <span className="text-danger">{errors.last_name}</span>
        )}
        <tr>
          <td>Email</td>
          <td>
            <input
              type="text"
              name="email"
              value={values.email}
              onChange={handleInput}
            />
          </td>
        </tr>
        {errors.email && <span className="text-danger">{errors.email}</span>}
        <tr>
          <td>Numer telefonu</td>
          <td>
            <input
              type="text"
              name="phone"
              value={values.phone}
              onChange={handleInput}
            />
          </td>
        </tr>
        {errors.phone && <span className="text-danger">{errors.phone}</span>}
        <tr>
          <td>Rola</td>
          <td>
            <input
              type="number"
              name="role_id"
              value={values.role_id}
              onChange={handleInput}
            />
          </td>
        </tr>
        {errors.role_id && (
          <span className="text-danger">{errors.role_id}</span>
        )}
        <tr>
          <td>Zmiana</td>
          <td>
            <input
              type="number"
              name="shift_id"
              value={values.shift_id}
              onChange={handleInput}
            />
          </td>
        </tr>
        {errors.shift_id && (
          <span className="text-danger">{errors.shift_id}</span>
        )}

        <tr>
          <td>Stanowisko</td>
          <td>
            <input
              type="number"
              name="dept_id"
              value={values.dept_id}
              onChange={handleInput}
            />
          </td>
        </tr>
        {errors.dept_id && (
          <span className="text-danger">{errors.dept_id}</span>
        )}
      </table>
      <table>
        <tr>
          <td>Kraj</td>
          <td>
            <input
              type="text"
              name="country"
              value={values.country}
              onChange={handleInput}
            />
          </td>
        </tr>
        {errors.country && (
          <span className="text-danger">{errors.country}</span>
        )}

        <tr>
          <td>Kod pocztowy</td>
          <td>
            <input
              type="text"
              name="post_code"
              value={values.post_code}
              onChange={handleInput}
            />
          </td>
        </tr>
        {errors.post_code && (
          <span className="text-danger">{errors.post_code}</span>
        )}
        <tr>
          <td>Miasto</td>
          <td>
            <input
              type="text"
              name="city"
              value={values.city}
              onChange={handleInput}
            />
          </td>
        </tr>
        {errors.city && <span className="text-danger">{errors.city}</span>}

        <tr>
          <td>Ulica</td>
          <td>
            <input
              type="text"
              name="street"
              value={values.street}
              onChange={handleInput}
            />
          </td>
        </tr>
        {errors.street && <span className="text-danger">{errors.street}</span>}
        <tr>
          <td>Nr domu</td>
          <td>
            <input
              type="number"
              name="house_number"
              value={values.house_number}
              onChange={handleInput}
            />
          </td>
        </tr>
        {errors.house_number && (
          <span className="text-danger">{errors.house_number}</span>
        )}
        <tr>
          <td>Nr bloku</td>
          <td>
            <input
              type="number"
              name="block_number"
              value={values.block_number}
              onChange={handleInput}
            />
          </td>
        </tr>
        {errors.block_number && (
          <span className="text-danger">{errors.block_number}</span>
        )}
        <tr>
          <td>Numer konta bankowego</td>
          <td>
            <input
              type="text"
              name="bank_account"
              value={values.bank_account}
              onChange={handleInput}
            />
          </td>
        </tr>
        {errors.bank_account && (
          <span className="text-danger">{errors.bank_account}</span>
        )}
        <tr>
          <td>Data urodzenia</td>
          <td>
            <input
              type="date"
              name="date_of_birth"
              value={formatDate(values.date_of_birth)}
              onChange={handleInput}
            />
          </td>
        </tr>
        {errors.date_of_birth && (
          <span className="text-danger">{errors.date_of_birth}</span>
        )}
      </table>
      <button
        onClick={handleSave}
        type="button"
        className="btn btn-outline-danger"
      >
        Zapisz zmiany
      </button>
    </div>
  );
};
export default EmpDetails;
