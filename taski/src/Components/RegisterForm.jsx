import "../Style/RegisterForm.css";
import { useNavigate } from "react-router-dom";
import Validation from "./RegisterValidation";
import { useEffect, useState } from "react";
import axios from "axios";

const RegisterForm = () => {
  const [values, setValues] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    bank_account: "",
    date_of_birth: "",
    password: "",
    shift_id: "",
    role_id: "",
    dept_id: "",
  });
  const navigate = useNavigate();

  const [shifts, setShifts] = useState([]);
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:5000/shifts").then((response) => {
      setShifts(response.data);
    });
    axios.get("http://localhost:5000/roles").then((response) => {
      setRoles(response.data);
    });
    axios.get("http://localhost:5000/departments").then((response) => {
      setDepartments(response.data);
    });
  }, []);

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

    if (Object.keys(validationErrors).length === 0) {
      axios
        .post("http://localhost:5000/register", values)
        .then(() => {
          navigate("/LoginForm");
        })
        .catch((err) => {
          console.error(err);
          alert("Rejestracja nie powiodła się. Spróbuj ponownie.");
        });
    }
  };

  return (
    <div className="wrapper_Register">
      <form action="" onSubmit={handleSubmit} className="wrapper">
        <div className="column">
          <div className="wrap ">
            <label htmlFor="first_name" className="name_input">
              Name
            </label>
            <input
              type="text"
              placeholder="First name"
              name="first_name"
              onChange={handleInput}
              value={values.first_name}
            />
          </div>
          <span>
            {errors.first_name && (
              <span className="text-danger"> {errors.first_name}</span>
            )}
          </span>
          <div className="wrap ">
            <label htmlFor="last_name" className="name_input">
              Surname
            </label>
            <input
              type="text"
              placeholder="Surname"
              name="last_name"
              onChange={handleInput}
              value={values.last_name}
            />
          </div>
          <span>
            {errors.last_name && (
              <span className="text-danger"> {errors.last_name}</span>
            )}
          </span>
          <div className="wrap ">
            <label htmlFor="email" className="email_input">
              Email
            </label>
            <input
              type="email"
              placeholder="Email"
              onChange={handleInput}
              name="email"
              value={values.email}
            />
          </div>
          <span>
            {errors.email && (
              <span className="text-danger"> {errors.email}</span>
            )}
          </span>
          <div className="wrap ">
            <label htmlFor="phone" className="name_input">
              Phone
            </label>
            <input
              type="text"
              placeholder="Phone Number"
              onChange={handleInput}
              name="phone"
              value={values.phone}
            />
          </div>
          <span>
            {errors.phone && (
              <span className="text-danger"> {errors.phone}</span>
            )}
          </span>
          <div className="wrap ">
            <label htmlFor="bank_account" className="name_input">
              Bank Account
            </label>
            <input
              type="text"
              placeholder="Bank Account Number"
              onChange={handleInput}
              name="bank_account"
              value={values.bank_account}
            />
          </div>
          <span>
            {errors.bank_account && (
              <span className="text-danger"> {errors.bank_account}</span>
            )}
          </span>
          <div className="wrap ">
            <label htmlFor="date_of_birth" className="name_input">
              Date of birth
            </label>
            <input
              type="date"
              onChange={handleInput}
              name="date_of_birth"
              value={values.date_of_birth}
            />
          </div>
          <span>
            {errors.date_of_birth && (
              <span className="text-danger"> {errors.date_of_birth}</span>
            )}
          </span>
          <div className="wrap ">
            <label htmlFor="password" className="password_input">
              Password
            </label>
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleInput}
              value={values.password}
            />
          </div>
          <span>
            {errors.password && (
              <span className="text-danger"> {errors.password}</span>
            )}
          </span>
        </div>
        {/* {Shift} */}
        <div className="column">
          <div className="wrap">
            <label htmlFor="id_shift" className="name_input">
              Shift
            </label>
            <select
              name="shift_id"
              onChange={handleInput}
              value={values.shift_id}
            >
              <option value=""> Select Shift</option>
              {shifts.map((shifts) => (
                <option key={shifts.id_shift} value={shifts.id_shift}>
                  {shifts.shift_name}
                </option>
              ))}
            </select>
          </div>
          <div className="wrap ">
            <label htmlFor="id_role" className="name_input">
              Role
            </label>
            <select
              type="number"
              placeholder="Role"
              onChange={handleInput}
              name="role_id"
              value={values.role_id}
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role.id_role} value={role.id_role}>
                  {role.role_name}
                </option>
              ))}
            </select>
          </div>
          <div className="wrap ">
            <label htmlFor="id_dept" className="name_input">
              Department
            </label>
            <select
              type="number"
              placeholder="Departments"
              onChange={handleInput}
              name="dept_id"
              value={values.dept_id}
            >
              <option value="">Select Department</option>
              {departments.map((department) => (
                <option key={department.id_dept} value={department.id_dept}>
                  {department.dept_name}
                </option>
              ))}
            </select>
          </div>
          <button
            className="btn btn-outline-dark btn-lg btn-block"
            type="submit"
          >
            Create Account
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
