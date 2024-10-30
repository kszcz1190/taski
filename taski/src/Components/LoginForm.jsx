import "../Style/LoginForm.css";
import { Link, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import Validation from "./LoginValidation";
import { useState } from "react";
import axios from "axios";

const LoginForm = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const [errors, setErrors] = useState({});

  const handleInput = (event) => {
    setValues((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = Validation(values);
    setErrors(validationErrors);

    if (!validationErrors.email && !validationErrors.password) {
      axios
        .post("http://localhost:5000/login", values)
        .then((res) => {
          console.log("Response received:", res.data);
          if (res.data.Status === "Success") {
            const userRole = res.data.role;
            localStorage.setItem("userRole", userRole);
            if (userRole === "superuser") {
              navigate("/HomeSupervisor");
            } else {
              navigate("/HomeEmployee");
            }
          } else {
            alert("No record exists");
          }
        })
        .catch((err) => {
          console.error("Axios error:", err);
          alert("Login failed");
        });
    }
  };

  return (
    <div className="wrapper_Login">
      <form action="" onSubmit={handleSubmit}>
        <h1>Login</h1>
        <div className="mb-2">
          <FaUser className="icon" />
          <label htmlFor="email" className="email_input">
            Email
          </label>
          <input
            type="email"
            placeholder="Email"
            onChange={handleInput}
            name="email"
          />
          <span>
            {errors.email && (
              <span className="text-danger"> {errors.email}</span>
            )}
          </span>
        </div>
        <div className="mb-2">
          <FaLock className="icon" />
          <label htmlFor="password" className="password_input">
            Password
          </label>
          <input
            type="password"
            placeholder="Password"
            onChange={handleInput}
            name="password"
          />
          <span>
            {errors.password && (
              <span className="text-danger"> {errors.password}</span>
            )}
          </span>
        </div>
        <div className="remember-forgot">
          <a href="#"> Forgot password</a>
        </div>
        <button type="submit" className="login_button">
          Log in
        </button>
        <label htmlFor="create_account">
          Don&apos;t have an account{" "}
          <Link
            to={"/RegisterForm"}
            type="create_account"
            className="Link_login"
          >
            CREATE ACCOUNT
          </Link>
        </label>
      </form>
    </div>
  );
};

export default LoginForm;
