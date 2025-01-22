import { useState } from "react";
import axios from "axios";
import { useUser } from "../UserContext";
import "../Style/MyProfile.css";

const Settings = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const userId = user?.id;

  function Validation(values) {
    const errors = {};
    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    if (!values.newPassword) {
      errors.newPassword = "Hasło nie może być puste.";
    } else if (!passwordPattern.test(values.newPassword)) {
      errors.newPassword =
        "Hasło musi zawierać co najmniej 8 znaków, jedną cyfrę, jedną małą i jedną dużą literę.";
    }

    if (values.newPassword !== values.confirmPassword) {
      errors.confirmPassword = "Hasła nie są takie same.";
    }

    return errors;
  }

  const handlePasswordChange = async () => {
    const validationErrors = Validation({ newPassword, confirmPassword });
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      try {
        const response = await axios.put(
          "http://localhost:5000/changePassword",
          {
            userId,
            oldPassword,
            newPassword,
          }
        );
        console.log(response.data.message);
        if (response.data.message === "Success") {
          setMessage("Hasło zmienione pomyślnie.");
        } else {
          setMessage("Nie udało sie zmienic hasła.");
        }
      } catch (err) {
        console.error("Failed to save changes:", err);
        setMessage("Błąd serwera. Spróbuj ponownie później.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="settings-wrapper">
      <div>
        <label htmlFor="">Stare hasło</label>
        <input
          type="password"
          placeholder="Stare hasło"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="">Nowe hasło</label>
        <input
          type="password"
          placeholder="Nowe hasło"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="">Potwierdź nowe hasło</label>
        <input
          type="password"
          placeholder="Potwierdź nowe hasło"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      <button
        className="btn btn-outline-dark"
        onClick={handlePasswordChange}
        disabled={loading}
      >
        {loading ? "Trwa zmiana..." : "Zmień hasło"}
      </button>
      {<p>{message}</p>}
      {errors.confirmPassword && (
        <p className="text-danger">{errors.confirmPassword}</p>
      )}
      {errors.newPassword && (
        <p className="text-danger">{errors.newPassword}</p>
      )}
    </div>
  );
};

export default Settings;
