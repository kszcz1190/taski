import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import "./Style/index.css";

const Layout = () => {
  return (
    <div>
      <Navbar />
      <div className="container">
        <Outlet /> {}
      </div>
    </div>
  );
};

export default Layout;
