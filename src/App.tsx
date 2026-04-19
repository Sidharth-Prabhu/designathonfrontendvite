import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import Students from './pages/admin/Students';
import Faculties from './pages/admin/Faculties';
import Classrooms from './pages/admin/Classrooms';
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import Classes from './pages/faculty/Classes';
import Attendance from './pages/faculty/Attendance';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentAttendance from './pages/student/StudentAttendance';
import DriverDashboard from './pages/driver/DriverDashboard';
import AdminBusTracker from './pages/admin/AdminBusTracker';
import AdminDrivers from './pages/admin/AdminDrivers';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role?.toUpperCase())) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route Component (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const { user } = useAuth();

  if (user.isAuthenticated) {
    const role = user.role?.toUpperCase();
    if (role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (role === 'FACULTY') return <Navigate to="/faculty/dashboard" replace />;
    if (role === 'STUDENT') return <Navigate to="/student/dashboard" replace />;
    if (role === 'DRIVER') return <Navigate to="/driver/dashboard" replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/bus-tracker"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminBusTracker />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/students"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <Students />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/faculties"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <Faculties />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/classrooms"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <Classrooms />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/drivers"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDrivers />
          </ProtectedRoute>
        }
      />

      {/* Faculty Routes */}
      <Route
        path="/faculty/dashboard"
        element={
          <ProtectedRoute allowedRoles={['FACULTY']}>
            <FacultyDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty/classes"
        element={
          <ProtectedRoute allowedRoles={['FACULTY']}>
            <Classes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty/attendance"
        element={
          <ProtectedRoute allowedRoles={['FACULTY']}>
            <Attendance />
          </ProtectedRoute>
        }
      />

      {/* Student Routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/attendance"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <StudentAttendance />
          </ProtectedRoute>
        }
      />

      {/* Driver Routes */}
      <Route
        path="/driver/dashboard"
        element={
          <ProtectedRoute allowedRoles={['DRIVER']}>
            <DriverDashboard />
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  React.useEffect(() => {
    if ("geolocation" in navigator) {
      // Trigger permission request early
      navigator.geolocation.getCurrentPosition(
        () => console.log("Location permission granted early"),
        () => console.log("Location permission denied early"),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
