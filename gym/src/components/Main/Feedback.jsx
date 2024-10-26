import React, { useEffect, useState } from 'react';
import './Feedback.css'; // Import the new CSS file
import person from '../../images/person.png';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Link } from 'react-router-dom';

const Testimonial = ({ text, name }) => {
  return (
    <div className="testimonial-card">
      <div className="testimonial-quote-icon">❝</div>
      <p className="testimonial-text">{text}</p>
      <div className="testimonial-person">
        <img src={person} alt={name} className="testimonial-avatar" />
        <p className="testimonial-name">{name}</p>
      </div>
    </div>
  );
};

const Feedback = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [emojis, setEmojis] = useState([]); // State for multiple emojis

  useEffect(() => {
    fetch('http://localhost/app-dev/feedback.php', {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => {
        setFeedbackData(data);
      });
  }, []);

  const handleFeedbackClick = (emoji) => {
    const emojiCount = Math.floor(Math.random() * 10) + 5; // Generate 5 to 15 emojis
    const newEmojis = Array.from({ length: emojiCount }, () => emoji);
    setEmojis(newEmojis);

    // Clear emojis after 2 seconds
    setTimeout(() => {
      setEmojis([]);
    }, 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Link to="/dashboard1">
        <ChevronLeftIcon style={{ fontSize: 30, color: 'white', position: 'absolute', top: 20, left: 15 }} />
      </Link>
      <div className="feedback-container">
        <h2 className="feedback-heading">How We Help People</h2>
        <p className="feedback-subheading">
          With serious savings, a seamless online application, and unique community benefits, our members have a lot to say about our loans!
        </p>
        <div className="testimonials-grid">
          {feedbackData.map((item) => (
            <Testimonial key={item.id} text={item.feedback} name={item.username} image={person} />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="feedback-contain">
            <h1>Was this useful?</h1>
            <div className="feedback-options">
              <button className="feedback-button great" onClick={() => handleFeedbackClick('😊')}>
                <SentimentSatisfiedAltIcon />
                <span>Yes, it was great!</span>
              </button>
              <button className="feedback-button okay" onClick={() => handleFeedbackClick('😐')}>
                <SentimentSatisfiedIcon />
                <span>Sort of, thanks!</span>
              </button>
              <button className="feedback-button not-really" onClick={() => handleFeedbackClick('😞')}>
                <SentimentVeryDissatisfiedIcon />
                <span>Not really</span>
              </button>
            </div>
            <p className="suggestion-text">Got a suggestion - Let us know</p>
            <form action="http://localhost/app-dev/feedback.php" method='post' className='feedform'>
              <textarea
                name="feedback"
                id="textarea"
                placeholder='Give your suggestions here ... '
                required
              />
              <div className="extra-options">
                <div className="extra-option">
                  <p>Need more help?</p>
                  <a href="#!">Contact support</a>
                </div>
                <button className='button feebutton' name='feedbutton'>Submit your feedback</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {emojis.map((emoji, index) => (
        <div className="emoji-floating" key={index} style={{ position: 'fixed', bottom: '-50px', fontSize: '35px', left: `${Math.random() * 100}vw` }}>
          {emoji}
        </div>
      ))}
    </div>
  );
};

export default Feedback;
