import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    role: 'employee'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    if (formData.password !== formData.password2) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    try {
      await axiosClient.post('users/register/', formData);
      alert('Registration successful, please login');
      navigate('/login');
    } catch(err) {
      setError('Registration failed, please try again');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h3 className="mb-4">Register</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={onSubmit}>
        <input type="text" name="username" placeholder="Username" className="form-control mb-3" value={formData.username} onChange={onChange} required />
        <input type="email" name="email" placeholder="Email" className="form-control mb-3" value={formData.email} onChange={onChange} required />
        <select name="role" value={formData.role} onChange={onChange} className="form-select mb-3" required>
          <option value="employee">Employee</option>
          <option value="hr">HR</option>
          <option value="admin">Admin</option>
        </select>
        <input type="password" name="password" placeholder="Password" className="form-control mb-3" value={formData.password} onChange={onChange} required />
        <input type="password" name="password2" placeholder="Confirm Password" className="form-control mb-3" value={formData.password2} onChange={onChange} required />
        <button className="btn btn-custom w-100" type="submit">Register</button>
      </form>
      <p className="mt-3">Already have an account? <Link to="/login">Login here</Link></p>
    </div>
  );
};

export default Register;
