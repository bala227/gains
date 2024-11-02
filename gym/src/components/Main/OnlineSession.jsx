import React, { useState,useEffect } from 'react';
import './OnlineSession.css'; // Updated CSS
import { FaUserCircle, FaClock } from 'react-icons/fa';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Link } from 'react-router-dom';

const OnlineSession = () => {
    
  const [sessions , setsessions] = useState([]);

  useEffect(()=>{
    fetch('http://localhost/app-dev/session.php',{
      method:"GET",
      credentials:"include"
    })
    .then((response)=>response.json())
    .then((data)=>setsessions(data))
  },[]); 
      
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10)); // Default: today's date

  const handleRescheduleSession = (sessionId) => {
    // Logic for rescheduling the session
    console.log(`Session ${sessionId} rescheduled`);
  };

  return (
    <div className="online-session">
      <Link to="/dashboard1" className="dietback"><ChevronLeftIcon style={{ fontSize: 30 }} /></Link>
      <div style={{display:'flex',justifyContent:"center"}}><h3 className='online-title'>Online Sessions</h3></div>
      <div className="header">
        <h3>Your Sessions for <span style={{color:"#e74c3c"}}>{selectedDate}</span></h3>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {sessions.length > 0 ? (
        <div className="session-list">
          {sessions.map((session) => (
            <div>
              {session.date === selectedDate && (
                <div className="session-item">
                <div className="session-details">
                  <div className="session-trainer">
                    <FaUserCircle /> Title: {session.title}
                  </div>
                  <div className="session-time">
                    <FaClock /> {session.time}
                  </div>
                </div>
                <div className="session-actions">                  
                      <button
                        className="reschedule-button"
                        onClick={() => handleRescheduleSession(session.id)}
                      >
                        <a href={`https://meet.google.com/${session.meeting_link}`} target="_blank" rel="noopener noreferrer" className='reschedule-button'>
                        Join Session
                      </a>
                      </button>
                </div>
              </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p style={{color:"white"}}>No sessions for this day.</p>
      )}
    </div>
  );
};

export default OnlineSession;
