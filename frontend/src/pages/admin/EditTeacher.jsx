import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { TextField, Button, Box, Typography, MenuItem } from "@mui/material";

const EditTeacher = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [originalForm, setOriginalForm] = useState(null);

  useEffect(() => {
    axios
      .get(`/teachers/${id}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        const teacherData = res.data;
        setForm(teacherData);
        setOriginalForm(teacherData);
      })
      .catch((err) => {
        console.error("Failed to load teacher data", err);
        alert("Failed to load teacher details.");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form || !originalForm) return;

    const payload = {};

    // Combine first_name + last_name for Laravel 'name' field
    const newName = `${form.user.first_name} ${form.user.last_name}`;
    const originalName = `${originalForm.user.first_name} ${originalForm.user.last_name}`;
    if (newName !== originalName) {
      payload.name = newName;
    }

    // Compare email
    if (form.user.email !== originalForm.user.email) {
      payload.email = form.user.email;
    }

    // Compare teacher fields
    const teacherFields = [
      "subject_specialization",
      "employee_id",
      "phone_number",
      "date_of_joining",
      "status"
    ];
    teacherFields.forEach((field) => {
      if (form[field] !== originalForm[field]) {
        payload[field] = form[field];
      }
    });

    if (Object.keys(payload).length === 0) {
      alert("No changes made.");
      return;
    }

    try {
      await axios.patch(`/teachers/${id}/`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("✅ Teacher updated!");
      navigate("/admin/dashboard/teachers");
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
      alert("Failed to update teacher.");
    }
  };

  if (!form) return <Typography>Loading...</Typography>;

  return (
    <Box maxWidth={600} mx="auto" mt={4}>
      <Typography variant="h5" mb={2}>Edit Teacher</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="First Name"
          name="user.first_name"
          value={form.user.first_name}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Last Name"
          name="user.last_name"
          value={form.user.last_name}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Email"
          name="user.email"
          value={form.user.email}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Phone Number"
          name="phone_number"
          value={form.phone_number}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Subject Specialization"
          name="subject_specialization"
          value={form.subject_specialization}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Employee ID"
          name="employee_id"
          value={form.employee_id}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Date of Joining"
          type="date"
          name="date_of_joining"
          value={form.date_of_joining}
          onChange={handleChange}
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          fullWidth
          select
          label="Status"
          name="status"
          value={form.status}
          onChange={handleChange}
          margin="normal"
        >
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </TextField>

        <Box mt={2} display="flex" justifyContent="space-between">
          <Button
            variant="outlined"
            onClick={() => navigate("/admin/dashboard/teachers")}
          >
            ⬅ Back
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Update Teacher
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default EditTeacher;
