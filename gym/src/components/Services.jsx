import React from 'react';
import './Services.css'; 
import fit from '../images/fit.jpeg'

const services = [
  {
    title: 'Cardio Strength',
    description: 'Regular health check-ups and assessments help track fitness progress, identify areas.',
    icon: '💓',
  },
  {
    title: 'Weight Lifting',
    description: 'Regular health check-ups and assessments help track fitness progress, identify areas.',
    icon: '🏋️‍♂️',
  },
  {
    title: 'Body Balance',
    description: 'Regular health check-ups and assessments help track fitness progress, identify areas.',
    icon: '🏋️‍♀️',
  },
  {
    title: 'Beginner Pilates',
    description: 'Regular health check-ups and assessments help track fitness progress, identify areas.',
    icon: '🚴‍♀️',
  },
];

const ServiceCard = ({ icon, title, description }) => (
  <div className="unique-service-card">
    <div className="unique-icon">{icon}</div>
    <h3 className="unique-service-title">{title}</h3>
    <p className="unique-service-description">{description}</p>
    <a href="#readmore" className="unique-read-more">
      READ MORE &rarr;
    </a>
  </div>
);

const Services = () => (
  <div className="unique-container" id='services'>
    <section className="unique-header">
      <h2 className="unique-subtitle">
        <span className="unique-line"></span> OUR SERVICES <span className="unique-line"></span>
      </h2>
    </section>
    <div className="unique-content">
      <div className="unique-hero-section">
        <img
          src={fit}
          alt="Service"
          className="unique-hero-image"
        />
        <div className="unique-hero-text">
          <h2>TURN FAT INTO FIT</h2>
        </div>
      </div>
      <div className="unique-services-grid">
        {services.map((service, index) => (
          <ServiceCard key={index} {...service} />
        ))}
      </div>
    </div>
  </div>
);

export default Services;
