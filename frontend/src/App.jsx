import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import StudentLayout from './layouts/StudentLayout';

// Public Pages
import Home from './pages/public/Home';
import LandingPage from './pages/public/LandingPage';
import About from './pages/public/About';
import Admission from './pages/public/Admission';
import Login from './pages/public/Login';
import OTPVerification from './pages/public/OTPVerification';
import ForgotPassword from './pages/public/ForgotPassword';
import ResetPassword from './pages/public/ResetPassword';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import Students from './pages/admin/Students';
import SeatManagement from './pages/admin/SeatManagement';
import Admissions from './pages/admin/Admissions';
import StudentDashboard from './pages/student/StudentDashboard';

// Components
import ProtectedRoute from './components/ProtectedRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function AppRoutes() {
  const { user, isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/admission" element={<Admission />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to={user?.role === 'admin' ? '/admin' : '/student'} /> : <Login />} />
        <Route path="/verify-otp" element={<OTPVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token?" element={<ResetPassword />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="seats" element={<SeatManagement />} />
        <Route path="admissions" element={<Admissions />} />
        <Route path="enquiries" element={<AdminDashboard />} />
        <Route path="seat-shifts" element={<SeatManagement />} />
        <Route path="fees" element={<AdminDashboard />} />
        <Route path="library-time" element={<AdminDashboard />} />
        <Route path="records" element={<AdminDashboard />} />
        <Route path="reports" element={<AdminDashboard />} />
        <Route path="id-cards" element={<AdminDashboard />} />
        <Route path="messages" element={<AdminDashboard />} />
        <Route path="settings" element={<AdminDashboard />} />
      </Route>

      {/* Student Routes */}
      <Route
        path="/student"
        element={
          <ProtectedRoute requiredRole="student">
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentDashboard />} />
        <Route path="seat" element={<StudentDashboard />} />
        <Route path="fees" element={<StudentDashboard />} />
        <Route path="documents" element={<StudentDashboard />} />
        <Route path="notifications" element={<StudentDashboard />} />
        <Route path="profile" element={<StudentDashboard />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <AppRoutes />
          </Router>
          <Toaster position="top-right" />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
