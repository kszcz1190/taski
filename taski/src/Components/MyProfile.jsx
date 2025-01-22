import { useEffect, useState } from "react";
import { useUser } from "../UserContext";
import axios from "axios";
import { Link } from "react-router-dom";
import "../Style/MyProfile.css";
import Validation from "./ValidationData";

const MyProfile = () => {
  const [workHistory, setWorkHistory] = useState([]);
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    bank_account: "",
    country: "",
    post_code: "",
    city: "",
    street: "",
    house_number: "",
    block_number: "",
  });
  const { user, loading } = useUser();
  const userId = user?.id;

  useEffect(() => {
    if (!loading && userId) {
      const fetchAllData = async () => {
        try {
          const [workHistoryRes, userDataRes] = await Promise.all([
            axios.get("http://localhost:5000/workhistory/user", {
              params: { user: userId },
            }),
            axios.get("http://localhost:5000/userData", {
              params: { user: userId },
            }),
          ]);
          setWorkHistory(workHistoryRes.data);
          setValues(userDataRes.data[0]); // Wstępne ustawienie wartości
        } catch (err) {
          console.error("Failed to fetch data:", err);
        }
      };

      fetchAllData();
    }
  }, [loading, userId]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    const validationErrors = Validation(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axios.put(
          `http://localhost:5000/user/employee`,
          {
            userId,
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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("pl-PL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="profile-wrapper">
      <table className="profile-table" key={values.id_user}>
        <tbody>
          <tr>
            <td>Imię</td>
            <td>
              <input
                type="text"
                name="first_name"
                value={values.first_name}
                onChange={handleInput}
              />
              {errors.first_name && (
                <span className="text-danger">{errors.first_name}</span>
              )}
            </td>
          </tr>
          <tr>
            <td>Nazwisko</td>
            <td>
              <input
                type="text"
                name="last_name"
                value={values.last_name}
                onChange={handleInput}
              />
              {errors.last_name && (
                <span className="text-danger">{errors.last_name}</span>
              )}
            </td>
          </tr>
          <tr>
            <td>Email</td>
            <td>
              <input
                type="text"
                name="email"
                value={values.email}
                onChange={handleInput}
              />
              {errors.email && (
                <span className="text-danger">{errors.email}</span>
              )}
            </td>
          </tr>
          <tr>
            <td>Nr telefonu</td>
            <td>
              <input
                type="text"
                name="phone"
                value={values.phone}
                onChange={handleInput}
              />
              {errors.phone && (
                <span className="text-danger">{errors.phone}</span>
              )}
            </td>
          </tr>
          <tr>
            <td>Nr konta bankowego</td>
            <td>
              <input
                type="text"
                name="bank_account"
                value={values.bank_account}
                onChange={handleInput}
              />
              {errors.bank_account && (
                <span className="text-danger">{errors.bank_account}</span>
              )}
            </td>
          </tr>
        </tbody>
        <tbody>
          <tr>
            <td>Kraj</td>
            <td>
              <input
                type="text"
                name="country"
                value={values.country}
                onChange={handleInput}
              />
              {errors.country && (
                <span className="text-danger">{errors.country}</span>
              )}
            </td>
          </tr>
          <tr>
            <td>Kod pocztowy</td>
            <td>
              <input
                type="text"
                name="post_code"
                value={values.post_code}
                onChange={handleInput}
              />
              {errors.post_code && (
                <span className="text-danger">{errors.post_code}</span>
              )}
            </td>
          </tr>
          <tr>
            <td>Miasto</td>
            <td>
              <input
                type="text"
                name="city"
                value={values.city}
                onChange={handleInput}
              />
              {errors.city && (
                <span className="text-danger">{errors.city}</span>
              )}
            </td>
          </tr>
          <tr>
            <td>Ulica</td>
            <td>
              <input
                type="text"
                name="street"
                value={values.street}
                onChange={handleInput}
              />
              {errors.street && (
                <span className="text-danger">{errors.street}</span>
              )}
            </td>
          </tr>
          <tr>
            <td>Nr domu</td>
            <td>
              <input
                type="number"
                name="house_number"
                value={values.house_number}
                onChange={handleInput}
              />
              {errors.house_number && (
                <span className="text-danger">{errors.house_number}</span>
              )}
            </td>
          </tr>
          <tr>
            <td>Nr bloku</td>
            <td>
              <input
                type="number"
                name="block_number"
                value={values.block_number}
                onChange={handleInput}
              />
              {errors.block_number && (
                <span className="text-danger">{errors.block_number}</span>
              )}
            </td>
          </tr>
        </tbody>
      </table>

      <button
        onClick={handleSave}
        type="button"
        className="btn btn-outline-dark"
      >
        Zapisz zmiany
      </button>

      <Link to="/Settings">
        <button type="button" className="btn btn-outline-danger">
          Zmień hasło
        </button>
      </Link>

      <h2>Historia pracy</h2>
      {workHistory.length === 0 ? (
        <div>Brak historii pracy</div>
      ) : (
        <table className="work-history-table" key={workHistory.id}>
          {workHistory.map((item, index) => (
            <tbody key={index}>
              <tr>
                <td>Data rozpoczęcia zatrudnienia</td>
                <td>{formatDate(item.date_start_employment)}</td>
              </tr>
              <tr>
                <td>Data zakończenia zatrudnienia</td>
                <td>{formatDate(item.date_end_employment)}</td>
              </tr>
            </tbody>
          ))}
        </table>
      )}
    </div>
  );
};

export default MyProfile;
