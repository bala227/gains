import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useNavigate, Link } from 'react-router-dom';
import './TrainerDashboard.css';

// Register the components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TrainerDashboard = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const attendanceData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Client Attendance',
        data: [10, 12, 8, 11, 14, 15, 10],
        borderColor: '#ff9800',
        fill: false,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: '#e0e0e0' },
      },
      x: {
        ticks: { color: '#e0e0e0' },
      },
    },
    plugins: {
      legend: {
        labels: { color: '#e0e0e0' },
      },
    },
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuClick = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
    setIsMenuOpen(false);
  };

  const confirmLogout = () => {
    navigate('/');
  };

  const cancelLogout = () => {
    setIsLogoutModalOpen(false);
  };

  return (
    <div className="tdashboard-container">
      <div className="hamburger-menu">
        <div className={`menu-icon ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
          <div className="menu-bar"></div>
          <div className="menu-bar"></div>
          <div className="menu-bar"></div>
        </div>
        {isMenuOpen && (
          <div className="menu-content">
            <ul>
              <li onClick={() => handleMenuClick('/trainer-dashboard')}>Home</li>
              <li onClick={() => handleMenuClick('/trainer-profile')}>Profile</li>
              <li onClick={handleLogoutClick}>Logout</li>
            </ul>
          </div>
        )}
        <h1 className="dashboard-header">Trainer's <span style={{color:"#FF4742"}}>Dashboard</span></h1>
        <p></p>
      </div>

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <h2>Confirm Logout</h2>
            <p>Are you sure you want to logout?</p>
            <div className="modal-buttons">
              <button className="modal-button confirm" onClick={confirmLogout}>
                Yes, Logout
              </button>
              <button className="modal-button cancel" onClick={cancelLogout}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-grid">
        <Link to="/trainerattendance" className="dashboard-card large">
          <h6>Client Attendance</h6>
          <Line data={attendanceData} options={options} />
        </Link>

        <div className="dashboard-card white-theme">
          <h6>Diet and Exercise <br />Management</h6>
          <ul className="dashboard-list white-theme">
            <li className="dashboard-list-item white-theme">Suggest a New Diet Plan</li>
            <li className="dashboard-list-item white-theme">Review Client Plans</li>
            <li className="dashboard-list-item white-theme">Suggest a Exercise routine</li>
          </ul>
          <Link to="/trainerdiet" id='dietlink' ><button className="dashboard-button white-theme" onClick={() => navigate('/diet-plans')}>
            Manage Plans
          </button></Link>
        </div>

        <Link to="/trainersession" className="dashboard-card">
          <h6>Upcoming Online Sessions</h6>
          <ul className="dashboard-list">
            {['Yoga Session - 10 AM', 'HIIT Session - 12 PM', 'Strength Training - 5 PM'].map((session, index) => (
              <li key={index} className="dashboard-list-item">{session}</li>
            ))}
          </ul>
        </Link>

        <Link to="/trainerfeedback" className="dashboard-card feed" style={{textDecoration:"none"}}>
          <h6>User Feedback</h6>
          <ul className="dashboard-list">
            {['Track Client Feedback', 'Manage Client Feedback'].map(
              (task, index) => (
                <li key={index} className="dashboard-list-item">{task}</li>
              )
            )}
          </ul>
        </Link>

        
      </div>
    </div>
  );
};

export default TrainerDashboard;
