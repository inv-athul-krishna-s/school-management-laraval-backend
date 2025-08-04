import { createContext, useContext, useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post("/login", { email, password });
      const { token, user, role } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ ...user, role }));

      setToken(token);
      setUser({ ...user, role });

      navigate(`/${role}/dashboard`);
    } catch (err) {
      alert("Invalid credentials");
      throw err;
    }
  };

  const register = async (formData) => {
    try {
      const res = await axios.post("/register", formData);
      const { token, user, role } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ ...user, role }));

      setToken(token);
      setUser({ ...user, role });

      navigate(`/${role}/dashboard`);
    } catch (err) {
      alert("Registration failed");
      throw err;
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setToken(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
