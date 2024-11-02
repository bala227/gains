import React, { useState,useEffect,useRef } from 'react';
import './Diet.css';
import HomeIcon from '@mui/icons-material/Home';
// import SearchIcon from '@mui/icons-material/Search';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faChartLine } from '@fortawesome/free-solid-svg-icons';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import SettingsVoiceIcon from '@mui/icons-material/SettingsVoice';
import BMI from './BMI.jsx'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { faGaugeHigh } from '@fortawesome/free-solid-svg-icons';
// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);


function Diet() {
  const [isPopupVisible, setIsPopupVisible] = useState(false); // State to manage popup visibility
  const [selectedTab, setSelectedTab] = useState('home');
  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible); // Toggle the popup visibility
  };
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  
  // Use a ref to store the recognition object
  const recognitionRef = useRef(null);
  const handlebot = ()=>{
    handleTabClick('bot');
    togglePopup();
  }
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
    } else if ('SpeechRecognition' in window) {
      recognitionRef.current = new window.SpeechRecognition();
    }

    if (recognitionRef.current) {
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }

        setInput(finalTranscript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error detected: ' + event.error);
        setIsListening(false);
      };
    }

    // Cleanup function to cancel speech synthesis
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return; // Prevent empty submissions
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: input, type: 'user' }
    ]);
    try {
      const response = await fetch('https://helixul.pythonanywhere.com/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await response.json();
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: data.response, type: 'bot' },
      ]);
      // Call the function to read out the bot's response
      speak(data.response);
    } catch (error) {
      console.error('Error:', error);
    }
    setInput('');
  };
  const handleSpeak = () => {
    const recognition = recognitionRef.current;
    if (recognition) {
      if (isListening) {
        recognition.stop();
        setIsListening(false);
      } else {
        setInput(''); // Clear the input before starting
        recognition.start();
        setIsListening(true);
      }
    } else {
      alert('Speech recognition not supported in this browser.');
    }
  };
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech synthesis
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    } else {
      console.error('Speech synthesis not supported in this browser.');
    }
  };
  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  const [proteins, setProteins] = useState([]); // Store fetched protein data
  const [error, setError] = useState(null); // Store any errors
  const [macros, setMacros] = useState({
    protein: 0,
    carbs: 0,
    fat: 0,
    vitamins: 0,
  });
  useEffect(() => {
    // Fetch data from the backend
    fetch('http://localhost/app-dev/diet.php', {
      method: 'GET',
      credentials: 'include', // Ensure cookies are sent with the request
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.error); // Handle authentication errors
        } else {
          setProteins(data);
          const item = data[0] || {}; // Fallback to empty object if no data

          const parsedData = {
            protein: parseFloat(item.protein) || 0,
            carbs: parseFloat(item.carbo) || 0, // Use 'carbo' key from backend
            fat: parseFloat(item.fats) || 0,    // Use 'fats' key from backend
            vitamins: parseFloat(item.vitamins) || 0,
          };

          setMacros(parsedData); // Store the proteins in state
        }
      })
      .catch((error) => {
        console.error('Error fetching the data:', error);
        setError('Failed to fetch data.');
      });
  }, []);

  const [weight,setWeight] = useState(null);

  useEffect(() => {
    fetch('http://localhost/app-dev/calorie.php', {
      method: 'GET',
      credentials: 'include',
    })
    .then((response) => response.json())
    .then((data) => {
      // Check if data is an array and has at least one element
      if (Array.isArray(data) && data.length > 0 && data[0].weight !== undefined) {
        setWeight(data[0].weight);
      } else {
        console.error("Unexpected response format or empty data:", data);
      }
    })
    .catch((error) => {
      console.error("Error fetching weight:", error);
    });
  }, []);
  

  const CaloriesChart = () => {
    const data = {
      labels: ['Protein', 'Carbs', 'Fat','Vitamins'],
      datasets: [
        {
          label: 'Calories Breakdown',
          data: [macros.protein, macros.carbs, macros.fat, macros.vitamins], // Calories values for Protein, Carbs, Fat
          backgroundColor: ['#3a98e5', '#ec6157', '#ffd700','#4caf50'],
          borderWidth: 0,
        },
      ],
    };
    const options = {
      plugins: {
        datalabels: {
          color: '#000', // Text color
          anchor: 'center',
          align: 'center',
          font: {
            size: 13,
            weight: 'bold',
          },
          formatter: (value) => value + 'g', // Format the labels to show the value and 'cal'
        },
      },
    };
    return <Pie data={data} options={options} />;
  };
  return (
    <div className="app">
      <div className="sidebar">
    <Link to="/dashboard1" className="dietback"><ChevronLeftIcon style={{ fontSize: 30 }} /></Link>
    <div 
        className={`sidebar-item ${selectedTab === 'home' ? 'active' : ''}`} 
        onClick={() => handleTabClick('home')}
    >
        <HomeIcon style={{ fontSize: 30 }} />
    </div>
    {/*<div 
        className={`sidebar-item ${selectedTab === 'analytics' ? 'active' : ''}`} 
        onClick={() => handleTabClick('analytics')}
    >
        <FontAwesomeIcon icon={faChartLine} />
    </div>
    <div 
        className={`sidebar-item ${selectedTab === 'search' ? 'active' : ''}`} 
        onClick={() => handleTabClick('search')}
    >
        <SearchIcon style={{ fontSize: 30 }} />
    </div>*/}
    <div 
        className={`sidebar-item ${selectedTab === 'settings' ? 'active' : ''}`} 
        onClick={() => handleTabClick('settings')}
    >
        <FontAwesomeIcon icon={faGaugeHigh} style={{ fontSize: 27 }} />
    </div>
    <div className="sidebar-item" onClick={handlebot}>
        <SmartToyIcon style={{ fontSize: 30 }} />
    </div>

  </div>
      {selectedTab === 'settings' && <BMI />}
      {((selectedTab === 'home') || (selectedTab === 'bot')) &&
      <main className="main-content">
        {weight != null ? (
          <div className='calorie'>
          <div className='calhead'>
            <div>
              <h3>Maintanence Calories</h3>
              <h3 style={{color:"yellow"}}>{weight*2.2*14}</h3>
            </div>
            <div>
              <h3>Bulk</h3>
              <h3 style={{color:"green"}}>{(weight*2.2*14)+500}</h3>
            </div>
            <div>
              <h3>Cut</h3>
              <h3 style={{color:"red"}}>{(weight*2.2*14)-500}</h3>
            </div>
          </div>
      </div>
        ):(<p className='errcal'>Calculate <span style={{color:"#d32f2f",fontWeight:'bold',fontSize:25}}>BMI</span> to see your Maintanence calories.</p>)}
        <div className="test">
          <h3 style={{ color: 'white', fontSize: 25, marginBottom: 20 }}>
            Analytics Overview
          </h3>
          <section className="progress-tracker-section">
              {error ? (
        <p style={{ color: 'red' }}>{error}</p> // Display error if any
      ) : proteins.length > 0 ? (
        <div className='progress-tracker'>
          {proteins.map((item) => (
        <div className='progress-tracker'>
            <div className="progress-card blue">
            <RestaurantIcon />
            <h3>Average<br/> Proteins</h3>
            <p>{item.protein} g</p>
            <div className="cs">
              <div
                style={{
                  display: 'flex',
                  gap: 60,
                  justifyContent: 'space-between',
                }}
              >
                <div>Soya</div>
                <div>Munk bean</div>
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: 30,
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ fontWeight: 'bold' }}>Egg</span>
                <span style={{ fontWeight: 'bold' }}>Chicken</span>
              </div>
            </div>
            </div>
            <div className="progress-card green">
          <RestaurantIcon />
          <h3>Average<br/> Vitamins</h3>
          <p>{item.vitamins} g</p>
          <div className="cs">
            <div
              style={{
                display: 'flex',
                gap: 60,
                justifyContent: 'space-between',
              }}
            >
              <div>Fruits</div>
              <div>Vegetables</div>
            </div>
            <div
              style={{
                display: 'flex',
                gap: 30,
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontWeight: 'bold' }}>Whole grains</span>
              <span style={{ fontWeight: 'bold' }}>Dairy</span>
            </div>
          </div>
            </div>
          <div className="progress-card red">
          <RestaurantIcon />
          <h3>Average<br/> Carbohydrates</h3>
          <p>{item.carbo} g</p>
          <div className="cs">
            <div
              style={{
                display: 'flex',
                gap: 70,
                justifyContent: 'space-between',
              }}
            >
              <div>Rice</div>
              <div>Chappathi</div>
            </div>
            <div
              style={{
                display: 'flex',
                gap: 30,
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontWeight: 'bold' }}>Oats</span>
              <span style={{ fontWeight: 'bold' }}>Fish</span>
            </div>
          </div>
        </div>
          <div className="progress-card yellow">
          <RestaurantIcon />
          <h3>Average<br/> Fats</h3>
          <p>{item.fats} g</p>
          <div className="cs">
            <div
              style={{
                display: 'flex',
                gap: 80,
                justifyContent: 'space-between',
              }}
            >
              <div>Nuts</div>
              <div>Avocado</div>
            </div>
            <div
              style={{
                display: 'flex',
                gap: 30,
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontWeight: 'bold' }}>Paneer</span>
              <span style={{ fontWeight: 'bold' }}>Cheese</span>
            </div>
          </div>
        </div>
        </div>
          ))}
        </div>
      ) : (
        <p style={{color:'red'}}>No protein data available.</p> // If no data is found
      )}
          </section>

          <div className="lowerdiet">
            <section className="calories-for-today-section">
              <div className="calories-for-today">
                <h3 style={{ color: 'white',fontSize:25 }}>Calories for Today</h3>
                <div className="calories-chart">
                  <CaloriesChart />
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      }
      {/* Popup section */}
      {isPopupVisible && selectedTab === 'bot' && (
        <div className={`popup-container ${isPopupVisible ? 'show' : 'hide'}`}>
          <div className="popup-content">
            <h3 style={{color:"white",textAlign:"center"}}>Health <span style={{color:"#FF4B2B"}}>Bot</span></h3>
            <button className="close_button" onClick={togglePopup}>
              <CloseIcon style={{color:"red",fontSize:30,fontWeight:"bold"}}/>
            </button>
            <div className='botcontainer'>
        <div className='bothome'>
          <div className='answer'>
            {messages.length === 0 ? (
              <div className='no-messages'>
                No messages
              </div>
            ) : (
              messages.map((msg, index) => (
                <pre key={index} className={msg.type} id='pre'>
                  {msg.text}
                </pre>
              ))
            )}
          </div>
          <form onSubmit={handleSubmit} className='prompt'>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <SendIcon onClick={handleSubmit} style={{cursor:"pointer",color:'white'}}/>
            <p onClick={handleSpeak} style={{fontSize:32,cursor:"pointer"}}>
              {isListening ? <SettingsVoiceIcon style={{color:'white'}}/> : <KeyboardVoiceIcon style={{color:'white'}}/>}
            </p>
          </form>
        </div>
      </div>
          </div>
        </div>
      )}
    </div>
  );
}


export default Diet;
