import React from 'react'
import '../components/Navbar.css'
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <div className='navbar'>
        <nav className='nav'>
          <ul>
            <h1 className='title'>Gains<span style={{color:"white"}}>+</span></h1>
            <a href="#home" style={{textDecoration:"none"}}><li>Home</li></a>
            <a href="#about" style={{textDecoration:"none"}}><li>About</li></a>
            <a href="#services" style={{textDecoration:"none"}}><li>Services</li></a>
            <a href="#footer" style={{textDecoration:"none"}}><li>Contact Us</li></a>
            <Link to="/SignIn" className='button'><p>Sign in</p></Link>
          </ul>
        </nav>
    </div>

  )
}
