import { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import axios from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const RegisterStudentByTeacher = () => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    password: "",
    roll_number: "",
    student_class: "",
    date_of_birth: "",
    admission_date: "",
    status: "active",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Optional: Auto-generate username from email prefix
    const username = formData.email.split("@")[0];

    const payload = {
      username: username,
      email: formData.email,
      first_name: formData.first_name,
      last_name: formData.last_name,
      phone_number: formData.phone_number,
      password: formData.password,
      roll_number: formData.roll_number,
      student_class: formData.student_class,
      date_of_birth: formData.date_of_birth,
      admission_date: formData.admission_date,
      status: formData.status,
    };

    try {
      await axios.post("/my-students/", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Student registered successfully");
      setFormData({
        email: "",
        first_name: "",
        last_name: "",
        phone_number: "",
        password: "",
        roll_number: "",
        student_class: "",
        date_of_birth: "",
        admission_date: "",
        status: "active",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to register student");
    }
  };

  return (
    <Box maxWidth={600} mx="auto" my={4} p={3} boxShadow={3} bgcolor="#fff" borderRadius={2}>
      <Typography variant="h5" gutterBottom>
        Register New Student
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth margin="normal" required />
        <TextField label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} fullWidth margin="normal" required />
        <TextField label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} fullWidth margin="normal" required />
        <TextField label="Phone Number" name="phone_number" value={formData.phone_number} onChange={handleChange} fullWidth margin="normal" required />
        <TextField label="Password" name="password" value={formData.password} onChange={handleChange} type="password" fullWidth margin="normal" required />
        <TextField label="Roll Number" name="roll_number" value={formData.roll_number} onChange={handleChange} fullWidth margin="normal" required />
        <TextField label="Class" name="student_class" value={formData.student_class} onChange={handleChange} fullWidth margin="normal" required />
        <TextField label="Date of Birth" name="date_of_birth" type="date" value={formData.date_of_birth} onChange={handleChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} required />
        <TextField label="Admission Date" name="admission_date" type="date" value={formData.admission_date} onChange={handleChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} required />
        
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Register Student
        </Button>
      </form>
    </Box>
  );
};

export default RegisterStudentByTeacher;
