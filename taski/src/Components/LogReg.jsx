import "../Style/LogReg.css";
import { Link } from "react-router-dom";

const LogReg = () => {
  return (
    <div className="wrapper_LogReg">
      <Link to={"/RegisterForm"} className="button_LogReg">
        CREATE AN ACCOUNT
      </Link>
      <Link to={"/LoginForm"} className="button_LogReg">
        LOG IN
      </Link>
    </div>
  );
};

export default LogReg;
