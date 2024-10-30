import { Link } from "react-router-dom";
import "../Style/HomePages.css";

const HomeSupervisor = () => {
  return (
    <div className="wrapper_Home">
      <Link to={"/WorkScheduleSupervisor"} className="buttons_homePage">
        Work Schedule
      </Link>

      <Link to={"/HolidaySupervisor"} className="buttons_homePage">
        Holiday
      </Link>

      <Link to={"/RegisterForm"} className="buttons_homePage">
        Create Employee Account
      </Link>
    </div>
  );
};

export default HomeSupervisor;
