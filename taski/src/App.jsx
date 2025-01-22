import "./Style/index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./Components/LoginForm";
import RegisterForm from "./Components/RegisterForm";
import HolidayEmployee from "./Components/HolidayEmployee";
import Layout from "./Layout";
import WorkScheduleEmployee from "./Components/WorkScheduleEmployee";
import ScheduleList from "./Components/ScheduleList";
import SupervisorSetup from "./Components/SupervisorSetup";
import WorkHistory from "./Components/WorkHistory";
import MyProfile from "./Components/MyProfile";
import Settings from "./Components/Settings";
import Msg from "./Components/Msg";
import MsgRecive from "./Components/MsgRecive";
import VerifyEmail from "./Components/VerifyEmail";
import ChangePassword from "./Components/ChangePassword";
import { useUser } from "./UserContext";
import EmpList from "./Components/EmpList";
import EmpDetails from "./Components/EmpDetails";
import Queue from "./Components/Queue";
import SendCodeEmail from "./Components/SendCodeEmail";

function App() {
  const { user } = useUser(); // Pobieranie informacji o zalogowanym użytkowniku
  const userRole = user?.role;
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* Jeśli użytkownik jest zalogowany, przekieruj na WorkScheduleEmployee */}
          <Route
            path="/"
            element={
              user ? (
                userRole == 1 ? (
                  <Navigate to="/WorkScheduleEmployee" replace />
                ) : (
                  <Navigate to="/ScheduleList" replace />
                )
              ) : (
                <LoginForm />
              )
            }
          />
          <Route path="/LoginForm" element={<LoginForm />} />
          <Route path="/RegisterForm" element={<RegisterForm />} />
          <Route path="/HolidayEmployee" element={<HolidayEmployee />} />
          <Route
            path="/WorkScheduleEmployee"
            element={<WorkScheduleEmployee />}
          />
          <Route path="/ScheduleList" element={<ScheduleList />} />
          <Route path="/SupervisorSetup" element={<SupervisorSetup />} />
          <Route path="/WorkHistory" element={<WorkHistory />} />
          <Route path="/MyProfile" element={<MyProfile />} />
          <Route path="/Settings" element={<Settings />} />
          <Route path="/Messages" element={<Msg />} />
          <Route path="/MsgRecive" element={<MsgRecive />} />
          <Route path="/VerifyEmail" element={<VerifyEmail />} />
          <Route path="/ChangePassword" element={<ChangePassword />} />
          <Route path="/DataEmployees" element={<EmpList />} />
          <Route path="/EmpDetails" element={<EmpDetails />} />
          <Route path="/Queue" element={<Queue />} />
          <Route path="SendCode" element={<SendCodeEmail />} />

          {/* Domyślne przekierowanie dla niezdefiniowanych ścieżek */}
          <Route path="*" element={<Navigate to="/LoginForm" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
