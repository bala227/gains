import React from 'react';
import './Home.css'; 
import Navbar from './Navbar'
import { Link } from 'react-router-dom';
import Footer from './Footer';
import About from './About';
import Services from './Services';

const Home = () => {
  return (
    <>
      <div className="container" id='home'>
      <Navbar />
      <main>
        <h3 style={{color:"white",fontSize:30}}>Experience the future of <span style={{color:"#ff2272",fontSize:40}}>GYM</span> Efficiently</h3>
        <p style={{color:"white"}}>Your fitness journey starts here. Bringing people together through Gains+ that unites fitness and efficiency</p>
        <Link className='button' to="/SignIn">Get Started</Link>
      </main>
      </div>
      <About />
      <Services />
      <footer id='footer' style={{backgroundColor:"black"}}>
        <p>&copy; 2024 Gym Management System. All rights reserved.</p>
        <Footer />
      </footer>
    </>
      
    
  );
};

export default Home;
