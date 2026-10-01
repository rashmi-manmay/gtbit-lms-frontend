import React from "react";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { clearUser, getCurrentUser } from "../api.js";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();
  const isHOD = user.role === "hod";

  const logout = () => {
    clearUser();
    navigate("/", { replace: true });
  };

  return (
    <>
      <AppBar position="sticky">
        <Toolbar sx={{ gap: 1, flexWrap: "wrap", py: 1 }}>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            GTBIT IT LMS
          </Typography>

          <Typography variant="body2" sx={{ mr: 1, display: { xs: "none", sm: "block" } }}>
            {user.name || user.email}
          </Typography>

          <Button component={Link} to="/home" color="inherit">
            Home
          </Button>

          {!isHOD && (
            <Button
              component={Link}
              to="/apply-leave"
              color="inherit"
              sx={{ fontWeight: location.pathname === "/apply-leave" ? 800 : 400 }}
            >
              Apply Leave
            </Button>
          )}

          {isHOD && (
            <Button component={Link} to="/hod" color="inherit">
              HOD Dashboard
            </Button>
          )}

          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: 1400, mx: "auto", p: { xs: 2, md: 3 } }}>
        <Outlet />
      </Box>
    </>
  );
}
