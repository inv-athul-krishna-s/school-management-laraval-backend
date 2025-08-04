import { useAuth } from "../context/AuthContext";
import { Button, Typography, Box } from "@mui/material";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4">Welcome, {user?.name}</Typography>
      <Typography variant="subtitle1">Role: {user?.role}</Typography>
      <Button variant="outlined" sx={{ mt: 2 }} onClick={logout}>Logout</Button>
    </Box>
  );
};

export default Dashboard;
