import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalLeaves: 0,
    totalAttendance: 0,
    totalPayroll: 0,
  });
  const [employeeOfMonth, setEmployeeOfMonth] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');
  const userRole = localStorage.getItem('user_role');

  useEffect(() => {
    if (userRole === 'hr' || userRole === 'admin') {
      fetchHRDashboardData();
    } else if (userRole === 'employee') {
      fetchEmployeeDashboardData();
    }
  }, [userRole]);

  // 🧾 For HR/Admin
  const fetchHRDashboardData = async () => {
    try {
      const [empRes, leaveRes, attRes, payRes, reportRes] = await Promise.all([
        axiosClient.get('employees/'),
        axiosClient.get('leaves/'),
        axiosClient.get('attendance/'),
        axiosClient.get('payroll/'),
        axiosClient.get('reports/attendance/'),
      ]);

      setStats({
        totalEmployees: empRes.data.length,
        totalLeaves: leaveRes.data.length,
        totalAttendance: attRes.data.length,
        totalPayroll: payRes.data.length,
      });

      if (reportRes.data && reportRes.data.length > 0) {
        const best = reportRes.data.reduce((max, emp) =>
          emp.total_present > max.total_present ? emp : max
        );
        setEmployeeOfMonth(best.employee?.user?.username || 'N/A');
      }

      setAnnouncements([
        { id: 1, title: '🎉 Annual Hackathon 2025', content: 'Team Alpha won the innovation challenge!' },
        { id: 2, title: '🏆 HR Excellence Award', content: 'Prem was recognized as Employee of the Month!' },
        { id: 3, title: '🌱 Sustainability Drive', content: 'We planted 500 trees across our offices.' },
      ]);

      setEvents([
        {
          id: 1,
          title: 'TechFest 2025',
          img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=60',
          caption: 'Our team rocking the annual TechFest!',
        },
        {
          id: 2,
          title: 'Employee Engagement Day',
          img: 'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=1200&q=60',
          caption: 'Fun, laughter, and teamwork all around!',
        },
        {
          id: 3,
          title: 'CSR Initiative',
          img: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=60',
          caption: 'Giving back to the community ❤️',
        },
      ]);
    } catch (err) {
      console.error(err);
      setError('Failed to load dashboard data.');
    }
  };

  // 👨‍💼 For Employees
  const fetchEmployeeDashboardData = async () => {
    try {
      const [attendanceRes, leaveRes] = await Promise.all([
        axiosClient.get('attendance/'),
        axiosClient.get('leaves/'),
      ]);

      setStats({
        totalAttendance: attendanceRes.data.length,
        totalLeaves: leaveRes.data.length,
      });

      setAnnouncements([
        { id: 1, title: '📅 Upcoming Holiday', content: 'Office will remain closed on Nov 14th for Children’s Day!' },
        { id: 2, title: '💡 Tip', content: 'Keep your attendance above 90% to qualify for Employee of the Month.' },
      ]);

      setEvents([
        {
          id: 1,
          title: 'Team Outing',
          img: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=1200&q=60',
          caption: 'Our recent team outing event!',
        },
        {
          id: 2,
          title: 'Workshop',
          img: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=60',
          caption: 'Skill development workshop highlights.',
        },
      ]);
    } catch (err) {
      console.error(err);
      setError('Failed to load your dashboard data.');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3 text-primary">Welcome to HRMS Dashboard</h2>
      {userRole === 'employee' ? (
        <p className="lead">Your personal summary and recent updates.</p>
      ) : (
        <p className="lead">Access and manage your HR resources effectively.</p>
      )}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* --- HR/Admin Dashboard --- */}
      {(userRole === 'hr' || userRole === 'admin') && (
        <>
          <div className="row text-center mt-4">
            <div className="col-md-3 mb-3">
              <div className="card p-3 shadow-sm border-0 bg-light">
                <h5>Total Employees</h5>
                <h3 className="text-primary">{stats.totalEmployees}</h3>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card p-3 shadow-sm border-0 bg-light">
                <h5>Total Leaves</h5>
                <h3 className="text-danger">{stats.totalLeaves}</h3>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card p-3 shadow-sm border-0 bg-light">
                <h5>Attendance Records</h5>
                <h3 className="text-success">{stats.totalAttendance}</h3>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card p-3 shadow-sm border-0 bg-light">
                <h5>Payroll Entries</h5>
                <h3 className="text-info">{stats.totalPayroll}</h3>
              </div>
            </div>
          </div>

          <div className="card mt-5 p-3 shadow-sm border-0">
            <h4 className="text-primary mb-3">🏆 Employee of the Month</h4>
            {employeeOfMonth ? (
              <div className="d-flex align-items-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  alt="Employee"
                  width="80"
                  height="80"
                  className="rounded-circle me-3"
                />
                <div>
                  <h5>{employeeOfMonth}</h5>
                  <p className="mb-0 text-muted">Recognized for outstanding performance!</p>
                </div>
              </div>
            ) : (
              <p className="text-muted">No data available.</p>
            )}
          </div>
        </>
      )}

      {/* --- Common Sections (Announcements + Events) --- */}
      <div className="card mt-5 p-3 shadow-sm border-0">
        <h4 className="text-primary mb-3">📢 Organization Updates</h4>
        {announcements.map((a) => (
          <div key={a.id} className="border-bottom mb-2 pb-2">
            <h6>{a.title}</h6>
            <p className="text-muted">{a.content}</p>
          </div>
        ))}
      </div>

      <div className="card mt-5 p-3 shadow-sm border-0">
        <h4 className="text-primary mb-3">🎉 Recent Events</h4>
        <Carousel fade interval={4000}>
          {events.map((event) => (
            <Carousel.Item key={event.id}>
              <img
                className="d-block w-100 rounded"
                src={event.img}
                alt={event.title}
                style={{ height: '400px', objectFit: 'cover' }}
              />
              <Carousel.Caption>
                <h5>{event.title}</h5>
                <p>{event.caption}</p>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default Dashboard;
