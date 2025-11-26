import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';

const Payroll = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    employee: '',
    month: '',
    base_salary: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const userRole = localStorage.getItem('user_role');

  useEffect(() => {
    fetchPayrolls();
    if (userRole === 'hr') fetchEmployees();
  }, []);

  const fetchPayrolls = async () => {
    try {
      const response = await axiosClient.get('payroll/');
      setPayrolls(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load payroll data.');
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axiosClient.get('employees/');
      setEmployees(response.data);
    } catch {
      setError('Failed to load employees.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!formData.employee || !formData.month || !formData.base_salary) {
      setError('Please fill all fields.');
      setLoading(false);
      return;
    }

    try {
      await axiosClient.post('payroll/', formData);
      setSuccess('Payroll generated successfully.');
      setFormData({ employee: '', month: '', base_salary: '' });
      fetchPayrolls();
    } catch (err) {
      console.error(err);
      setError('Failed to generate payroll.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Payroll Management</h3>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* HR Payroll Generation Form */}
      {userRole === 'hr' && (
        <form
          onSubmit={handleGenerate}
          className="mb-4 p-3 border rounded bg-white shadow-sm"
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
              <label className="form-label">Month</label>
              <input
                type="month"
                className="form-control"
                name="month"
                value={formData.month}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">Base Salary (₹)</label>
              <input
                type="number"
                className="form-control"
                name="base_salary"
                value={formData.base_salary}
                onChange={handleChange}
                required
                min="0"
              />
            </div>

            <div className="col-md-2">
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? 'Generating...' : 'Generate'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Payroll Records */}
      <h5 className="mt-4">
        {userRole === 'hr' ? 'All Payroll Records' : 'My Salary Slips'}
      </h5>

      <div className="table-responsive mt-3">
        <table className="table table-striped table-hover align-middle">
          <thead className="table-primary">
            <tr>
              <th>Employee</th>
              <th>Month</th>
              <th>Base Salary</th>
              <th>Present</th>
              <th>Leave</th>
              <th>Absent</th>
              <th>Net Salary</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {payrolls.length > 0 ? (
              payrolls.map((p) => (
                <tr key={p.id}>
                  <td>{p.employee?.user?.username || 'N/A'}</td>
                  <td>{p.month}</td>
                  <td>₹{p.base_salary}</td>
                  <td>{p.present_days}</td>
                  <td>{p.leave_days}</td>
                  <td>{p.absent_days}</td>
                  <td>
                    <strong>₹{p.net_salary}</strong>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        p.status === 'paid'
                          ? 'bg-success'
                          : p.status === 'processed'
                          ? 'bg-warning text-dark'
                          : 'bg-secondary'
                      }`}
                    >
                      {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center text-muted">
                  No payroll records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payroll;
