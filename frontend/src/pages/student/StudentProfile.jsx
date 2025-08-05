import { useEffect, useState } from "react";
import axios from "../../api/axios";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  CircularProgress,
  Grid,
  Divider,
} from "@mui/material";
import { deepPurple } from "@mui/material/colors";

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [teacherName, setTeacherName] = useState("Not assigned");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("/student/profile/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const studentData = res.data;
        setProfile(studentData);

        const teacherUser = studentData.teacher?.user;
        const assignedName = teacherUser?.name;

        setTeacherName(assignedName || "Not assigned");
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch student profile", err);
        setError("Failed to load profile.");
        setLoading(false);
      });
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

  const user = profile.user;
  const userName = user.name || "Student";

  return (
    <Box maxWidth="800px" mx="auto" mt={4} px={2}>
      <Card elevation={3}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Avatar
              sx={{
                bgcolor: deepPurple[500],
                width: 64,
                height: 64,
                fontSize: 28,
              }}
            >
              {user.name?.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h6">{userName}</Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1">{user.email}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Phone
              </Typography>
              <Typography variant="body1">{profile.phone_number}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Roll Number
              </Typography>
              <Typography variant="body1">{profile.roll_number}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Class
              </Typography>
              <Typography variant="body1">{profile.student_class}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Date of Birth
              </Typography>
              <Typography variant="body1">
                {new Date(profile.date_of_birth).toLocaleDateString("en-IN")}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Admission Date
              </Typography>
              <Typography variant="body1">
                {new Date(profile.admission_date).toLocaleDateString("en-IN")}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Assigned Teacher
              </Typography>
              <Typography variant="body1">{teacherName}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StudentProfile;
