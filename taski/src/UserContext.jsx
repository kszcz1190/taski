import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";

// Tworzenie kontekstu
const UserContext = createContext();

// Hook do używania kontekstu
export const useUser = () => useContext(UserContext);

// Provider kontekstu
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/", {
          withCredentials: true,
        });

        if (res.data.Status === "Success") {
          setUser({
            id: res.data.id_user,
            firstName: res.data.first_name,
            role: res.data.role,
          });
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }

      UserProvider.propTypes = {
        children: PropTypes.node.isRequired,
      };
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};
