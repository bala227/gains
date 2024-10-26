import React from 'react';
import './About.css';
import movement from '../images/movement.jpg'
import fitness from '../images/fitness.jpg'
import ach from '../images/ach.jpg'

const About = () => {
  const steps = [
    {
      title: "Gym Movement",
      description: "Many gyms offer tools and resources to track progress, such as fitness apps, workout logs, or integrated gym software.",
      imageUrl: movement,
    },
    {
      title: "Fitness Practice",
      description: "Gyms are adaptable to various fitness levels and preferences, catering to beginners and advanced individuals alike.",
      imageUrl: fitness,
    },
    {
      title: "Achievement",
      description: "Group fitness classes led by instructors offer structured workouts in a motivating group setting the development.",
      imageUrl: ach,
    },
  ];

  return (
    <div className="steps-container" id='about'>
      <h2 className="unique-subtitle">
        <span className="unique-line"></span> About<span className="unique-line"></span>
      </h2>
      <h2 className="steps-heading">Easy Step To Achieve Your Goals.</h2>
      <div className="steps">
      <svg className="connector-line">
          <path d="M 0 60 Q 250 0, 400 150 T 700 150" stroke="#FF4742" strokeWidth="5" fill="transparent" />
        </svg>
        {steps.map(step => (
          <div key={step.id} className="step">
            <div className="image-container">
              <img src={step.imageUrl} alt={step.title} className="step-image" />
            </div>
            <h3 className="step-title">{step.title}</h3>
            <p className="step-description">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
