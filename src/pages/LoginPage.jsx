import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Link as MuiLink,
  TextField,
  Typography
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { apiRequest } from "../api.js";

export default function LoginPage({ onLoggedIn }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  /* ================= SELECTED LOGIN ROLE ================= */

  const selectedRole =
    (
      location.state?.selectedRole ||
      localStorage.getItem("selectedRole") ||
      ""
    ).toLowerCase();

  const roleNames = {
    hod: "HOD",
    teacher: "Teacher",
    admin: "Admin",
    labassistant: "Lab Staff",
    "lab assistant": "Lab Staff",
    labstaff: "Lab Staff",
    "lab staff": "Lab Staff"
  };

  const selectedRoleName =
    roleNames[selectedRole] || "";

  /* ================= LOGIN ================= */

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);

      const data = await apiRequest("/api/login", {
        method: "POST",
        body: JSON.stringify({
          email: email.trim(),
          password
        })
      });

      /* ================= ROLE CHECK ================= */

      const actualRole = (
        data.role || ""
      ).toLowerCase();

      const actualRoleName =
        roleNames[actualRole] || data.role || "this account";

      if (
        selectedRole &&
        actualRole !== selectedRole
      ) {
        setError(
          `These credentials belong to ${actualRoleName}. Please use the ${actualRoleName} login option.`
        );

        return;
      }

      /* ================= SAVE LOGIN ================= */

      localStorage.setItem(
        "token",
        data.token || ""
      );

      localStorage.setItem(
        "email",
        data.email || email.trim().toLowerCase()
      );

      localStorage.setItem(
        "name",
        data.name || ""
      );

      localStorage.setItem(
        "designation",
        data.designation || ""
      );

      localStorage.setItem(
        "role",
        actualRole || "teacher"
      );

      onLoggedIn?.();

      navigate(
        actualRole === "hod"
          ? "/hod"
          : "/home",
        { replace: true }
      );

    } catch (err) {
      setError(
        err.message || "Login failed."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= FORGOT PASSWORD ================= */

  const handleForgotPassword = async e => {
    e.preventDefault();

    setForgotError("");
    setForgotMessage("");

    if (!forgotEmail.trim()) {
      setForgotError(
        "Please enter your email address."
      );
      return;
    }

    try {
      setForgotLoading(true);

      await apiRequest(
        "/api/forgot-password",
        {
          method: "POST",
          body: JSON.stringify({
            email: forgotEmail
              .trim()
              .toLowerCase()
          })
        }
      );

      setForgotMessage(
        "If this email is registered, a password reset link has been sent."
      );

    } catch (err) {
      setForgotError(
        err.message ||
        "Failed to process request."
      );
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        p: 2
      }}
    >
      <Card
        className="auth-card"
        elevation={5}
      >
        <CardContent sx={{ p: 4 }}>

          {/* ================= LOGIN ================= */}

          {!showForgot ? (
            <>
              <Typography
                variant="h4"
                fontWeight={700}
                align="center"
                gutterBottom
              >
                GTBIT IT LMS
              </Typography>

              <Typography
                align="center"
                color="text.secondary"
                sx={{ mb: 2 }}
              >
                Leave Management System
              </Typography>

              {/* ================= SELECTED ROLE ================= */}

              {selectedRoleName && (
                <Typography
                  align="center"
                  sx={{
                    mb: 3,
                    fontSize: "21px",
                    fontWeight: 700,
                    color: "#1976d2"
                  }}
                >
                  Login as {selectedRoleName}
                </Typography>
              )}

              {error && (
                <Alert
                  severity="error"
                  sx={{ mb: 2 }}
                >
                  {error}
                </Alert>
              )}

              <Box
                component="form"
                onSubmit={handleSubmit}
              >
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={e =>
                    setEmail(e.target.value)
                  }
                  margin="normal"
                />

                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={password}
                  onChange={e =>
                    setPassword(e.target.value)
                  }
                  margin="normal"
                />

                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  disabled={loading}
                  sx={{ mt: 2 }}
                >
                  {loading
                    ? "Logging in..."
                    : "Login"}
                </Button>

                <Box
                  sx={{
                    textAlign: "center",
                    mt: 2
                  }}
                >
                  <MuiLink
                    component="button"
                    type="button"
                    underline="hover"
                    onClick={() => {
                      setShowForgot(true);
                      setForgotEmail(email);
                      setError("");
                    }}
                    sx={{
                      background: "none",
                      border: 0,
                      cursor: "pointer",
                      fontSize: "14px"
                    }}
                  >
                    Forgot Password?
                  </MuiLink>
                </Box>

                <Typography
                  align="center"
                  sx={{ mt: 2 }}
                >
                  New user?{" "}
                  <MuiLink
                    component={Link}
                    to="/signup"
                  >
                    Create account
                  </MuiLink>
                </Typography>
              </Box>
            </>
          ) : (

            /* ================= FORGOT PASSWORD ================= */

            <>
              <Typography
                variant="h5"
                fontWeight={700}
                align="center"
                gutterBottom
              >
                Forgot Password
              </Typography>

              {selectedRoleName && (
                <Typography
                  align="center"
                  sx={{
                    mb: 2,
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "#1976d2"
                  }}
                >
                  Login as {selectedRoleName}
                </Typography>
              )}

              <Typography
                align="center"
                color="text.secondary"
                sx={{ mb: 3 }}
              >
                Enter your registered email address.
              </Typography>

              {forgotError && (
                <Alert
                  severity="error"
                  sx={{ mb: 2 }}
                >
                  {forgotError}
                </Alert>
              )}

              {forgotMessage && (
                <Alert
                  severity="success"
                  sx={{ mb: 2 }}
                >
                  {forgotMessage}
                </Alert>
              )}

              <Box
                component="form"
                onSubmit={handleForgotPassword}
              >
                <TextField
                  fullWidth
                  label="Registered Email"
                  type="email"
                  value={forgotEmail}
                  onChange={e =>
                    setForgotEmail(e.target.value)
                  }
                  margin="normal"
                />

                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  disabled={forgotLoading}
                  sx={{ mt: 2 }}
                >
                  {forgotLoading
                    ? "Sending..."
                    : "Send Reset Link"}
                </Button>

                <Button
                  fullWidth
                  variant="text"
                  onClick={() => {
                    setShowForgot(false);
                    setForgotError("");
                    setForgotMessage("");
                  }}
                  sx={{ mt: 1 }}
                >
                  Back to Login
                </Button>
              </Box>
            </>
          )}

        </CardContent>
      </Card>
    </Box>
  );
}