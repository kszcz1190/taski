import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import axios from "axios";
import "./Style/Navbar.css";
import { useUser } from "./UserContext.jsx";
import PropTypes from "prop-types";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user } = useUser();
  const userRole = user?.role;

  const location = useLocation();

  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  // Wylogowanie użytkownika
  const handleLogout = async () => {
    try {
      const response = await axios.get("http://localhost:5000/logout");
      if (response.data.Status === "Success") {
        setOpen(false);
        navigate("/LoginForm"); // Przekierowanie na stronę logowania
        window.location.reload();
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };
  let menuRef = useRef();

  const getPageTitle = (path) => {
    const titles = {
      "/LoginForm": "Zaloguj",
      "/": "Zaloguj",
      "/RegisterForm": "Stwórz konto",
      "/Home": "Strona główna",
      "/HolidayEmployee": "Urlop",
      "/WorkScheduleEmployee": "Grafik na bieżący tydzień",
      "/SupervisorSetup": "Ustalanie grafiku",
      "/HolidaySupervisor": "Planer urlopów",
      "/ScheduleList": "Grafik",
      "/WorkHistory": "Historia pracy i urlop pracownika",
      "/MyProfile": "Mój profil",
      "/Settings": "Zmień hasło",
      "/Messages": "Wyślij wiadomość",
      "/MsgRecive": "Zobacz wiadomości",
      "/VerifyEmail": "Resetuj hasło",
      "/ChangePassword": "Zmień hasło",
      "/DataEmployees": "Dane pracowników",
      "/EmpDetails": "Szczegóły pracownika",
      "/Queue": "Kolejka",
    };
    return titles[path] || "";
  };

  DropDownItem.propTypes = {
    link: PropTypes.string,
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func,
  };
  function DropDownItem(props) {
    return (
      <li className="dropdownItem" onClick={props.onClick}>
        {props.link ? (
          <Link to={props.link}>
            <>{props.text}</>
          </Link>
        ) : (
          <a>{props.text}</a>
        )}
      </li>
    );
  }

  return (
    <nav className="navbar sticky-top">
      {user ? (
        <div className="menu_container">
          <div
            className="menu"
            onClick={() => {
              setOpen(!open);
            }}
          >
            <div className="first"></div>
            <div className="second"></div>
            <div className="third"></div>
          </div>
          <div
            className={`dropdown_menu ${open ? "active" : "inactive"}`}
            ref={menuRef}
          >
            {userRole == 1 ? (
              <ul>
                <DropDownItem text="Mój profil" link={"/MyProfile"} />
                <DropDownItem text="Grafik" link={"/WorkScheduleEmployee"} />
                <DropDownItem text="Urlop" link={"/HolidayEmployee"} />
                <DropDownItem text="Zobacz wiadomości" link={"/MsgRecive"} />
                <DropDownItem text="Wyślij wiadomość" link={"/Messages"} />
                <DropDownItem text="Ustawienia" link={"/Settings"} />
                <DropDownItem
                  text="Wyloguj"
                  link={"/LoginForm"}
                  onClick={handleLogout}
                />
              </ul>
            ) : (
              <></>
            )}

            {userRole == 2 ? (
              <ul>
                <DropDownItem text="Mój profil" link={"/MyProfile"} />
                <DropDownItem text="Dodaj pracownika" link={"/RegisterForm"} />
                <DropDownItem
                  text="Historia pracy pracownika"
                  link={"/WorkHistory"}
                />
                <DropDownItem text="Dane pracowników" link={"/DataEmployees"} />
                <DropDownItem text="Ustal grafik" link={"/SupervisorSetup"} />
                <DropDownItem text="Zobacz grafik" link={"/ScheduleList"} />
                <DropDownItem text="Wyślij wiadomość" link={"/Messages"} />
                <DropDownItem text="Zobacz wiadomości" link={"/MsgRecive"} />
                <DropDownItem text="Ustawienia" link={"/Settings"} />
                <DropDownItem text="Wyloguj" onClick={handleLogout} />
              </ul>
            ) : (
              <></>
            )}
          </div>
        </div>
      ) : (
        <></>
      )}
      <div className="logo">TASKI</div>
      <div className="header">{getPageTitle(location.pathname)}</div>

      {user ? (
        <div className="wrapper_menu">
          <div className="userPanel">Witaj {user.firstName}</div>
        </div>
      ) : (
        <></>
      )}
    </nav>
  );
};

export default Navbar;
