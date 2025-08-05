import React, { useEffect, useState } from "react";
import axios from "../../api/axios";

import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Paper,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get("/students");
      setStudents(res.data.data);
    } catch (err) {
      console.error("Failed to fetch students", err);
    }
  };

  const deleteStudent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await axios.delete(`/students/${id}`);
      fetchStudents();
    } catch (err) {
      console.error("Failed to delete student", err);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Students List
      </Typography>

      <Paper sx={{ overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.user?.name}</TableCell>
                <TableCell>{student.user?.email}</TableCell>
                <TableCell>{student.phone_number}</TableCell>
                <TableCell>
                  <IconButton onClick={() => navigate(`/admin/dashboard/students/edit-student/${student.id}`)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => deleteStudent(student.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={() => navigate("/admin/dashboard/register?role=student")}
      >
        Add New Student
      </Button>
    </Box>
  );
};

export default StudentList;
