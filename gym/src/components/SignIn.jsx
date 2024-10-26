import React, { useEffect, useState } from 'react';
import './SignIn.css';
import CloseIcon from '@mui/icons-material/Close';

const SignIn = () => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [category, setCategory] = useState('');
  const [message] = useState('');

  useEffect(() => {
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const container = document.getElementById('container');

    const addRightPanelClass = () => container.classList.add('right-panel-active');
    const removeRightPanelClass = () => container.classList.remove('right-panel-active');

    signUpButton.addEventListener('click', addRightPanelClass);
    signInButton.addEventListener('click', removeRightPanelClass);

    return () => {
      signUpButton.removeEventListener('click', addRightPanelClass);
      signInButton.removeEventListener('click', removeRightPanelClass);
    };
  }, []);

  

  const cancelLogout = () => {
    setIsLogoutModalOpen(false);
  };

  return (
    <div className="signin">
      <div className="container" id="container">
        <div className="form-container sign-up-container">
          <form action='http://localhost/app-dev/register.php' method='post'>
            <h1>Register</h1>
            <select name="category" value={category} onChange={(e) => setCategory(e.target.value)} required>
              <option disabled value="">Select Category</option>
              <option value="trainer">Trainer</option>
              <option value="gymuser">Gym User</option>
            </select>
            <input
              name='username'
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            
            <input
              name='password'
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" name='register'>Register</button>
          </form>
        </div>
        <div className="form-container sign-in-container">
          <form action='http://localhost/app-dev/login.php' method='post'>
            <h1>Sign in</h1>
            <input
              name='username'
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              name='password'
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <a href="#f">Forgot your password?</a>
            <button type="submit" name='signin'>Sign In</button>
          </form>
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button className="ghost" id="signIn">Sign In</button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start your journey with us</p>
              <button className="ghost" id="signUp">Sign Up</button>
            </div>
          </div>
        </div>
      </div>
      {isLogoutModalOpen && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <CloseIcon onClick={cancelLogout} style={{ marginLeft: 290, cursor: 'pointer' }} />
            <h2>{message}</h2>
            <div className="modal-buttons">
              <button onClick={cancelLogout}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignIn;
