import {
  Box,
  Grid,
  Card,
  Typography,
  CircularProgress,
  Avatar,
} from "@mui/material";
import { School, Person } from "@mui/icons-material";
import { useEffect, useState } from "react";
import axios from "../../api/axios";

const StudentDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        };

        const response = await axios.get("/student/profile/", { headers });
        setProfile(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load dashboard data.");
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" mt={5}>
        {error}
      </Typography>
    );
  }

  const userName = profile.user?.name || "Student";

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Welcome, {userName}
      </Typography>

      <Grid container spacing={3} mt={1}>
        <Grid item xs={12} md={6}>
          <Card sx={{ display: "flex", alignItems: "center", p: 2 }}>
            <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
              <School />
            </Avatar>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Your Class
              </Typography>
              <Typography variant="h6">{profile.student_class}</Typography>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ display: "flex", alignItems: "center", p: 2 }}>
            <Avatar sx={{ bgcolor: "success.main", mr: 2 }}>
              <Person />
            </Avatar>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Roll Number
              </Typography>
              <Typography variant="h6">{profile.roll_number}</Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentDashboard;
