import React, { useState,useEffect } from 'react';
import './TrainerDiet.css';
import { Link } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search'; 
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import luffy from '../../images/person.png'
import TrainerExercise from './TrainerExercise';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';



function TrainerDiet() {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dietDetails, setDietDetails] = useState({
    protein: '',
    fats: '',
    vitamins: '',
    carbohydrates: '',
    suggestions: ''
  });
  const [users, setUsers] = useState([]);
  const [selectedTab, setSelectedTab] = useState('tdiet');

  useEffect(() => {
    // Fetch user data from PHP endpoint
    fetch('http://localhost/app-dev/trainerdiet.php',{
      method:"GET",
      credentials:"include"
    })
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

  const handleChange = (e) => {
    setDietDetails({
      ...dietDetails,
      [e.target.name]: e.target.value
    });
  };

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };
  return (
    <div className="trainer-app">
      <Link to="/trainerdashboard" style={{position:"absolute",top:20,left:15}}>
          <ChevronLeftIcon style={{ fontSize: 30, color: 'white' }} />
      </Link>
      <div className="trainer-sidebar"> 
    <div 
        className={`sidebar-item ${selectedTab === 'tdiet' ? 'active' : ''}`} 
        onClick={() => handleTabClick('tdiet')}
    >
        <RestaurantIcon style={{fontSize:25}}/>
    </div>
    <div 
        className={`sidebar-item ${selectedTab === 'texer' ? 'active' : ''}`} 
        onClick={() => handleTabClick('texer')}
    >
        <FitnessCenterIcon style={{fontSize:25}}/>
    </div>
      </div>

      
        {selectedTab === "texer" && <TrainerExercise />}
        {selectedTab === "tdiet" && 
        <main className="trainer-main-content"> 
          <h3 className="trainer-title">Trainer's Diet Suggestions</h3>
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
                  <div style={{display:"flex",gap:20}}>
                    <p className="user-age">Height : <span style={{fontWeight:"bold"}}>{user.height}</span></p>
                    <p className="fitness-level">BMI : <span style={{fontWeight:"bold"}}>{user.bmi}</span></p>
                  </div>
                  <p className="fitness-level" style={{fontSize:16}}>Weight : <span style={{fontWeight:"bold"}}>{user.weight}</span></p>
              </div>
              </div></div>              
              <button className="suggest-button" onClick={() => togglePopup(user)}>
                Suggest Diet
              </button>
            </div>
          ))}
        </div>
          </main>
        }
      
      {isPopupVisible && (
          <div className={`tpopup-container ${isPopupVisible ? 'show' : 'hide'}`}>
            <div className="tpopup-content">
              <button className="tclose-button" onClick={() => setIsPopupVisible(false)}>
                <CloseIcon style={{color:"red"}}/>
              </button>
              <h3 style={{fontSize:23,marginBottom:30}}>Diet Suggestions for {currentUser?.name}</h3>
              <form action='http://localhost/app-dev/trainerdiet.php' method='post'>
                <input type="text" name='username' value={currentUser.name} style={{display:'none'}}/>
                <div className="dropdown-group">
                  <label htmlFor="">Protein :</label>
                  <input type="number" name='protein'/>
                </div>
                <div className="dropdown-group">
                  <label htmlFor="">Vitamins :</label>
                  <input type="number" name='vitamins'/>
                </div>
                <div className="dropdown-group">
                  <label htmlFor="">Carbohydrates :</label>
                  <input type="number" name='carbo'/>
                </div>
                <div className="dropdown-group">
                  <label htmlFor="">Fats :</label>
                  <input type="number" name='fats'/>
                </div>
                <textarea
                  name="suggestions"
                  placeholder="Additional diet suggestions..."
                  value={dietDetails.suggestions}
                  onChange={handleChange}
                  required
                />
                <button type="submit" name='suggest' className="submit-button">Submit Suggestion</button>
              </form>
            </div>
          </div>
        )}
    </div>
  );
}

export default TrainerDiet;
