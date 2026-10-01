import React, { useState } from "react";
import { Alert, Box, Button, Card, CardContent, MenuItem, TextField, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../api.js";

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Teacher",
    designation: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const change = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name.trim() || !form.email.trim() || !form.password || !form.designation.trim()) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);
      await apiRequest("/api/register", {
        method: "POST",
        body: JSON.stringify({ ...form, name: form.name.trim(), email: form.email.trim() })
      });
      setSuccess("Registered successfully. You can now login.");
      setTimeout(() => navigate("/login"), 900);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", p: 2 }}>
      <Card className="auth-card" elevation={5}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" fontWeight={700} align="center" gutterBottom>
            Create Account
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <Box component="form" onSubmit={submit}>
            <TextField fullWidth name="name" label="Name" value={form.name} onChange={change} margin="normal" />
            <TextField fullWidth name="email" label="Email" type="email" value={form.email} onChange={change} margin="normal" />
            <TextField fullWidth name="password" label="Password" type="password" value={form.password} onChange={change} margin="normal" />
            <TextField fullWidth name="designation" label="Designation" value={form.designation} onChange={change} margin="normal" />
            <TextField select fullWidth name="role" label="Role" value={form.role} onChange={change} margin="normal">
              <MenuItem value="Teacher">Teacher</MenuItem>
              <MenuItem value="Lab Assistant">Lab Assistant</MenuItem>
            </TextField>

            <Button fullWidth variant="contained" type="submit" disabled={loading} sx={{ mt: 2 }}>
              {loading ? "Creating..." : "Create Account"}
            </Button>

            <Button fullWidth component={Link} to="/login" sx={{ mt: 1 }}>
              Back to Login
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
