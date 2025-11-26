import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const Navbar = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('user_role');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-custom">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img src={logo} alt="HRMS Logo" width="150" />
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div id="navbarNav" className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            {userRole && (
              <>
                <li className="nav-item"><Link className="nav-link" to="/dashboard">Dashboard</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/employees">Employees</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/leaves">Leaves</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/payroll">Payroll</Link></li>
                {(userRole === 'hr' || userRole === 'admin') && (
                  <>
                    <li className="nav-item"><Link className="nav-link" to="/attendance">Attendance</Link></li>
                    <li className="nav-item"><Link className="nav-link" to="/reports">Reports</Link></li>
                  </>
                )}
              </>
            )}
          </ul>
          <ul className="navbar-nav ms-auto">
            {userRole ? (
              <li className="nav-item">
                <button className="btn btn-custom" onClick={handleLogout}>Logout</button>
              </li>
            ) : (
              <>
                <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/register">Register</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
