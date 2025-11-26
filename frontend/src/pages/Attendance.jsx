import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';

const Attendance = () => {
  const [attendances, setAttendances] = useState([]);
  const [formData, setFormData] = useState({
    employee: '',
    date: '',
    status: 'present',
  });
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const userRole = localStorage.getItem('user_role');

  useEffect(() => {
    fetchAttendances();
    fetchEmployees();
  }, []);

  const fetchAttendances = async () => {
    try {
      const response = await axiosClient.get('attendance/');
      setAttendances(response.data);
    } catch {
      setError('Failed to load attendance records.');
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axiosClient.get('employees/');
      setEmployees(response.data);
    } catch {
      setError('Failed to load employees list.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!formData.employee || !formData.date) {
      setError('Please select employee and date.');
      return;
    }
    try {
      await axiosClient.post('attendance/', formData);
      setSuccess('Attendance marked successfully.');
      setFormData({ employee: '', date: '', status: 'present' });
      fetchAttendances();
    } catch (e) {
      setError('Failed to mark attendance.');
    }
  };

  return (
    <div className="container mt-4">
      <h3>Attendance Management</h3>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {userRole === 'hr' && (
        <form
          onSubmit={handleSubmit}
          className="mb-4 p-3 border rounded card-custom bg-white"
        >
          <div className="row g-3 align-items-end">
            <div className="col-md-4">
              <label className="form-label">Employee</label>
              <select
                className="form-select"
                name="employee"
                value={formData.employee}
                onChange={handleChange}
                required
              >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.user.username} - {emp.position}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-control"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="leave">Leave</option>
              </select>
            </div>
            <div className="col-md-2">
              <button type="submit" className="btn btn-primary w-100">
                Mark
              </button>
            </div>
          </div>
        </form>
      )}

      <h5>Recorded Attendance</h5>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Date</th>
              <th>Status</th>
              <th>Marked By</th>
            </tr>
          </thead>
          <tbody>
            {attendances.map((att) => (
              <tr key={att.id}>
                <td>{att.employee?.user?.username || 'N/A'}</td>
                <td>{att.date}</td>
                <td>
                  <span
                    className={`badge ${
                      att.status === 'present'
                        ? 'bg-success'
                        : att.status === 'absent'
                        ? 'bg-danger'
                        : 'bg-warning'
                    }`}
                  >
                    {att.status.charAt(0).toUpperCase() + att.status.slice(1)}
                  </span>
                </td>
                <td>{att.marked_by_hr || 'System'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {attendances.length === 0 && (
          <p className="text-muted">No attendance records found.</p>
        )}
      </div>
    </div>
  );
};

export default Attendance;
