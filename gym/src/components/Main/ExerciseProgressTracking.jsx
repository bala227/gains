import React, { useState, useEffect } from 'react';
import './ExerciseProgressTracking.css';
import { Link } from 'react-router-dom';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const ExerciseProgressTracking = () => {
  const [progressData, setProgressData] = useState({
    shoulderlegs: [],
    chesttriceps: [],
    backbiceps: [],
  });

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const response = await fetch('http://localhost/app-dev/exercise.php', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Failed to fetch progress data:", errorText);
          return;
        }

        const data = await response.json();
        console.log(data);
        
        // Ensure the fetched data has the expected structure
        setProgressData({
          shoulderlegs: data.shoulderlegs || [],
          chesttriceps: data.chesttriceps || [],
          backbiceps: data.backbiceps || [],
        });
        
      } catch (error) {
        console.error("Error fetching progress data:", error);
      }
    };

    fetchProgressData();
  }, []);

  const [selectedTab, setSelectedTab] = useState('chesttriceps');

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  const renderExerciseList = (exercises) => {
    if (exercises.length === 0) {
      return <p className='norecord'>No record found</p>;
    }
    return (
      <div className="exercise-list">
        {exercises.map((item, index) => (
          <div key={index} className="exercise-item">
            <p className="exercise-name">{item.exercise}</p>
            <p className="exercise-details">{item.reps} Reps</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="exercise-container">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="sidebar exsidebar">
          <Link to="/dashboard1" className="exback">
            <ChevronLeftIcon style={{ fontSize: 30 }} />
          </Link>
          
          <div
            className={`sidebar-item es ${selectedTab === 'chesttriceps' ? 'active' : ''}`}
            onClick={() => handleTabClick('chesttriceps')}
          >
            Chest
          </div>
          <div
            className={`sidebar-item es ${selectedTab === 'backbiceps' ? 'active' : ''}`}
            onClick={() => handleTabClick('backbiceps')}
          >
            Back
          </div>
          <div
            className={`sidebar-item es ${selectedTab === 'shoulderlegs' ? 'active' : ''}`}
            onClick={() => handleTabClick('shoulderlegs')}
          >
            Shoulder
          </div>
        </div>

        {selectedTab === "shoulderlegs" && (
          <div className="exercise-section shoulders-legs">
            <h2 className="exercise-subtitle">Shoulders & Legs</h2>
            {renderExerciseList(progressData.shoulderlegs)}
          </div>
        )}

        {selectedTab === "chesttriceps" && (
          <div className="exercise-section chest-triceps">
            <h2 className="exercise-subtitle">Chest & Triceps</h2>
            {renderExerciseList(progressData.chesttriceps)}
          </div>
        )}

        {selectedTab === "backbiceps" && (
          <div className="exercise-section back-biceps">
            <h2 className="exercise-subtitle">Back & Biceps</h2>
            {renderExerciseList(progressData.backbiceps)}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseProgressTracking;
