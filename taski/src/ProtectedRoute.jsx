import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ role, allowedRoles, children }) => {
  if (role === null) {
    // Jeśli role jeszcze się ładuje, wyświetl loader lub nic
    return <div>Loading...</div>;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/LoginForm" />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  role: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  allowedRoles: PropTypes.array.isRequired,
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
