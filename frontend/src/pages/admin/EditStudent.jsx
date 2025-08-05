import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Paper,
  Grid,
} from "@mui/material";

const EditStudent = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [originalForm, setOriginalForm] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/students/${id}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        const data = res.data;

        // Split full name to first and last
        const [first_name, ...lastParts] = data.user.name.split(" ");
        const last_name = lastParts.join(" ");
        setForm({
          ...data,
          user: {
            ...data.user,
            first_name: first_name || "",
            last_name: last_name || "",
          },
        });
        setOriginalForm({
          ...data,
          user: {
            ...data.user,
            first_name: first_name || "",
            last_name: last_name || "",
          },
        });
      })
      .catch((err) => {
        console.error("Failed to load student data:", err);
        alert("Failed to load student details.");
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("user.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        user: { ...prev.user, [key]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form || !originalForm) return;

    const payload = {};

    // Combine first and last name into name
    const newName = `${form.user.first_name} ${form.user.last_name}`.trim();
    const originalName = `${originalForm.user.first_name} ${originalForm.user.last_name}`.trim();
    if (newName !== originalName) {
      payload.name = newName;
    }

    if (form.user.email !== originalForm.user.email) {
      payload.email = form.user.email;
    }

    const studentFields = [
      "roll_number",
      "student_class",
      "phone_number",
      "date_of_birth",
      "admission_date",
      "status",
      "assigned_teacher_id",
    ];

    studentFields.forEach((field) => {
      if (form[field] !== originalForm[field]) {
        payload[field] = form[field];
      }
    });

    if (Object.keys(payload).length === 0) {
      alert("No changes made.");
      return;
    }

    axios
      .patch(`/students/${id}/`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => {
        alert("✅ Student updated!");
        navigate("/admin/dashboard/students");
      })
      .catch((err) => {
        console.error("Update failed:", err.response?.data || err.message);
        alert("❌ Failed to update student.");
      });
  };

  if (!form) return <Typography mt={5} align="center">Loading student data...</Typography>;

  return (
    <Box maxWidth="md" mx="auto" mt={4}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" mb={3} align="center">
          Edit Student
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* User Info */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="user.first_name"
                value={form.user.first_name}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="user.last_name"
                value={form.user.last_name}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="user.email"
                type="email"
                value={form.user.email}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
              />
            </Grid>

            {/* Student Info */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Roll Number"
                name="roll_number"
                value={form.roll_number}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Class"
                name="student_class"
                value={form.student_class}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                name="date_of_birth"
                type="date"
                value={form.date_of_birth}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Admission Date"
                name="admission_date"
                type="date"
                value={form.admission_date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Status"
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Assigned Teacher ID"
                name="assigned_teacher_id"
                type="number"
                value={form.assigned_teacher_id}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Box mt={4} display="flex" justifyContent="space-between">
            <Button
              variant="outlined"
              onClick={() => navigate("/admin/dashboard/students")}
            >
              ⬅ Back
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Update Student
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default EditStudent;
