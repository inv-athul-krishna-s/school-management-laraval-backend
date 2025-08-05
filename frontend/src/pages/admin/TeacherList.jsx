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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await axios.get("/teachers");
      setTeachers(res.data.data);
    } catch (err) {
      console.error("Failed to fetch teachers", err);
    }
  };

  const deleteTeacher = async (id) => {
    if (!window.confirm("Are you sure you want to delete this teacher?")) return;
    try {
      await axios.delete(`/teachers/${id}`);
      fetchTeachers();
    } catch (err) {
      console.error("Failed to delete teacher", err);
    }
  };

  const viewStudents = async (teacher) => {
    try {
      const res = await axios.get(`/teachers/${teacher.id}/students`);
      setStudents(res.data);
      setSelectedTeacher(teacher);
      setOpenModal(true);
    } catch (err) {
      console.error("Failed to fetch students for teacher", err);
      alert("Failed to load students.");
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Teachers List
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
            {teachers.map((teacher) => (
              <TableRow key={teacher.id}>
                <TableCell>{teacher.user?.name}</TableCell>
                <TableCell>{teacher.user?.email}</TableCell>
                <TableCell>{teacher.phone_number}</TableCell>
                <TableCell>
                  <IconButton onClick={() => navigate(`/admin/dashboard/teachers/edit-teacher/${teacher.id}`)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => deleteTeacher(teacher.id)}>
                    <DeleteIcon />
                  </IconButton>
                  <Button onClick={() => viewStudents(teacher)} size="small" sx={{ ml: 1 }}>
                    View Students
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={() => navigate("/admin/register?role=teacher")}
      >
        Add New Teacher
      </Button>

      {/* Modal for Students */}
      <Dialog open={openModal} fullWidth maxWidth="md" onClose={() => setOpenModal(false)}>
        <DialogTitle>
          Students under {selectedTeacher?.user.first_name} {selectedTeacher?.user.last_name}
          <IconButton
            aria-label="close"
            onClick={() => setOpenModal(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {students.length === 0 ? (
            <Typography>No students assigned.</Typography>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Class</TableCell>
                  <TableCell>Roll Number</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((stu, idx) => (
                  <TableRow key={stu.id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{stu.user.name}</TableCell>
                    <TableCell>{stu.user.email}</TableCell>
                    <TableCell>{stu.student_class}</TableCell>
                    <TableCell>{stu.roll_number}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeacherList;
