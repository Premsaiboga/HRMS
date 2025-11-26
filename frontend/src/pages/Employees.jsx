import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    position: '',
    department: '',
    hire_date: '',
  });

  const userRole = localStorage.getItem('user_role');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('employees/');
      setEmployees(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post('employees/', formData);
      setShowAddForm(false);
      setFormData({
        username: '',
        email: '',
        password: '',
        position: '',
        department: '',
        hire_date: '',
      });
      fetchEmployees();
    } catch (err) {
      console.error(err);
      setError('Failed to add employee');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const filteredEmployees = employees.filter((emp) =>
    emp.user.username.toLowerCase().includes(search.toLowerCase()) ||
    emp.department.toLowerCase().includes(search.toLowerCase()) ||
    emp.position.toLowerCase().includes(search.toLowerCase())
  );

  const handleEmployeeClick = (id) => {
    navigate(`/employees/${id}`);
  };

  return (
    <div className="container mt-4">
      <h3>Employees</h3>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search by name, department, or position..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {userRole === 'hr' && (
          <button className="btn btn-primary ms-3" onClick={() => setShowAddForm(true)}>
            Add Employee
          </button>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <div>Loading employees...</div>}

      <div className="row">
        {filteredEmployees.map((emp) => (
          <div
            key={emp.id}
            className="col-md-4 mb-3"
            onClick={() => handleEmployeeClick(emp.id)}
            style={{ cursor: 'pointer' }}
          >
            <div className="card p-3 shadow-sm">
              <h5>{emp.user.username}</h5>
              <p><strong>Position:</strong> {emp.position}</p>
              <p><strong>Department:</strong> {emp.department}</p>
              <p><strong>Hired:</strong> {emp.hire_date}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Employee Modal */}
      {showAddForm && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          onClick={() => setShowAddForm(false)}
        >
          <div
            className="modal-dialog"
            role="document"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <form onSubmit={handleAddEmployee}>
                <div className="modal-header">
                  <h5 className="modal-title">Add Employee</h5>
                  <button type="button" className="btn-close" onClick={() => setShowAddForm(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input
                      type="text"
                      className="form-control"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Position</label>
                    <input
                      type="text"
                      className="form-control"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Department</label>
                    <input
                      type="text"
                      className="form-control"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Hire Date</label>
                    <input
                      type="date"
                      className="form-control"
                      name="hire_date"
                      value={formData.hire_date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add Employee
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

export default Employees;
