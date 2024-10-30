import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import "./Style/index.css";

const LayoutEmployee = () => {
  return (
    <div>
      <Navbar />
      <div className="container_employee">
        <Outlet /> {}
      </div>
    </div>
  );
};

export default LayoutEmployee;
