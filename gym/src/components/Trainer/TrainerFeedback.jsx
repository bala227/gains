import React, { useEffect, useState } from 'react';
import './TrainerFeedback.css'; 
import person from '../../images/person.png';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Link } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto'; // Import the Chart.js module

const Testimonial = ({ text, name, sentiment = "Unknown" }) => {
  return (
    <div className="testimonial-card">
      <div className="testimonial-quote-icon">❝</div>
      <p className="testimonial-text">{text}</p>
      <div className="testimonial-person">
        <img src={person} alt={name} className="testimonial-avatar" />
        <div style={{gap:160,display:'flex'}}>
        <p className="testimonial-name">{name}</p>
        <div className={`testimonial-sentiment ${sentiment ? sentiment.toLowerCase() : ''}`}>
        {sentiment==="Positive"&&<p style={{backgroundColor:"green"}}>{sentiment}</p>}
        {sentiment==="Neutral"&&<p style={{backgroundColor:"yellow",color:"#333"}}>{sentiment}</p>}
        {sentiment==="Negative"&&<p style={{backgroundColor:"red"}}>{sentiment}</p>}
      </div>
        </div>
      </div>
      
    </div>
  );
};

const TrainerFeedback = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [sentimentCount, setSentimentCount] = useState({ Positive: 0, Negative: 0, Neutral: 0 });

  useEffect(() => {
    fetch('http://localhost/app-dev/trainerfeedback.php', {
      method: "GET",
      credentials: "include"
    })
    .then((response) => response.json())
    .then((data) => {
      console.log("Fetched feedback data:", data); // Debugging: check the response here
      setFeedbackData(data);

      // Calculate sentiment counts after fetching the data
      calculateSentimentCounts(data);
    })
    .catch((error) => console.error("Error fetching feedback:", error));
  }, []);

  // Function to calculate sentiment counts
  const calculateSentimentCounts = (data) => {
    const counts = { Positive: 0, Negative: 0, Neutral: 0 };
    data.forEach(item => {
      if (item.sentiment in counts) {
        counts[item.sentiment]++;
      }
    });
    setSentimentCount(counts);
  };

  // Chart Data
  const chartData = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        label: 'Sentiment Analysis',
        data: [sentimentCount.Positive, sentimentCount.Neutral, sentimentCount.Negative],
        backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
        hoverBackgroundColor: ['#66BB6A', '#FFD54F', '#E57373']
      }
    ]
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Link to="/trainerdashboard">
        <ChevronLeftIcon style={{ fontSize: 30, color: "white", position: "absolute", top: 20, left: 15 }} />
      </Link>
      <div className="feedback-container">
        <h2 className="feedback-heading">What users feel</h2>
        
        <div className="testimonials-grid">
          {feedbackData.map((item, index) => (
            <Testimonial
              key={index}
              text={item.feedback}
              name={item.username}
              sentiment={item.sentiment}
            />
          ))}
        </div>

        <div className="chart-container">
          <h3 className="chart-heading">Sentiment Analysis Overview</h3>
          <Pie data={chartData} />
        </div>
      </div>
    </div>
  );
};

export default TrainerFeedback;
