import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';

const Reports = () => {
  const [attendanceReports, setAttendanceReports] = useState([]);
  const [leaveReports, setLeaveReports] = useState([]);
  const [payrollReports, setPayrollReports] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setError('');
    try {
      const [attRes, leaveRes, payrollRes] = await Promise.all([
        axiosClient.get('reports/attendance/'),
        axiosClient.get('reports/leaves/'),
        axiosClient.get('reports/payroll/'),
      ]);
      setAttendanceReports(attRes.data);
      setLeaveReports(leaveRes.data);
      setPayrollReports(payrollRes.data);
    } catch {
      setError('Failed to load reports.');
    }
  };

  return (
    <div className="container mt-4">
      <h3>HR Analytics Reports</h3>
      {error && <div className="alert alert-danger">{error}</div>}

      <section className="mb-5">
        <h5>Attendance Summary</h5>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Month</th>
              <th>Present</th>
              <th>Absent</th>
              <th>Leave</th>
            </tr>
          </thead>
          <tbody>
            {attendanceReports.map(item => (
              <tr key={item.id}>
                <td>{item.employee?.user?.username || 'N/A'}</td>
                <td>{new Date(item.month).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</td>
                <td>{item.total_present}</td>
                <td>{item.total_absent}</td>
                <td>{item.total_leave}</td>
              </tr>
            ))}
            {attendanceReports.length === 0 && (
              <tr><td colSpan="5" className="text-center">No attendance data found.</td></tr>
            )}
          </tbody>
        </table>
      </section>

      <section className="mb-5">
        <h5>Leave Summary</h5>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Year</th>
              <th>Leaves Taken</th>
              <th>Leaves Approved</th>
              <th>Leaves Pending</th>
            </tr>
          </thead>
          <tbody>
            {leaveReports.map(item => (
              <tr key={item.id}>
                <td>{item.employee?.user?.username || 'N/A'}</td>
                <td>{item.year}</td>
                <td>{item.total_leaves_taken}</td>
                <td>{item.total_leaves_approved}</td>
                <td>{item.total_leaves_pending}</td>
              </tr>
            ))}
            {leaveReports.length === 0 && (
              <tr><td colSpan="5" className="text-center">No leave summary data found.</td></tr>
            )}
          </tbody>
        </table>
      </section>

      <section className="mb-5">
        <h5>Payroll Summary</h5>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Year</th>
              <th>Month</th>
              <th>Gross Pay</th>
              <th>Deductions</th>
              <th>Net Pay</th>
            </tr>
          </thead>
          <tbody>
            {payrollReports.map(item => (
              <tr key={item.id}>
                <td>{item.employee?.user?.username || 'N/A'}</td>
                <td>{item.year}</td>
                <td>{item.month}</td>
                <td>{item.gross_pay}</td>
                <td>{item.deductions}</td>
                <td>{item.net_pay}</td>
              </tr>
            ))}
            {payrollReports.length === 0 && (
              <tr><td colSpan="6" className="text-center">No payroll data found.</td></tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Reports;
