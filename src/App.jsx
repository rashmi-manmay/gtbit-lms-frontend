import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import LeaveRequestForm from "./pages/LeaveRequestForm.jsx";
import HODDashboard from "./pages/HODDashboard.jsx";
import HomePage from "./pages/HomePage.jsx";
import Layout from "./components/Layout.jsx";
import { getCurrentUser } from "./api.js";
import ResetPassword from "./pages/ResetPassword";


function ProtectedRoute({ children, roles }) {
  const user = getCurrentUser();

  if (!user.email || !user.token) {
    return <Navigate to="/" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return (
      <Navigate
        to={user.role === "hod" ? "/hod" : "/home"}
        replace
      />
    );
  }

  return children;
}

/* ================= FIRST PAGE ================= */

function StartPage() {
  const navigate = useNavigate();

  const loginAs = (role) => {
    navigate("/login", {
      state: { selectedRole: role }
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        background: "#f4f6f8"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          background: "white",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
          textAlign: "center"
        }}
      >
        <h1
          style={{
            marginBottom: "10px",
            color: "#1f2937"
          }}
        >
          GTBIT IT Leave Management System
        </h1>

        <p
          style={{
            color: "#6b7280",
            marginBottom: "35px",
            fontSize: "18px"
          }}
        >
          Select how you want to login
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "20px"
          }}
        >
          <button
            onClick={() => loginAs("admin")}
            style={buttonStyle}
          >
            <div style={iconStyle}>👤</div>
            <div style={titleStyle}>Admin</div>
            <div style={subtitleStyle}>Login as Admin</div>
          </button>

          <button
            onClick={() => loginAs("hod")}
            style={buttonStyle}
          >
            <div style={iconStyle}>🏫</div>
            <div style={titleStyle}>HOD</div>
            <div style={subtitleStyle}>Head of Department</div>
          </button>

          <button
            onClick={() => loginAs("teacher")}
            style={buttonStyle}
          >
            <div style={iconStyle}>👨‍🏫</div>
            <div style={titleStyle}>Teacher</div>
            <div style={subtitleStyle}>Teacher Login</div>
          </button>

          <button
            onClick={() => loginAs("labassistant")}
            style={buttonStyle}
          >
            <div style={iconStyle}>🧪</div>
            <div style={titleStyle}>Lab Staff</div>
            <div style={subtitleStyle}>Lab Assistant Login</div>
          </button>
        </div>
      </div>
    </div>
  );
}

const buttonStyle = {
  border: "1px solid #d1d5db",
  background: "white",
  borderRadius: "12px",
  padding: "25px 15px",
  cursor: "pointer",
  transition: "0.2s",
  minHeight: "170px"
};

const iconStyle = {
  fontSize: "42px",
  marginBottom: "10px"
};

const titleStyle = {
  fontSize: "21px",
  fontWeight: "700",
  color: "#1f2937"
};

const subtitleStyle = {
  fontSize: "14px",
  color: "#6b7280",
  marginTop: "6px"
};

/* ================= APP ================= */

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [userKey, setUserKey] = useState(0);

  useEffect(() => {
    setUserKey(k => k + 1);
  }, [location.pathname]);

  return (
    <div className="page-shell" key={userKey}>
      <Routes>
        {/* FIRST PAGE */}
        <Route
          path="/"
          element={
            getCurrentUser().email ? (
              <Navigate to="/home" replace />
            ) : (
              <StartPage />
            )
          }
        />

        <Route
          path="/login"
          element={
            <LoginPage
              onLoggedIn={() => navigate("/home")}
            />
          }
        />

        <Route path="/signup" element={<SignupPage />} />
	<Route path="/reset-password" element={<ResetPassword />} />

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/home" element={<HomePage />} />

          <Route
            path="/apply-leave"
            element={<LeaveRequestForm />}
          />

          <Route
            path="/hod"
            element={
              <ProtectedRoute roles={["hod"]}>
                <HODDashboard />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </div>
  );
}

export default App;