import "../Style/LoginForm.css";
import { useNavigate, Link } from "react-router-dom";
import Validation from "./LoginValidation";
import { useState } from "react";
import axios from "axios";

const LoginForm = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const handleInput = (event) => {
    setValues((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!values.email.trim() || !values.password.trim()) {
      setErrors({
        email: "Email is required",
        password: "Password is required",
      });
      return;
    }

    const validationErrors = Validation(values);
    setErrors(validationErrors);

    if (!validationErrors.email && !validationErrors.password) {
      setLoading(true); // Start loading
      axios
        .post("http://localhost:5000/login", values)
        .then((res) => {
          console.log("Response data:", res.data);

          setLoading(false); // Stop loading
          if (res.data.success) {
            console.log("res.data", res.data);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("userId", res.data.userId);
            if (parseInt(res.data.role) === 1) {
              navigate("/WorkScheduleEmployee");
              window.location.reload();
            } else if (parseInt(res.data.role) === 2) {
              navigate("/ScheduleList");
              window.location.reload();
            }
          } else {
            setErrors((prev) => ({
              ...prev,
              server: res.data.error || "Unknown error",
            }));
          }
        })
        .catch((err) => {
          setLoading(false); // Stop loading on error
          setErrors((prev) => ({
            ...prev,
            server:
              "Login failed: " + (err.response?.data?.error || "Unknown error"),
          }));
        });
    }
  };

  return (
    <div className="wrapper_Login">
      <form action="" onSubmit={handleSubmit}>
        <div className="mb-2">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            placeholder="Email"
            onChange={handleInput}
            name="email"
          />
          {errors.email && <span className="text-danger">{errors.email}</span>}
        </div>
        <div className="mb-2">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            placeholder="Password"
            onChange={handleInput}
            name="password"
          />
          {errors.password && (
            <span className="text-danger">{errors.password}</span>
          )}
        </div>
        {errors.server && <span className="text-danger">{errors.server}</span>}
        <button
          type="submit"
          className="btn btn-dark btn-lg "
          disabled={loading}
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>
      <Link to="/VerifyEmail">Resetuj hasło</Link>
    </div>
  );
};

export default LoginForm;
