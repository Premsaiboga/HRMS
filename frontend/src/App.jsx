import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Leaves from './pages/Leaves';
import Attendance from './pages/Attendance';
import Payroll from './pages/Payroll';
import Reports from './pages/Reports';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';
import EmployeeDetails from './pages/EmployeeDetails';
import axiosClient from './api/axiosClient';

const App = () => {
  // 🔁 Silent token refresh logic (runs every 4 minutes)
  useEffect(() => {
    const refreshTokenInterval = setInterval(async () => {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axiosClient.post('users/token/refresh/', {
            refresh: refreshToken
          });
          localStorage.setItem('access_token', response.data.access);
        } catch (error) {
          // If refresh fails, clear tokens and redirect to login
          localStorage.clear();
          window.location.href = '/login';
        }
      }
    }, 4 * 60 * 1000); // 4 minutes

    return () => clearInterval(refreshTokenInterval);
  }, []);

  return(
  <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/employees" element={<ProtectedRoute><Employees /></ProtectedRoute>} />
      <Route path="/employees/:id" element={<ProtectedRoute><EmployeeDetails/></ProtectedRoute>}/>
      <Route path="/leaves" element={<ProtectedRoute><Leaves /></ProtectedRoute>} />
      <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
      <Route path="/payroll" element={<ProtectedRoute><Payroll /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
    </Routes>
    <Footer/>
  </Router>
);
}
export default App;
