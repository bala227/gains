import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import './TrainerAttendance.css';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Link } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DangerousIcon from '@mui/icons-material/Dangerous';
import { Chart, CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend);

const TrainerAttendance = () => {
  const [users, setUsers] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendanceSummary, setAttendanceSummary] = useState({ total_attended: 0, total_absent: 0, total_users: 0 });
  const [markedAttendance, setMarkedAttendance] = useState({});

  // Fetch users and attendance summary from the backend
  const fetchAttendanceData = () => {
    fetch('http://localhost/app-dev/trainerattendance.php')
      .then((response) => response.json())
      .then((data) => {
        setUsers(data.users);
        setAttendanceData(data.attendance); // Set the fetched attendance data
        setAttendanceSummary(data.summary);
      })
      .catch((error) => console.error('Error fetching users:', error));
  };

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  // Handle attendance update
  const updateAttendance = (username, status) => {
    const date = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    fetch('http://localhost/app-dev/trainerattendance.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ username, status, date }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert(data.message);
          setMarkedAttendance((prev) => ({ ...prev, [username]: true }));
          fetchAttendanceData(); // Re-fetch data after updating attendance
        } else {
          alert('Failed to update attendance: ' + data.error);
        }
      })
      .catch((error) => console.error('Error updating attendance:', error));
  };

  // Prepare data for the bar chart
  const attendanceChartData = {
    labels: ['Total Users', 'Total Attended', 'Total Absent'],
    datasets: [
      {
        label: 'Attendance Overview',
        data: [
          attendanceSummary.total_users,
          attendanceSummary.total_attended,
          attendanceSummary.total_absent,
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)', // Total Users
          'rgba(54, 162, 235, 0.6)',  // Total Attended
          'rgba(255, 99, 132, 0.6)',   // Total Absent
        ],
      },
    ],
  };

  // Prepare data for the line chart
  const lineChartData = {
    labels: attendanceData.map((item) => item.date), // Dates from your attendance data
    datasets: [
      {
        label: 'Attendance Over Time',
        data: attendanceData.map((item) => item.count), // Attendance counts for those dates
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div className="tattendance">
      <Link to="/trainerdashboard" className="dietback">
        <ChevronLeftIcon style={{ fontSize: 30 }} />
      </Link>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <h2 className="tattendance-title">Client Attendance</h2>
      </div>
      <div className="attendtable">
        <div className="attendhead">
          <h2>Name</h2>
          <h2>Attended</h2>
        </div>
        <div className="atusers">
          {users.length === 0 ? (
            <p className='nousers'>Attendance given for all users.</p>
          ) : (
            users.map((user) => (
              <div className="userat" key={user.username}>
                <p>{user.username}</p>
                {!markedAttendance[user.username] && (
                  <div className="tickwrong">
                    <CheckCircleIcon
                      style={{ color: 'green', fontSize: 30, cursor: 'pointer' }}
                      onClick={() => updateAttendance(user.username, 'yes')}
                    />
                    <DangerousIcon
                      style={{ color: 'red', fontSize: 30, cursor: 'pointer' }}
                      onClick={() => updateAttendance(user.username, 'no')}
                    />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div className="employees-info">
          <h2>Users Availability</h2>
          <Bar data={attendanceChartData} options={{
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }} />
        </div>
        <div className="stats">
          <h2>Users Stats</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40, justifyContent: 'center' }}>
            <div className="stat-item">
              <h3>Total Attended</h3>
              <p>{attendanceSummary.total_attended}</p>
            </div>
            <div className="stat-item">
              <h3>Total Absent</h3>
              <p>{attendanceSummary.total_absent}</p>
            </div>
            <div className="stat-item">
              <h3>Total Users</h3>
              <p>{attendanceSummary.total_users}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="employees-info userline">
        <div>
          <h2>Attendance Trend Over Time</h2>
          <Line data={lineChartData} options={{
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }} />
        </div>
      </div>
    </div>
  );
};

export default TrainerAttendance;
