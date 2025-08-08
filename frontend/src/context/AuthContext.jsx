import { createContext, useState, useContext, useEffect } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("accesstoken");
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post("/login", { email, password });
      const { token, user } = res.data;

      localStorage.setItem("accesstoken", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const role = user.role || "user";
      navigate(`/${role}/dashboard`);
    } catch (err) {
      const msg = err.response?.data?.error || "Login failed.";
      alert(msg);
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
