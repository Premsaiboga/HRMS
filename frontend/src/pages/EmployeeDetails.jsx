import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState({
    position: '',
    department: '',
    hire_date: '',
    status: '',
  });

  const userRole = localStorage.getItem('user_role');

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const fetchEmployee = async () => {
    try {
      const response = await axiosClient.get(`employees/${id}/`);
      setEmployee(response.data);
      setFormData({
        position: response.data.position || '',
        department: response.data.department || '',
        hire_date: response.data.hire_date || '',
        status: response.data.status || 'Active',
      });
    } catch (err) {
      setError('Failed to fetch employee details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.put(`employees/${id}/`, formData);
      setShowEditForm(false);
      fetchEmployee();
    } catch (err) {
      console.error(err);
      alert('Failed to update employee details.');
    }
  };

  if (loading) return <div className="container mt-5">Loading...</div>;
  if (error) return <div className="container mt-5 text-danger">{error}</div>;
  if (!employee) return <div className="container mt-5">No employee found</div>;

  return (
    <div className="container mt-5">
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="card p-4 shadow-sm">
        <h3>{employee.user.username}</h3>
        <p><strong>Email:</strong> {employee.user.email}</p>
        <p><strong>Position:</strong> {employee.position}</p>
        <p><strong>Department:</strong> {employee.department}</p>
        <p><strong>Hire Date:</strong> {employee.hire_date}</p>
        <p>
          <strong>Status:</strong>{' '}
          <span
            className={`badge ${
              employee.status === 'Active' ? 'bg-success' : 'bg-danger'
            }`}
          >
            {employee.status}
          </span>
        </p>

        {userRole === 'hr' && (
          <button
            className="btn btn-primary mt-3"
            onClick={() => setShowEditForm(true)}
          >
            Update Details
          </button>
        )}
      </div>

      {/* Update Employee Modal */}
      {showEditForm && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          onClick={() => setShowEditForm(false)}
        >
          <div
            className="modal-dialog"
            role="document"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <form onSubmit={handleUpdate}>
                <div className="modal-header">
                  <h5 className="modal-title">Update Employee Details</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowEditForm(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Position</label>
                    <input
                      type="text"
                      name="position"
                      className="form-control"
                      value={formData.position}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Department</label>
                    <input
                      type="text"
                      name="department"
                      className="form-control"
                      value={formData.department}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Hire Date</label>
                    <input
                      type="date"
                      name="hire_date"
                      className="form-control"
                      value={formData.hire_date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select
                      name="status"
                      className="form-select"
                      value={formData.status}
                      onChange={handleChange}
                      required
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowEditForm(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDetails;
