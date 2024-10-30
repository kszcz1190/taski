import { Link, useLocation } from "react-router-dom";
import "./Style/Navbar.css";
import { useEffect, useState } from "react";
import axios from "axios";

const Navbar = () => {
  const [auth, setAuth] = useState(false);
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    axios
      .get("http://localhost:5000/logout")
      .then(() => {
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios
      .get("http://localhost:5000")
      .then((res) => {
        if (res.data.Status === "Success") {
          setAuth(true);
          setName(res.data.name);
        } else {
          setAuth(false);
        }
      })
      .catch((err) => {
        console.error("Authorization error:", err);
        setAuth(false);
      });
  }, []);

  // const formatDate = () => {
  //   const now = new Date();
  //   const options = {
  //     year: "numeric",
  //     month: "2-digit",
  //     day: "2-digit",
  //     weekday: "long",
  //   };
  //   return now.toLocaleDateString("en-US", options);
  // };

  const getPageTitle = (path) => {
    switch (path) {
      case "/LoginForm":
        return "Login";
      case "/RegisterForm":
        return "Create Employee Account";
      case "/Home":
        return "Home";
      case "/HolidayEmployee":
        return "Holiday";
      case "/WorkScheduleEmployee":
      case "/WorkScheduleSupervisor":
        return "Schedule";
      case "/HolidaySupervisor":
        return "Holiday Planer";
      default:
        return "";
    }
  };
  return (
    <nav className="navbar sticky-top">
      <a className="navbar-brand" href="#">
        <div className="logo">TASKI</div>
      </a>
      <div className="header">{getPageTitle(location.pathname)}</div>

      {auth ? (
        <div className="wrapper_menu">
          <button
            className="userPanel"
            onClick={() => {
              setOpen(!open);
            }}
          >
            {name.charAt(0).toUpperCase()}
          </button>
          <div className={`dropdownMenu ${open ? "active" : "inactive"}`}>
            <h3>{name.toUpperCase()}</h3>
            <ul>
              <li>
                <Link to={"/Settings"}>Settings</Link>
              </li>
              <li>
                <Link to={"/UsersPanel"}>My Account</Link>
              </li>
              <li>
                <button className="btn btn-danger" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <Link to="/LoginForm" className="button_login">
          Login
        </Link>
      )}
    </nav>
  );
};

export default Navbar;
