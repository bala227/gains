import React, { useState, useEffect } from 'react';
import './Attendance.css';
import { Link } from 'react-router-dom';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import enUS from 'date-fns/locale/en-US';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire } from '@fortawesome/free-solid-svg-icons';

// Locale configuration
const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Custom Toolbar
const CustomToolbar = () => {
  return (
    <div style={{ display: 'none' }}>
      {/* Custom toolbar can include custom content if needed */}
    </div>
  );
};

const Attendance = () => {
  const [events, setEvents] = useState([]);
  const [totalVisits, setTotalVisits] = useState(0);
  const [missedDays, setMissedDays] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [goalsMet, setGoalsMet] = useState(0);

  // Fetch attendance data from the backend
  const fetchAttendanceData = () => {
    fetch('http://localhost/app-dev/attendance.php', {
      method: "GET",
      credentials: "include"
    })
      .then((response) => response.json())
      .then((data) => {
        // Assuming data comes in the form [{ date: 'YYYY-MM-DD', attended: true }, ...]
        const attendanceData = data.map((item) => ({
          start: new Date(item.date),
          end: new Date(item.date),
          attended: item.attended,
        }));

        // Create a list of events including missed days
        const startDate = new Date(); // Start from today or a specific range
        startDate.setDate(1); // Start from the first day of the current month
        const endDate = new Date(); // End today

        const allEvents = [];
        let missedDaysCount = 0;

        for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
          const dateStr = format(d, 'yyyy-MM-dd');
          const attendanceEvent = attendanceData.find(event => format(event.start, 'yyyy-MM-dd') === dateStr);

          if (attendanceEvent) {
            allEvents.push(attendanceEvent);
          } else {
            // Missed day event
            allEvents.push({
              start: new Date(d),
              end: new Date(d),
              attended: false,
            });
            missedDaysCount++;
          }
        }

        setEvents(allEvents);
        setMissedDays(missedDaysCount);
        setTotalVisits(attendanceData.filter(event => event.attended).length);
        setGoalsMet(calculateGoalsMet(attendanceData.filter(event => event.attended).length, allEvents.length)); // Assuming goals are based on total visits

        // Calculate current streak
        const streak = calculateCurrentStreak(attendanceData);
        setCurrentStreak(streak);
      })
      .catch((error) => console.error('Error fetching attendance data:', error));
  };

  // Function to calculate current streak of consecutive days attended
  const calculateCurrentStreak = (attendanceData) => {
    let streak = 0;
    let lastDate = null;

    // Sort the attendance data by date
    attendanceData.sort((a, b) => a.start - b.start);

    for (const event of attendanceData) {
      if (event.attended) {
        if (!lastDate || event.start - lastDate === 86400000) { // 86400000 ms = 1 day
          streak++;
        } else if (event.start - lastDate > 86400000) {
          break; // Streak is broken, stop counting
        }
        lastDate = event.start;
      }
    }
    return streak;
  };

  // Function to calculate goals met percentage
  const calculateGoalsMet = (attendedCount, totalCount) => {
    return totalCount > 0 ? Math.round((attendedCount / totalCount) * 100) : 0;
  };

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const customEventPropGetter = () => ({
    style: { backgroundColor: 'transparent', color: 'red', fontSize: '24px', textAlign: 'center' },
  });

  const CustomEvent = ({ event }) => {
    return (
      <span className="gym-day-indicator">
        {event.attended ? (
          <CheckCircleIcon style={{ color: 'green', fontSize: '24px' }} />
        ) : (
          <CancelIcon style={{ color: 'red', fontSize: '24px' }} />
        )}
      </span>
    );
  };

  return (
    <div className="attendance">
      <Link to="/dashboard1">
        <ChevronLeftIcon style={{ fontSize: 30, color: "white", backgroundColor: "black", borderRadius: 20, position: "absolute", top: 20, left: 15 }} />
      </Link>
      <div className="amain-chart">
        <div className="acalendar-container">
          <h3 className='attendtitle'>Attendance</h3>
          <div className='acalendar'>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 400, width: 510, backgroundColor: "#f9f9f9", borderBottomLeftRadius: 50, borderBottomRightRadius: 50, padding: 20 }}
              eventPropGetter={customEventPropGetter}
              components={{
                event: CustomEvent,
                toolbar: CustomToolbar,
              }}
            />
          </div>
        </div>
      </div>
      <div className="aside-info">
        <div className="ainfo-card">
          <p id='info-p'>Total Gym Visits</p>
          <h3 id='info-h'>{totalVisits}</h3>
        </div>
        <div className="ainfo-card">
          <p id='info-p'>Days Missed</p>
          <h3 id='info-h'>{missedDays}</h3>
        </div>
        <div className="ainfo-card">
          <p id='info-p'>Current Streak</p>
          <h3 id='info-h'>{currentStreak} Days <FontAwesomeIcon icon={faFire} style={{ color: "#FF4742", fontSize: 25 }} /></h3>
        </div>
        <div className="ainfo-card">
          <p id='info-p'>Goals Met</p>
          <h3 id='info-h'>{goalsMet}%</h3>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
