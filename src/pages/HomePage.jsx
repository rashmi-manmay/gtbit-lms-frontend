import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Grid,
  Typography
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { apiRequest, calculateDays, formatDate, getCurrentUser } from "../api.js";

const getTodayLocal = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export default function HomePage() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const isHOD = user.role === "hod";

  const [leaves, setLeaves] = useState([]);
  const [leaveLoading, setLeaveLoading] = useState(true);

  const goToApplyLeave = () => {
    navigate("/apply-leave");
  };

  const goToHOD = () => {
    navigate("/hod");
  };

  /* ================= FETCH LEAVES ================= */

  const fetchLeaves = async () => {
    try {
      const data = await apiRequest("/api/leaves");

      setLeaves(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Home page leave error:", err);
    } finally {
      setLeaveLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();

    const timer = setInterval(() => {
      fetchLeaves();
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  /* ================= TODAY'S LEAVES ================= */

  const todayLeaves = useMemo(() => {
    const today = getTodayLocal();

    return leaves.filter(leave => {
      if (leave.status !== "Approved") {
        return false;
      }

      const from = leave.leaveFrom?.slice(0, 10);
      const to = leave.leaveTo?.slice(0, 10);

      if (!from || !to) {
        return false;
      }

      return today >= from && today <= to;
    });
  }, [leaves]);

  return (
    <div>

      {/* ================= WELCOME HEADER ================= */}

      <Card
        elevation={3}
        sx={{
          mb: 3,
          borderRadius: 3,
          background:
            "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
          color: "white"
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Typography variant="h4" fontWeight={700}>
            Welcome, {user.name || "User"}!
          </Typography>

           <Typography
            sx={{
              mt: 1,
              opacity: 0.9
            }}
          >
            Department of Information Technology,GTBIT
          </Typography>
        </CardContent>
      </Card>

      {/* ================= STAFF ON LEAVE TODAY ================= */}

      <Card
        elevation={5}
        sx={{
          mb: 4,
          borderRadius: 3,
          border: "3px solid #d32f2f",
          background: "#fff5f5"
        }}
      >
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>

          <Typography
            variant="h5"
            fontWeight={800}
            sx={{
              color: "#d32f2f",
              mb: 0.5
            }}
          >
            🔴 Staff On Leave Today
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            Currently approved leave applications for today
          </Typography>

          {leaveLoading ? (
            <Typography color="text.secondary">
              Checking today's leave...
            </Typography>
          ) : todayLeaves.length === 0 ? (
            <Alert severity="success">
              No staff members are on approved leave today.
            </Alert>
          ) : (
            <Grid container spacing={2}>
              {todayLeaves.map(leave => (
                <Grid
                  item
                  xs={12}
                  md={6}
                  lg={4}
                  key={leave._id}
                >
                  <Card
                    elevation={2}
                    sx={{
                      height: "100%",
                      borderRadius: 2,
                      borderLeft: "6px solid #d32f2f",
                      background: "white"
                    }}
                  >
                    <CardContent>

                      <Typography
                        variant="h6"
                        fontWeight={800}
                        sx={{ color: "#b71c1c" }}
                      >
                        {leave.name || "Staff"}
                      </Typography>

                      <Typography
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        {leave.designation || "-"}
                      </Typography>

                      <Typography sx={{ mt: 1 }}>
                        <b>Leave Type:</b>{" "}
                        {leave.leaveType === "Other"
                          ? leave.otherLeaveType || "Other"
                          : leave.leaveType || "-"}
                      </Typography>

                      <Typography>
                        <b>From:</b>{" "}
                        {formatDate(leave.leaveFrom)}
                      </Typography>

                      <Typography>
                        <b>To:</b>{" "}
                        {formatDate(leave.leaveTo)}
                      </Typography>

                      <Typography>
                        <b>Days:</b>{" "}
                        {leave.days ||
                          calculateDays(
                            leave.leaveFrom,
                            leave.leaveTo
                          )}
                      </Typography>

                      <Typography
                        sx={{
                          mt: 1,
                          fontWeight: 700,
                          color: "#d32f2f"
                        }}
                      >
                        ON LEAVE TODAY
                      </Typography>

                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>

      {/* ================= QUICK ACTIONS ================= */}

      <Typography
        variant="h5"
        fontWeight={700}
        sx={{ mb: 2 }}
      >
        Quick Actions
      </Typography>

      <Grid container spacing={3}>

        {/* APPLY LEAVE */}

        {!isHOD && (
          <Grid item xs={12} sm={6} md={4}>
            <Card
              elevation={2}
              sx={{
                height: "100%",
                borderRadius: 3,
                cursor: "pointer",
                transition: "0.2s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 6
                }
              }}
              onClick={goToApplyLeave}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h2"
                  sx={{ mb: 1 }}
                >
                  📝
                </Typography>

                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  Apply Leave
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{ mt: 1, mb: 2 }}
                >
                  Submit a new leave application and
                  manage class adjustments.
                </Typography>

                <Button
                  variant="contained"
                  onClick={e => {
                    e.stopPropagation();
                    goToApplyLeave();
                  }}
                >
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* HOD DASHBOARD */}

        {isHOD && (
          <Grid item xs={12} sm={6} md={4}>
            <Card
              elevation={2}
              sx={{
                height: "100%",
                borderRadius: 3,
                cursor: "pointer",
                transition: "0.2s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 6
                }
              }}
              onClick={goToHOD}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h2"
                  sx={{ mb: 1 }}
                >
                  📊
                </Typography>

                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  HOD Dashboard
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{ mt: 1, mb: 2 }}
                >
                  Review, approve and reject leave
                  applications.
                </Typography>

                <Button
                  variant="contained"
                  onClick={e => {
                    e.stopPropagation();
                    goToHOD();
                  }}
                >
                  Open Dashboard
                </Button>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* PROFILE */}

        <Grid item xs={12} sm={6} md={4}>
          <Card
            elevation={2}
            sx={{
              height: "100%",
              borderRadius: 3,
              transition: "0.2s",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: 6
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h2"
                sx={{ mb: 1 }}
              >
                👤
              </Typography>

              <Typography
                variant="h6"
                fontWeight={700}
              >
                My Profile
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                <b>Name:</b> {user.name || "-"}
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                <b>Designation:</b>{" "}
                {user.designation || "-"}
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                <b>Email:</b> {user.email || "-"}
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                <b>Role:</b>{" "}
                {isHOD ? "HOD" : user.role || "-"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* LEAVE MANAGEMENT */}

        {!isHOD && (
          <Grid item xs={12} sm={6} md={4}>
            <Card
              elevation={2}
              sx={{
                height: "100%",
                borderRadius: 3,
                transition: "0.2s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 6
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h2"
                  sx={{ mb: 1 }}
                >
                  📋
                </Typography>

                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  Leave Management
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Submit leave requests and track
                  approval status.
                </Typography>

                <Button
                  variant="outlined"
                  sx={{ mt: 2 }}
                  onClick={goToApplyLeave}
                >
                  View Leave History
                </Button>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* HOD LEAVE APPROVAL */}

        {isHOD && (
          <Grid item xs={12} sm={6} md={4}>
            <Card
              elevation={2}
              sx={{
                height: "100%",
                borderRadius: 3,
                transition: "0.2s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 6
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h2"
                  sx={{ mb: 1 }}
                >
                  ✅
                </Typography>

                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  Leave Approval
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  View pending applications and
                  manage leave status.
                </Typography>

                <Button
                  variant="outlined"
                  sx={{ mt: 2 }}
                  onClick={goToHOD}
                >
                  Manage Leaves
                </Button>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* SYSTEM INFORMATION */}

        <Grid item xs={12} sm={6} md={4}>
          <Card
            elevation={2}
            sx={{
              height: "100%",
              borderRadius: 3
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h2"
                sx={{ mb: 1 }}
              >
                🏫
              </Typography>

              <Typography
                variant="h6"
                fontWeight={700}
              >
                GTBIT IT LMS
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                Department of Information Technology
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                Leave application, class adjustment
                and approval management system.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

      </Grid>

      {/* ================= FOOTER ================= */}

      <Card
        elevation={1}
        sx={{
          mt: 4,
          borderRadius: 3
        }}
      >
        <CardContent sx={{ textAlign: "center" }}>
          <Typography
            color="text.secondary"
            variant="body2"
          >
            Developed for GTBIT Department of
            Information Technology
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}