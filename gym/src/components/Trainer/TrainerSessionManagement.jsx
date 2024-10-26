import React, { useState,useEffect } from 'react';
import './TrainerSessionManagement.css'; // Updated CSS for trainer's session management
import { FaClock, FaUsers } from 'react-icons/fa';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Link } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';


const TrainerSessionManagement = () => {
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [showPopup, setShowPopup] = useState(false);
  const [newSession, setNewSession] = useState({
    sessionTitle: '',
    userNames: [],
    date: selectedDate,
    time: '',
  });
  const [users,setusers] = useState([]);

  useEffect(()=>{
    fetch('http://localhost/app-dev/trainersession.php')
    .then((response)=>response.json())
    .then((data)=>setusers(data))
  },[]);

  const [initialSessions , setinitialSessions] = useState([]);

  useEffect(()=>{
    fetch('http://localhost/app-dev/tsession.php',{
      method:"GET"
    })
    .then((response)=>response.json())
    .then((data)=>setinitialSessions(data))
  },[]); 
  const [setSessions] = useState(initialSessions);

  const handleStartSession = (sessionId) => {
    console.log(`Session ${sessionId} started`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSession((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateSession = () => {
    if (newSession.sessionTitle && newSession.userNames.length > 0 && newSession.time) {
      setSessions((prevSessions) => [
        ...prevSessions,
        { ...newSession, id: prevSessions.length + 1, status: 'Upcoming' },
      ]);
      setShowPopup(false);
      setNewSession({ sessionTitle: '', userNames: [], date: selectedDate, time: '' });
    }
  };

  return (
    <div className="trainer-session-management">
      <Link to="/trainerDashboard" className="back-button">
        <ChevronLeftIcon style={{ fontSize: 30,color:"white" }} />
      </Link>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <h3 className="trainer-title">Trainer's <span style={{color:"#e74c3c"}}>Online Sessions</span></h3>
      </div>
      <div className="trainer-session-header">
        <h3>
          Sessions for <span style={{ color: '#e74c3c' }}>{selectedDate}</span>
        </h3>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        
        <p className="trainer-session-create-button" onClick={() => setShowPopup(true)}>
          Create Session
        </p>
      </div>

      {initialSessions.length > 0 ? (
        <div className="trainer-session-list">
          {initialSessions.map((session) => (
            <div>
              {session.date === selectedDate && (
              <div className="trainer-session-item">
              <div className="trainer-session-details">
                <div className="trainer-session-title">
                  <FaUsers /> <span>{session.title}</span>
                </div>
                <div className="trainer-session-users">
                  <strong>Participant:</strong> <span>{session.username}</span>
                </div>
                <div className="trainer-session-time">
                  <FaClock /> <span>{session.time}</span>
                  <FaClock /> <span>{session.date}</span>
                </div>
              </div>

              <form action='http://localhost/app-dev/trainersession.php' className="trainer-session-actions" method='post'>
                  <button
                    className="trainer-session-start-button"
                    onClick={() => handleStartSession(session.id)}
                  >
                    Start Session
                  </button>
                <input type="text" hidden name='title' value={session.title}/>  
                <input type="text" hidden name='date' value={session.date}/>  
                <input type="text" hidden name='username' value={session.username}/>  
                <button name='cancel' className="trainer-session-cancel-button">Cancel</button>
              </form>
            </div>
            )}
            </div>
          ))}
        </div>
      ) : (
        <p style={{marginLeft:200,color:"white"}}>No sessions for this day.</p>
      )}

      {showPopup && (
        <div className="trainer-session-popup">
          <form action='http://localhost/app-dev/trainersession.php' className="trainer-session-popup-content" method='post'>
            <div onClick={() => setShowPopup(false)}>
                <CloseIcon style={{color:"red",position:"absolute",right:15,top:15,cursor:"pointer"}}/>
            </div>
            <h4 className="trainer-session-popup-heading">Create Session</h4>
            <label>
              User:
              <select name='username' required onChange={(e) => setNewSession(prev => ({ ...prev, userNames: [e.target.value] }))}>
                <option value="">Select User</option>
                {users.map((user, index) => (
                  <option key={index} value={user.username}>{user.username}</option>
                ))}
              </select>
            </label>
            <label>
              Date:
              <input type="date" name="date" value={newSession.date} onChange={handleInputChange} required/>
            </label>
            <label>
              Time:
              <input type="text" name="time" placeholder="e.g. 3:00 PM - 4:00 PM" onChange={handleInputChange} required/>
            </label>
            <label>
              Session Title:
              <input type="text" name="title" onChange={handleInputChange} required/>
            </label>
            <div className="trainer-session-popup-buttons">
              <button name='session' onClick={handleCreateSession} style={{backgroundColor:"#2d9c2f"}}>Done</button>
              <button onClick={() => setShowPopup(false)} style={{backgroundColor:"#c0392b"}}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      <div className='trainer-handwriting'>
        <div className='handwriting-names'>
          {users.map((user) => (
            <p>{user.username}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrainerSessionManagement;
