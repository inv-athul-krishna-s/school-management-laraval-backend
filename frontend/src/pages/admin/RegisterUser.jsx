import { useEffect, useState } from "react";
import axios from "../../api/axios";
import {
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";

const RegisterUser = () => {
  const [role, setRole] = useState("teacher");
  const [mode, setMode] = useState("form");
  const [teachers, setTeachers] = useState([]);
  const [loadingTeachers, setLoadingTeachers] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const selectedRole = watch("role", role); 

  // Fetch teachers when student role is selected
  useEffect(() => {
  if (role === "student") {
    setLoadingTeachers(true);
    axios
      .get("/teachers/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        const data = res.data.data || res.data;  // declare first
        console.log("Fetched teachers:", data);     // now use
        setTeachers(data);
        setLoadingTeachers(false);
      })
      .catch((err) => {
        console.error("Error fetching teachers:", err);
        setLoadingTeachers(false);
      });
  }
}, [role]);


  const onSubmit = async (data) => {
  try {
    const { email, first_name, last_name, phone, password } = data;

    // Build the payload in your format
    const userPayload = {
      user: {
        email,
        first_name,
        last_name,
        phone,
        password,
      },
      phone: phone,
      status: data.status,
    };

    if (role === "teacher") {
      const payload = {
        ...userPayload,
        subject_specialization: data.subject_specialization,
        employee_id: data.employee_id,
        date_of_joining: data.date_of_joining,
      };

      // Flatten the payload before sending
      const finalPayload = {
        first_name: payload.user.first_name,
        last_name: payload.user.last_name,
        email: payload.user.email,
        password: payload.user.password,
        phone_number: payload.phone,
        subject_specialization: payload.subject_specialization,
        employee_id: payload.employee_id,
        date_of_joining: payload.date_of_joining,
        status: payload.status,
      };

      await axios.post("/teachers/", finalPayload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      alert("Teacher registered successfully");
    } else {
      const payload = {
        ...userPayload,
        roll_number: data.roll_number,
        student_class: data.student_class,
        date_of_birth: data.date_of_birth,
        admission_date: data.admission_date,
        assigned_teacher_id: data.assigned_teacher,
      };

      // Flatten the payload before sending
      const finalPayload = {
        first_name: payload.user.first_name,
        last_name: payload.user.last_name,
        email: payload.user.email,
        password: payload.user.password,
        phone_number: payload.phone,
        roll_number: payload.roll_number,
        student_class: payload.student_class,
        date_of_birth: payload.date_of_birth,
        admission_date: payload.admission_date,
        assigned_teacher_id: payload.assigned_teacher_id,
        status: payload.status,
      };

      await axios.post("/students/", finalPayload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      alert("Student registered successfully");
    }

    reset();
  } catch (err) {
    console.error(err);
    alert(`Error registering ${role}`);
  }
};


  return (
    <Box maxWidth={600} mx="auto" my={4} p={3} boxShadow={3} bgcolor="#fff" borderRadius={2}>
      <Typography variant="h5" gutterBottom>
        Register New {role.charAt(0).toUpperCase() + role.slice(1)}
      </Typography>

      {/* Role Selector */}
      <TextField
        select
        fullWidth
        label="Select Role"
        value={role}
        onChange={(e) => {
          setRole(e.target.value);
          setMode("form");
          reset(); // clear form on role switch
        }}
        margin="normal"
      >
        <MenuItem value="teacher">Teacher</MenuItem>
        <MenuItem value="student">Student</MenuItem>
      </TextField>

      {/* Form (teacher or student) */}
      {mode === "form" && (
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Shared Fields including password */}
          {["email", "first_name", "last_name", "phone", "password"].map((field) => (
            <Controller
              key={field}
              name={field}
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field: controllerField }) => (
                <TextField
                  {...controllerField}
                  fullWidth
                  label={field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  margin="normal"
                  type={field === "password" ? "password" : "text"} 
                  error={!!errors[field]}
                  helperText={errors[field] && "Required"}
                />
              )}
            />
          ))}

          {/* Role-Specific Fields */}
          {role === "teacher" && (
            <>
              {["subject_specialization", "employee_id", "date_of_joining"].map((field) => (
                <Controller
                  key={field}
                  name={field}
                  control={control}
                  defaultValue=""
                  rules={{ required: true }}
                  render={({ field: controllerField }) => (
                    <TextField
                      {...controllerField}
                      fullWidth
                      label={field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      type={field.includes("date") ? "date" : "text"}
                      margin="normal"
                      InputLabelProps={field.includes("date") ? { shrink: true } : {}}
                      error={!!errors[field]}
                      helperText={errors[field] && "Required"}
                    />
                  )}
                />
              ))}
            </>
          )}

          {role === "student" && (
            <>
              {["roll_number", "student_class", "date_of_birth", "admission_date"].map((field) => (
                <Controller
                  key={field}
                  name={field}
                  control={control}
                  defaultValue=""
                  rules={{ required: true }}
                  render={({ field: controllerField }) => (
                    <TextField
                      {...controllerField}
                      fullWidth
                      label={field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      type={field.includes("date") ? "date" : "text"}
                      margin="normal"
                      InputLabelProps={field.includes("date") ? { shrink: true } : {}}
                      error={!!errors[field]}
                      helperText={errors[field] && "Required"}
                    />
                  )}
                />
              ))}

              {/* Assigned Teacher Dropdown */}
              <Controller
  name="assigned_teacher"
  control={control}
  defaultValue=""
  rules={{ required: true }}
  render={({ field }) => (
    <TextField
      {...field}
      select
      fullWidth
      label="Assigned Teacher"
      margin="normal"
      error={!!errors.assigned_teacher}
      helperText={errors.assigned_teacher && "Required"}
    >
      {loadingTeachers ? (
        <MenuItem disabled>
          <CircularProgress size={20} />
        </MenuItem>
      ) : teachers.length > 0 ? (
        teachers.map((teacher) => (
          <MenuItem value={teacher.id} key={teacher.id}>
            {teacher.user?.name || `Teacher ${teacher.id}`}
          </MenuItem>
        ))
      ) : (
        <MenuItem disabled>No teachers available</MenuItem>
      )}
    </TextField>
  )}
/>

            </>
          )}

          {/* Status Dropdown (shared) */}
          <Controller
            name="status"
            control={control}
            defaultValue="active"
            render={({ field }) => (
              <TextField {...field} select fullWidth label="Status" margin="normal">
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </TextField>
            )}
          />

          <Button type="submit" variant="contained" color="primary" fullWidth>
            Register {role.charAt(0).toUpperCase() + role.slice(1)}
          </Button>
        </form>
      )}

    </Box>
  );
};

export default RegisterUser;
