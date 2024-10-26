import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons"; 
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="icon-container">
        <a href="https://www.facebook.com/yourpage" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faFacebook} />
        </a>
        <a href="https://www.instagram.com/yourpage" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faInstagram} />
        </a>
        <a href="https://www.twitter.com/yourpage" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faTwitter} />
        </a>
        <a href="mailto:your-email@example.com" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faEnvelope} />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
