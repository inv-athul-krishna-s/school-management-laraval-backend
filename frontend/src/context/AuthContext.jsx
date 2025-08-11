import { createContext, useState, useContext, useEffect } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("accesstoken");
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);
  const login = async (email, password) => {
    try {
      const res = await axios.post("/login", { email, password });
      

      const accessToken = res.data.access_token;
      const refreshToken = res.data.refresh_token;
      const userData = res.data.user;

      localStorage.setItem("accesstoken", accessToken);
      localStorage.setItem("refreshtoken", refreshToken);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      const role = userData.role || "user";
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
