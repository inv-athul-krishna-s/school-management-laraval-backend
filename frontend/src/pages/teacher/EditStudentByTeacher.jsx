import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import axios from "../../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const EditStudentByTeacher = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    axios
      .get(`/my-students/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const s = res.data;
        const data = {
          name: s.user.name,
          email: s.user.email,
          phone_number: s.phone_number,
          roll_number: s.roll_number,
          student_class: s.student_class,
          date_of_birth: s.date_of_birth,
          admission_date: s.admission_date,
          status: s.status,
        };
        setFormData(data);
        setOriginalData(data);
      })
      .catch((err) => {
        console.error("Error fetching student data", err);
        alert("Failed to fetch student data.");
      });
  }, [id, token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData || !originalData) return;

    const payload = {};
    for (const key of [
      "phone_number",
      "roll_number",
      "student_class",
      "date_of_birth",
      "admission_date",
      "status",
    ]) {
      if (formData[key] !== originalData[key]) {
        payload[key] = formData[key];
      }
    }

    if (Object.keys(payload).length === 0) {
      alert("No changes made.");
      return;
    }

    try {
      await axios.put(`/my-students/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Student updated successfully.");
      navigate("/teacher/dashboard/students");
    } catch (error) {
      console.error("Error updating student", error.response?.data || error);
      alert("Failed to update student.");
    }
  };

  if (!formData) return <Typography>Loading...</Typography>;

  return (
    <Box maxWidth={600} mx="auto" my={4} p={3} boxShadow={3} bgcolor="#fff" borderRadius={2}>
      <Typography variant="h5" gutterBottom>
        Edit Student
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField label="Name" value={formData.name} fullWidth margin="normal" InputProps={{ readOnly: true }} />
        <TextField label="Email" value={formData.email} fullWidth margin="normal" InputProps={{ readOnly: true }} />

        {["phone_number", "roll_number", "student_class", "date_of_birth", "admission_date", "status"].map((key) => (
          <TextField
            key={key}
            fullWidth
            label={key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            type={key.includes("date") ? "date" : "text"}
            name={key}
            value={formData[key]}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={key.includes("date") ? { shrink: true } : {}}
          />
        ))}
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Save Changes
        </Button>
      </form>
    </Box>
  );
};

export default EditStudentByTeacher;
