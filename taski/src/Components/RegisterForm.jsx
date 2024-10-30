import "../Style/RegisterForm.css";
import { useNavigate } from "react-router-dom";
import Validation from "./RegisterValidation";
import { useEffect, useState } from "react";
import axios from "axios";

const RegisterForm = () => {
  const [values, setValues] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    bankAccount: "",
    pesel: "",
    password: "",
    shift_id: "",
    roles_id: "",
    departments_id: "",
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
            <label htmlFor="name" className="name_input">
              Name
            </label>
            <input
              type="text"
              placeholder="Name"
              name="name"
              onChange={handleInput}
              value={values.name}
            />
          </div>
          <span>
            {errors.name && <span className="text-danger"> {errors.name}</span>}
          </span>
          <div className="wrap ">
            <label htmlFor="surname" className="name_input">
              Surname
            </label>
            <input
              type="text"
              placeholder="Surname"
              name="surname"
              onChange={handleInput}
              value={values.surname}
            />
          </div>
          <span>
            {errors.surname && (
              <span className="text-danger"> {errors.surname}</span>
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
            <label htmlFor="bankAccount" className="name_input">
              Bank Account
            </label>
            <input
              type="text"
              placeholder="Bank Account Number"
              onChange={handleInput}
              name="bankAccount"
              value={values.bankAccount}
            />
          </div>
          <span>
            {errors.bankAccount && (
              <span className="text-danger"> {errors.bankAccount}</span>
            )}
          </span>
          <div className="wrap ">
            <label htmlFor="pesel" className="name_input">
              Pesel
            </label>
            <input
              type="text"
              placeholder="Pesel"
              onChange={handleInput}
              name="pesel"
              value={values.pesel}
            />
          </div>
          <span>
            {errors.pesel && (
              <span className="text-danger"> {errors.pesel}</span>
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
            <label htmlFor="shift_id" className="name_input">
              Shift
            </label>
            <select
              name="shift_id"
              onChange={handleInput}
              value={values.shift_id}
            >
              <option value=""> Select Shift</option>
              {shifts.map((shift) => (
                <option key={shift.id_shifts} value={shift.id_shifts}>
                  {shift.shift_name}
                </option>
              ))}
            </select>
          </div>
          <div className="wrap ">
            <label htmlFor="roles_id" className="name_input">
              Role
            </label>
            <select
              type="number"
              placeholder="Role"
              onChange={handleInput}
              name="roles_id"
              value={values.roles_id}
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role.id_roles} value={role.id_roles}>
                  {role.role_name}
                </option>
              ))}
            </select>
          </div>
          <div className="wrap ">
            <label htmlFor="departments_id" className="name_input">
              Department
            </label>
            <select
              type="number"
              placeholder="Departments"
              onChange={handleInput}
              name="departments_id"
              value={values.departments_id}
            >
              <option value="">Select Department</option>
              {departments.map((department) => (
                <option key={department.id_dept} value={department.id_dept}>
                  {department.dept_name}
                </option>
              ))}
            </select>
          </div>
          <button className="login_button" type="submit">
            Create Account
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
