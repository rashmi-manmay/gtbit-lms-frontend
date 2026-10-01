import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material";

import {
  apiRequest,
  calculateDays,
  formatDate,
  getCurrentUser
} from "../api.js";

import { timetableData } from "../timetableData.js";

/* ================= TIME SLOTS ================= */

const TIME_SLOTS = [
  "08:00-09:00",
  "09:00-10:00",
  "10:00-11:00",
  "11:00-12:00",
  "12:30-01:30",
  "01:30-02:30",
  "02:30-03:30",
  "03:30-04:30",
  "04:30-05:30"
];

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

/* ================= HELPERS ================= */

const normalizeName = name =>
  String(name || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

const getTimetableTeacher = name => {
  const normalized = normalizeName(name);

  if (!normalized) return null;

  // First try exact match
  const exact = timetableData.find(
    teacher => normalizeName(teacher.teacher) === normalized
  );

  if (exact) return exact;

  // Then try a safe partial match
  return timetableData.find(teacher => {
    const timetableName = normalizeName(teacher.teacher);
    return (
      timetableName.includes(normalized) ||
      normalized.includes(timetableName)
    );
  }) || null;
};

const getDatesBetween = (from, to) => {
  if (!from || !to) return [];

  const start = new Date(`${from}T00:00:00`);
  const end = new Date(`${to}T00:00:00`);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return [];
  }

  if (end < start) return [];

  const dates = [];
  const current = new Date(start);

  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
};

const formatDisplayDate = date =>
  date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

/* ================= INITIAL FORM ================= */

const blankForm = () => {
  const user = getCurrentUser();

  return {
    userEmail: user.email,
    name: user.name,
    designation: user.designation,
    leaveFrom: "",
    leaveTo: "",
    reason: "",
    leaveType: "",
    otherLeaveType: "",
    adjustments: "",
    dayType: "",
    halfType: ""
  };
};

export default function LeaveRequestForm() {
  const [formData, setFormData] = useState(blankForm);
  const [history, setHistory] = useState([]);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);

  // Stores the teacher selected for each class adjustment
  const [adjustmentSelections, setAdjustmentSelections] = useState({});

  const currentUser = getCurrentUser();
  const email = currentUser.email;

  /* ================= FETCH HISTORY ================= */

  const fetchHistory = async () => {
    try {
      setHistoryLoading(true);

      const data = await apiRequest("/api/leaves");

      const userLeaves = Array.isArray(data)
        ? data.filter(
            leave =>
              (leave.userEmail || leave.email || leave.user) === email
          )
        : [];

      setHistory(userLeaves);
    } catch (err) {
      console.error("History error:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();

    const timer = setInterval(() => {
      fetchHistory();
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  /* ================= TEACHER TIMETABLE ================= */

  const currentTeacherTimetable = useMemo(() => {
    return getTimetableTeacher(currentUser.name);
  }, [currentUser.name]);

  /* ================= LEAVE DATES + CLASSES ================= */

  const leaveClasses = useMemo(() => {
    if (!formData.leaveFrom || !formData.leaveTo) {
      return [];
    }

    if (!currentTeacherTimetable) {
      return [];
    }

    const selectedDates = getDatesBetween(
      formData.leaveFrom,
      formData.leaveTo
    );

    const classes = [];

    selectedDates.forEach(date => {
      const dayName = DAY_NAMES[date.getDay()];
      const daySchedule =
        currentTeacherTimetable.schedule?.[dayName] || {};

      TIME_SLOTS.forEach(timeSlot => {
        const className = daySchedule[timeSlot];

        // Only show actual teaching classes
        if (!className) return;

        // Find faculty members who are FREE at this same day/time
        const availableTeachers = timetableData
          .filter(teacher => {
            if (
              normalizeName(teacher.teacher) ===
              normalizeName(currentTeacherTimetable.teacher)
            ) {
              return false;
            }

            const otherDaySchedule =
              teacher.schedule?.[dayName] || {};

            return !otherDaySchedule[timeSlot];
          })
          .map(teacher => teacher.teacher);

        const key =
          `${date.toISOString().slice(0, 10)}_${timeSlot}_${className}`;

        classes.push({
          key,
          date: date.toISOString().slice(0, 10),
          displayDate: formatDisplayDate(date),
          dayName,
          timeSlot,
          className,
          availableTeachers
        });
      });
    });

    return classes;
  }, [
    formData.leaveFrom,
    formData.leaveTo,
    currentTeacherTimetable
  ]);

  /* ================= CREATE ADJUSTMENT TEXT ================= */

  useEffect(() => {
    if (!formData.leaveFrom || !formData.leaveTo) {
      setAdjustmentSelections({});
      setFormData(prev => ({
        ...prev,
        adjustments: ""
      }));
      return;
    }

    if (!currentTeacherTimetable) {
      setFormData(prev => ({
        ...prev,
        adjustments: ""
      }));
      return;
    }

    if (leaveClasses.length === 0) {
      setFormData(prev => ({
        ...prev,
        adjustments: "No classes scheduled during selected leave period."
      }));
      return;
    }

    const adjustmentLines = leaveClasses
      .filter(item => adjustmentSelections[item.key])
      .map(item => {
        return `${item.displayDate} (${item.dayName}) | ${item.timeSlot} | ${item.className} | Adjustment: ${adjustmentSelections[item.key]}`;
      });

    setFormData(prev => ({
      ...prev,
      adjustments: adjustmentLines.join("\n")
    }));
  }, [
    leaveClasses,
    adjustmentSelections,
    currentTeacherTimetable,
    formData.leaveFrom,
    formData.leaveTo
  ]);

  /* ================= HANDLE CHANGE ================= */

  const handleChange = e => {
    const { name, value } = e.target;

    if (name === "leaveType") {
      setFormData(prev => ({
        ...prev,
        leaveType: value,
        dayType: "",
        halfType: ""
      }));

      return;
    }

    if (name === "dayType") {
      setFormData(prev => ({
        ...prev,
        dayType: value,
        halfType: ""
      }));

      return;
    }

    if (name === "leaveFrom" || name === "leaveTo") {
      setAdjustmentSelections({});

      setFormData(prev => ({
        ...prev,
        [name]: value,
        adjustments: ""
      }));

      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /* ================= ADJUSTMENT SELECT ================= */

  const handleAdjustmentChange = (classKey, teacherName) => {
    setAdjustmentSelections(prev => ({
      ...prev,
      [classKey]: teacherName
    }));
  };

  /* ================= SUBMIT ================= */

  const submit = async () => {
    const nextErrors = {};

    if (!formData.leaveFrom || !formData.leaveTo) {
      nextErrors.date = "Both dates are required";
    }

    if (
      formData.leaveFrom &&
      formData.leaveTo &&
      new Date(formData.leaveTo) < new Date(formData.leaveFrom)
    ) {
      nextErrors.date = "Invalid date range";
    }

    if (!formData.reason.trim()) {
      nextErrors.reason = "Reason required";
    }

    if (!formData.leaveType) {
      nextErrors.leaveType = "Select leave type";
    }

    if (
      formData.leaveType === "Other" &&
      !formData.otherLeaveType.trim()
    ) {
      nextErrors.otherLeaveType = "Specify leave type";
    }

    /*
      Adjustment is required only when the teacher actually has
      classes during the selected leave period.
    */

    if (
      leaveClasses.length > 0 &&
      leaveClasses.some(item => !adjustmentSelections[item.key])
    ) {
      nextErrors.adjustments =
        "Please select an available teacher for every class adjustment.";
    }

    setErrors(nextErrors);
    setMessage("");

    if (Object.keys(nextErrors).length) {
      return;
    }

    try {
      setLoading(true);

      const finalAdjustmentText =
        leaveClasses.length === 0
          ? "No classes scheduled during selected leave period."
          : leaveClasses
              .map(item => {
                const selectedTeacher =
                  adjustmentSelections[item.key];

                return `${item.displayDate} (${item.dayName}) | ${item.timeSlot} | ${item.className} | Adjustment: ${selectedTeacher}`;
              })
              .join("\n");

      const submitData = {
        ...formData,
        adjustments: finalAdjustmentText,
        userEmail: email,
        status: "Pending"
      };

      const result = await apiRequest("/api/leaves", {
        method: "POST",
        body: JSON.stringify(submitData)
      });

      const immediateLeave = {
        ...result,
        userEmail:
          result?.userEmail ||
          result?.email ||
          result?.user ||
          email,
        days:
          result?.days ||
          calculateDays(
            result?.leaveFrom,
            result?.leaveTo
          )
      };

      setHistory(prev => [immediateLeave, ...prev]);

      setMessage("Leave submitted successfully.");

      setFormData(blankForm());
      setAdjustmentSelections({});
      setErrors({});
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= HISTORY COUNT ================= */

  const totalVisible = useMemo(
    () => history.length,
    [history]
  );

  /* ================= UI ================= */

  return (
    <Paper
      sx={{
        p: { xs: 2, md: 3 }
      }}
      elevation={2}
    >
      <Typography
        variant="h5"
        fontWeight={700}
        gutterBottom
      >
        Apply Leave
      </Typography>

      {message && (
        <Alert
          severity={
            message === "Leave submitted successfully."
              ? "success"
              : "error"
          }
          sx={{ mb: 2 }}
        >
          {message}
        </Alert>
      )}

      <TextField
        disabled
        fullWidth
        margin="normal"
        label="Name"
        value={formData.name || ""}
      />

      <TextField
        disabled
        fullWidth
        margin="normal"
        label="Designation"
        value={formData.designation || ""}
      />

      <TextField
        type="date"
        name="leaveFrom"
        label="Leave From"
        value={formData.leaveFrom}
        onChange={handleChange}
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
        error={!!errors.date}
      />

      <TextField
        type="date"
        name="leaveTo"
        label="Leave To"
        value={formData.leaveTo}
        onChange={handleChange}
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
        error={!!errors.date}
        helperText={errors.date || ""}
      />

      {/* ================= TIMETABLE STATUS ================= */}

      {formData.leaveFrom &&
        formData.leaveTo &&
        !currentTeacherTimetable && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Your name was not found in the department timetable.
            Please contact the HOD to add your timetable before
            using automatic class adjustment.
          </Alert>
        )}

      {currentTeacherTimetable &&
        formData.leaveFrom &&
        formData.leaveTo && (
          <Paper
            variant="outlined"
            sx={{
              mt: 2,
              p: 2,
              backgroundColor: "#f8fafc"
            }}
          >
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ mb: 1 }}
            >
              Classes During Leave Period
            </Typography>

            {leaveClasses.length === 0 ? (
              <Alert severity="info">
                No classes are scheduled for you during
                the selected leave period.
              </Alert>
            ) : (
              <>
                <Typography
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Select a faculty member who is free at the
                  same time for each class.
                </Typography>

                {leaveClasses.map(item => (
                  <Paper
                    key={item.key}
                    variant="outlined"
                    sx={{
                      p: 2,
                      mb: 2
                    }}
                  >
                    <Typography
                      fontWeight={700}
                    >
                      {item.displayDate} ({item.dayName})
                    </Typography>

                    <Typography sx={{ mt: 0.5 }}>
                      <b>Time:</b> {item.timeSlot}
                    </Typography>

                    <Typography>
                      <b>Class:</b> {item.className}
                    </Typography>

                    <Typography
                      sx={{
                        mt: 1,
                        mb: 1
                      }}
                    >
                      <b>Available faculty for adjustment:</b>
                    </Typography>

                    {item.availableTeachers.length === 0 ? (
                      <Alert severity="warning">
                        No free faculty member found for this
                        time slot.
                      </Alert>
                    ) : (
                      <TextField
                        select
                        fullWidth
                        label="Select adjustment teacher"
                        value={
                          adjustmentSelections[item.key] || ""
                        }
                        onChange={e =>
                          handleAdjustmentChange(
                            item.key,
                            e.target.value
                          )
                        }
                        error={
                          !!errors.adjustments &&
                          !adjustmentSelections[item.key]
                        }
                      >
                        <MenuItem value="">
                          Select Teacher
                        </MenuItem>

                        {item.availableTeachers.map(
                          teacher => (
                            <MenuItem
                              key={teacher}
                              value={teacher}
                            >
                              {teacher}
                            </MenuItem>
                          )
                        )}
                      </TextField>
                    )}
                  </Paper>
                ))}
              </>
            )}
          </Paper>
        )}

      <TextField
        name="reason"
        label="Reason"
        value={formData.reason}
        onChange={handleChange}
        fullWidth
        margin="normal"
        error={!!errors.reason}
        helperText={errors.reason || ""}
      />

      <TextField
        select
        name="leaveType"
        label="Leave Type"
        value={formData.leaveType}
        onChange={handleChange}
        fullWidth
        margin="normal"
        error={!!errors.leaveType}
        helperText={errors.leaveType || ""}
      >
        <MenuItem value="CL">
          Casual Leave
        </MenuItem>

        <MenuItem value="Medical">
          Medical Leave
        </MenuItem>

        <MenuItem value="EL">
          Earned Leave
        </MenuItem>

        <MenuItem value="Other">
          Other
        </MenuItem>
      </TextField>

      {formData.leaveType === "Other" && (
        <TextField
          name="otherLeaveType"
          label="Specify Leave Type"
          value={formData.otherLeaveType}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.otherLeaveType}
          helperText={
            errors.otherLeaveType || ""
          }
        />
      )}

      {formData.leaveType === "CL" && (
        <TextField
          select
          name="dayType"
          label="Day Type"
          value={formData.dayType}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          <MenuItem value="Full Day">
            Full Day
          </MenuItem>

          <MenuItem value="Half Day">
            Half Day
          </MenuItem>
        </TextField>
      )}

      {formData.dayType === "Half Day" && (
        <TextField
          select
          name="halfType"
          label="Half Type"
          value={formData.halfType}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          <MenuItem value="First Half">
            First Half
          </MenuItem>

          <MenuItem value="Second Half">
            Second Half
          </MenuItem>
        </TextField>
      )}

      {/* ================= ADJUSTMENT SUMMARY ================= */}

      <TextField
        name="adjustments"
        label="Adjustment Summary"
        value={formData.adjustments}
        fullWidth
        margin="normal"
        multiline
        minRows={3}
        InputProps={{
          readOnly: true
        }}
        error={!!errors.adjustments}
        helperText={
          errors.adjustments ||
          "Adjustment is generated automatically from the timetable."
        }
      />

      <Button
        variant="contained"
        fullWidth
        onClick={submit}
        disabled={loading}
        sx={{ mt: 1 }}
      >
        {loading ? "Submitting..." : "Submit"}
      </Button>

      {/* ================= LEAVE HISTORY ================= */}

      <Typography
        variant="h6"
        sx={{ mt: 4, mb: 1 }}
      >
        Leave History ({totalVisible})
      </Typography>

      {historyLoading ? (
        <Typography color="text.secondary">
          Loading history...
        </Typography>
      ) : (
        <div className="table-wrap">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>From</TableCell>
                <TableCell>To</TableCell>
                <TableCell>Days</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {history.map(leave => (
                <TableRow key={leave._id}>
                  <TableCell>
                    {formatDate(leave.leaveFrom)}
                  </TableCell>

                  <TableCell>
                    {formatDate(leave.leaveTo)}
                  </TableCell>

                  <TableCell>
                    {leave.days ||
                      calculateDays(
                        leave.leaveFrom,
                        leave.leaveTo
                      )}
                  </TableCell>

                  <TableCell>
                    {leave.leaveType === "Other"
                      ? leave.otherLeaveType || "Other"
                      : leave.leaveType}
                  </TableCell>

                  <TableCell>
                    {leave.reason}
                  </TableCell>

                  <TableCell
                    className={`status-${String(
                      leave.status || ""
                    ).toLowerCase()}`}
                  >
                    {leave.status}
                  </TableCell>
                </TableRow>
              ))}

              {history.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    align="center"
                  >
                    No leave history available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </Paper>
  );
}