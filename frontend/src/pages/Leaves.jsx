import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';

const Leaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    reason: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const userRole = localStorage.getItem('user_role');

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const response = await axiosClient.get('leaves/');
      setLeaves(response.data);
    } catch {
      setError('Failed to load leave requests.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!formData.start_date || !formData.end_date || !formData.reason) {
      setError('Please fill all fields.');
      return;
    }
    try {
      await axiosClient.post('leaves/', formData);
      setSuccess('Leave request submitted.');
      setFormData({ start_date: '', end_date: '', reason: '' });
      fetchLeaves();
    } catch (err) {
      setError('Failed to submit leave request.');
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axiosClient.patch(`leaves/${id}/`, { status: newStatus ,credentials:"include"});
      fetchLeaves();
    } catch (err) {
      setError('Failed to update leave status.');
    }
  };

  return (
    <div className="container mt-4">
      <h3>Leave Requests</h3>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Employee Leave Apply Form */}
      {userRole === 'employee' && (
        <form
          onSubmit={handleSubmit}
          className="mb-4 p-3 border rounded card-custom bg-white"
        >
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">End Date</label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Reason</label>
              <input
                type="text"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className="form-control"
                placeholder="Reason for leave"
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary mt-3">
            Submit Leave Request
          </button>
        </form>
      )}

      {/* Leave Table */}
      <h5>{userRole === 'hr' ? 'All Leave Requests' : 'Your Leave Requests'}</h5>
      <table className="table table-striped">
        <thead>
          <tr>
            {userRole === 'hr' && <th>Employee ID</th>}
            {userRole === 'hr' && <th>Name</th>}
            <th>Period</th>
            <th>Reason</th>
            <th>Status</th>
            {userRole === 'hr' && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {leaves.map((leave) => (
            <tr key={leave.id}>
              {userRole === 'hr' && <td>{leave.employee?.id}</td>}
              {userRole === 'hr' && (
                <td>{leave.employee?.user?.username || 'N/A'}</td>
              )}
              <td>
                {leave.start_date} to {leave.end_date}
              </td>
              <td>{leave.reason}</td>
              <td>
                <span
                  className={`badge ${
                    leave.status === 'pending'
                      ? 'bg-warning'
                      : leave.status === 'approved'
                      ? 'bg-success'
                      : 'bg-danger'
                  }`}
                >
                  {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                </span>
              </td>

              {userRole === 'hr' && (
                <td>
                  {leave.status === 'pending' ? (
                    <>
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => handleStatusUpdate(leave.id, 'approved')}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleStatusUpdate(leave.id, 'rejected')}
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <small className="text-muted">Processed</small>
                  )}
                </td>
              )}
            </tr>
          ))}
          {leaves.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center">
                No leave requests found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Leaves;
