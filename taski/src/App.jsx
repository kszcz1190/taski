import "./Style/index.css";
import "./Style/App.css";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./Components/LoginForm";
import RegisterForm from "./Components/RegisterForm";
import LogReg from "./Components/LogReg";
import HolidayEmployee from "./Components/HolidayEmployee";
import HolidaySupervisor from "./Components/HolidaySupervisor";
import Layout from "./Layout";
import HomeEmployee from "./Components/HomeEmployee";
import HomeSupervisor from "./Components/HomeSupervisor";
import WorkScheduleSupervisor from "./Components/WorkScheduleSupervisor";
import WorkScheduleEmployee from "./Components/WorkScheduleEmployee";

function App() {
  const [userRole, setUserRole] = useState(null);
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
  }, []);

  const PrivateRoute = ({ children, role }) => {
    return userRole === role ? children : <Navigate to="/LoginForm" />;
  };
  PrivateRoute.propTypes = {
    children: PropTypes.node.isRequired, // children może być dowolnym węzłem React
    role: PropTypes.string.isRequired, // role powinna być stringiem
  };
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<LogReg />}></Route>
            <Route path="/LoginForm" element={<LoginForm />}></Route>
            <Route path="/RegisterForm" element={<RegisterForm />}></Route>
            <Route path="/HomeEmployee" element={<HomeEmployee />} />
            <Route path="/HomeSupervisor" element={<HomeSupervisor />} />
            <Route path="/HolidayEmployee" element={<HolidayEmployee />} />
            <Route path="/HolidaySupervisor" element={<HolidaySupervisor />} />
            <Route
              path="/WorkScheduleEmployee"
              element={<WorkScheduleEmployee />}
            />
            <Route
              path="/WorkScheduleSupervisor"
              element={<WorkScheduleSupervisor />}
            />

            <Route path="*" element={<Navigate to="/LoginForm" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
