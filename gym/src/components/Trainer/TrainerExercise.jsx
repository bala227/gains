import React, { useState,useEffect } from 'react';
import './TrainerDiet.css';
import SearchIcon from '@mui/icons-material/Search'; 
import CloseIcon from '@mui/icons-material/Close';
import luffy from '../../images/person.png'


function TrainerExercise() {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);

  
  useEffect(() => {
    // Fetch user data from PHP endpoint
    fetch('http://localhost/app-dev/trainerdiet.php')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const togglePopup = (user) => {
    setCurrentUser(user);
    setIsPopupVisible(!isPopupVisible);
  };

 
  const [dietDetails, setDietDetails] = useState({
    suggestions: '',
    shoulderlegs: Array(3).fill({ exercise: '', reps: '' }),
    chesttriceps: Array(3).fill({ exercise: '', reps: '' }),
    backbiceps: Array(3).fill({ exercise: '', reps: '' }),
  });

  const handleChange = (e) => {
    const { name, value, dataset } = e.target;
    const index = dataset.index; // Get the index of the exercise being edited
    setDietDetails((prevDetails) => {
      const updatedExercises = [...prevDetails[name]];
      updatedExercises[index] = {
        ...updatedExercises[index],
        [dataset.field]: value, // Update the appropriate field (exercise or reps)
      };
      return { ...prevDetails, [name]: updatedExercises };
    });
  };
  const submitform = (e) => {
    e.preventDefault(); // Prevent page reload on form submission
  
    const payload = {
      username: currentUser.name, // Assuming currentUser holds the user's data
      shoulderlegs: dietDetails.shoulderlegs,
      chesttriceps: dietDetails.chesttriceps,
      backbiceps: dietDetails.backbiceps,
    };
  
    console.log("Sending data:", payload); // Check data before sending
  
    fetch('http://localhost/app-dev/trainerexercise.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); // Parse JSON from response
      })
      .then((data) => {
        console.log("Response from PHP:", data); // Check response from PHP
      })
      .catch((error) => {
        console.error("Error:", error); // Handle errors gracefully
      });
  };
  


  return (

      <main className="trainer-main-content">
        <h3 className="trainer-title">Trainer's Exercise Suggestions</h3>
        <div className="search-container">
          <input
            type="text"
            className="search-bar"
            placeholder="Search for users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SearchIcon className="search-icon" />
        </div>
        <div className="user-cards-container">
          {filteredUsers.map((user) => (
            <div key={user.id} className="user-card">
              <div style={{display:"flex",justifyContent:"center",gap:50}}>
              <img src={luffy} alt='' className='uimg'></img>
              <div>
              <h4>{user.name}</h4>
              <div className='trainer-user-details'>
                <div>
                  <p className="user-age">Age: {user.age}</p>
                  <p className="fitness-level">Level: {user.bmi}</p>
                </div>
                <div>
                  <p className="user-age">Age: {user.age}</p>
                  <p className="fitness-level">Level: {user.bmi}</p>
                </div>
              </div>
              </div></div>              
              <button className="suggest-button" onClick={() => togglePopup(user)}>
                Suggest Exercise
              </button>
            </div>
          ))}
        </div>
        {isPopupVisible && (
          <div className={`tpopup-container ${isPopupVisible ? 'show' : 'hide'}`}>
            <div className="tpopup-content epop">
              <button className="tclose-button" onClick={() => setIsPopupVisible(false)}>
                <CloseIcon style={{color:"red"}}/>
              </button>
              <h3 style={{fontSize:23,marginBottom:30}}>Workout Suggestions for {currentUser?.name}</h3>
      <form>
      <input type="text" name='username' value={currentUser.name} style={{ display: 'none' }} />
      
      <div className='exbox'>
        {/* Shoulder & Legs Exercises */}
      <div className="egroup">
        <label>Shoulder & Legs</label>
        {dietDetails.shoulderlegs.map((item, index) => (
          <div key={index} style={{ marginTop: 10,display:"flex" }} >
            <input
              type="text"
              name='shoulderlegs'
              placeholder={`Exercise ${index + 1}`}
              value={item.exercise}
              data-index={index}
              data-field="exercise"
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name='shoulderlegs'
              placeholder="Reps"
              value={item.reps}
              data-index={index}
              data-field="reps"
              onChange={handleChange}
              required
              style={{ marginLeft: 10,width:80 }}
            />
          </div>
        ))}
      </div>

      {/* Chest & Triceps Exercises */}
      <div className="egroup">
        <label>Chest & Triceps</label>
        {dietDetails.chesttriceps.map((item, index) => (
          <div key={index} style={{ marginTop: 10,display:"flex"  }}>
            <input
              type="text"
              name='chesttriceps'
              placeholder={`Exercise ${index + 1}`}
              value={item.exercise}
              data-index={index}
              data-field="exercise"
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name='chesttriceps'
              placeholder="Reps"
              value={item.reps}
              data-index={index}
              data-field="reps"
              onChange={handleChange}
              required
              style={{ marginLeft: 10,width:80 }}
            />
          </div>
        ))}
      </div>

      {/* Back & Biceps Exercises */}
      <div className="egroup">
        <label>Back & Biceps</label>
        {dietDetails.backbiceps.map((item, index) => (
          <div key={index} style={{ marginTop: 10,display:"flex"  }}>
            <input
              type="text"
              name='backbiceps'
              placeholder={`Exercise ${index + 1}`}
              value={item.exercise}
              data-index={index}
              data-field="exercise"
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name='backbiceps'
              placeholder="Reps"
              value={item.reps}
              data-index={index}
              data-field="reps"
              onChange={handleChange}
              required
              style={{ marginLeft: 10,width:80 }}
            />
          </div>
        ))}
      </div>
      </div>

      <textarea
        name="suggestions"
        placeholder="Enter workout suggestions..."
        value={dietDetails.suggestions}
        onChange={handleChange}
        className='etext'
      />
      <button type="submit" name='exer' className="submit-button exbutton" onClick={submitform}>Submit Suggestion</button>
    </form>
            </div>
          </div>
        )}
        
      </main>

  );
}

export default TrainerExercise;
