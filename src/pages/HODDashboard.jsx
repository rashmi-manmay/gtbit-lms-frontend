import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import { apiRequest, calculateDays, formatDate } from "../api.js";

const months = ["All", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function HODDashboard() {
  const [leaves, setLeaves] = useState([]);
  const [selectedName, setSelectedName] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("All");
  const [showAll, setShowAll] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchLeaves = async () => {
    try {
      const data = await apiRequest("/api/leaves");
      setLeaves(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    }
  };

// refresh HOD leaves every 3 seconds so the dashboard updates without manual refresh
useEffect(() => {
  // initial load
  fetchLeaves();

  // polling interval
  const poll = setInterval(() => {
    fetchLeaves();
  }, 3000); // 3 seconds

  return () => clearInterval(poll);
}, []); // run once on mount, cleaned up on unmount
  const uniqueNames = useMemo(
    () => ["All", ...new Set(leaves.map(l => l.name).filter(Boolean))],
    [leaves]
  );

  const filteredLeaves = useMemo(() => {
    return leaves.filter(leave => {
      const matchName = selectedName === "All" || leave.name === selectedName;
      const matchDate = !dateFilter || leave.leaveFrom?.slice(0, 10) === dateFilter;
      const matchMonth =
        monthFilter === "All" ||
        new Date(`${leave.leaveFrom}T00:00:00`).getMonth() + 1 === months.indexOf(monthFilter);
      return matchName && matchDate && matchMonth;
    });
  }, [leaves, selectedName, dateFilter, monthFilter]);

  const pendingLeaves = filteredLeaves.filter(l => l.status === "Pending");

  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const todayLeaves = filteredLeaves.filter(l => {
    const from = l.leaveFrom?.slice(0, 10);
    const to = l.leaveTo?.slice(0, 10);
    return from && to && todayStr >= from && todayStr <= to;
  });

const updateStatus = async (id, status) => {
  setError("");
  setMessage("");

  let rejectReason = "";

  if (status === "Rejected") {
    rejectReason = window.prompt("Enter reason for rejection:") || "";

    if (!rejectReason.trim()) {
      return;
    }
  }

  try {
    const response = await apiRequest(`/api/leaves/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        status,
        rejectReason
      })
    });

    setLeaves(prevLeaves =>
      prevLeaves.map(leave =>
        String(leave._id) === String(id)
          ? {
              ...leave,
              status: status,
              rejectReason: rejectReason
            }
          : leave
      )
    );

    setMessage(`Leave ${status.toLowerCase()} successfully.`);

    console.log("Leave updated:", response);

    fetchLeaves();
  } catch (err) {
    console.error("Update status error:", err);
    setError(err.message || "Failed to update leave status");
  }
};
  const clearFilters = () => {
    setSelectedName("All");
    setDateFilter("");
    setMonthFilter("All");
  };

  const renderTable = data => (
    <div className="table-wrap">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Designation</TableCell>
            <TableCell>From</TableCell>
            <TableCell>To</TableCell>
            <TableCell>Total Days</TableCell>
            <TableCell>Reason</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Adjustment</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Reject Reason</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(leave => (
            <TableRow key={leave._id}>
              <TableCell>{leave.name}</TableCell>
              <TableCell>{leave.designation}</TableCell>
              <TableCell>{formatDate(leave.leaveFrom)}</TableCell>
              <TableCell>{formatDate(leave.leaveTo)}</TableCell>
              <TableCell>{calculateDays(leave.leaveFrom, leave.leaveTo)}</TableCell>
              <TableCell>{leave.reason}</TableCell>
              <TableCell>{leave.leaveType === "Other" ? (leave.otherLeaveType || "Other") : leave.leaveType}</TableCell>
              <TableCell>
  {leave.adjustments ? (
    <details>
      <summary
        style={{
          cursor: "pointer",
          fontWeight: 600,
          color: "#1976d2"
        }}
      >
        View Adjustment
      </summary>

      <div
        style={{
          marginTop: "8px",
          padding: "10px",
          background: "#f5f5f5",
          borderRadius: "6px",
          minWidth: "320px",
          whiteSpace: "pre-line",
          fontSize: "14px"
        }}
      >
        {leave.adjustments}
      </div>
    </details>
  ) : (
    "-"
  )}
</TableCell>
              <TableCell>{leave.status}</TableCell>
              <TableCell>{leave.rejectReason || "-"}</TableCell>
              <TableCell>
                {leave.status === "Pending" ? (
                  <>
                    <Button size="small" variant="contained" onClick={() => updateStatus(leave._id, "Approved")} sx={{ mr: 1, mb: 1 }}>
                      Approve
                    </Button>
                    <Button size="small" variant="contained" color="error" onClick={() => updateStatus(leave._id, "Rejected")} sx={{ mb: 1 }}>
                      Reject
                    </Button>
                  </>
                ) : (
  <Typography
    variant="body2"
    fontWeight={700}
    color={leave.status === "Approved" ? "success.main" : "error.main"}
  >
    {leave.status}
  </Typography>
)}
              </TableCell>
            </TableRow>
          ))}
          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={11} align="center">No leaves found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5" fontWeight={700}>HOD Dashboard</Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          {today.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </Typography>
      </Grid>

      {(error || message) && (
        <Grid item xs={12}>
          {error && <Alert severity="error">{error}</Alert>}
          {message && <Alert severity="success">{message}</Alert>}
        </Grid>
      )}

      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={3}>
                <Select fullWidth value={selectedName} onChange={e => setSelectedName(e.target.value)}>
                  {uniqueNames.map(name => <MenuItem key={name} value={name}>{name}</MenuItem>)}
                </Select>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField fullWidth type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} InputLabelProps={{ shrink: true }} label="Date" />
              </Grid>
              <Grid item xs={12} sm={2}>
                <Select fullWidth value={monthFilter} onChange={e => setMonthFilter(e.target.value)}>
                  {months.map(month => <MenuItem key={month} value={month}>{month}</MenuItem>)}
                </Select>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button fullWidth variant="outlined" onClick={clearFilters}>Clear</Button>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button fullWidth variant="contained" onClick={fetchLeaves}>Refresh</Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Button variant={showAll ? "outlined" : "contained"} onClick={() => setShowAll(false)} sx={{ mr: 1 }}>
            Dashboard View
          </Button>
          <Button variant={showAll ? "contained" : "outlined"} onClick={() => setShowAll(true)}>
            All Leaves
          </Button>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          {!showAll ? (
            <>
              <Typography variant="h6" sx={{ mb: 1 }}>Pending Leaves</Typography>
              {renderTable(pendingLeaves)}

              <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Currently On Leave</Typography>
              {renderTable(todayLeaves)}
            </>
          ) : (
            <>
              <Typography variant="h6" sx={{ mb: 1 }}>All Leaves</Typography>
              {renderTable(filteredLeaves)}
            </>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
}
