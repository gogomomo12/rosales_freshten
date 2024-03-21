import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css'; // Import custom styles for Login page

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accessLevels, setAccessLevels] = useState([]);
  const [selectedAccessLevel, setSelectedAccessLevel] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getAccessLevels();
  }, []);

  const getAccessLevels = () => {
    axios.get('http://localhost/rosales_freshten/api/access_levels/')
      .then(response => {
        setAccessLevels(response.data);
      })
      .catch(error => {
        console.error('Error fetching access levels: ', error);
      });
  };

  const handleLogin = (event) => {
    event.preventDefault();
    const selectedAccessLevelDescription = accessLevels.find(level => level.access_level_id === parseInt(selectedAccessLevel, 10))?.description;

    axios.post('http://localhost/rosales_freshten/api/login.php', { email, password, access_level_id: selectedAccessLevel })
      .then(response => {
        if (response.data.status === 1) {
          navigate(`/list?email=${email}&access_level=${selectedAccessLevelDescription}`);
        } else {
          alert(response.data.message);
        }
      })
      .catch(error => {
        console.error('Error logging in: ', error);
      });
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Access Level:</label>
          <select value={selectedAccessLevel} onChange={(e) => setSelectedAccessLevel(e.target.value)}>
            <option value="">Select Access Level</option>
            {accessLevels.map(level => (
              <option key={level.access_level_id} value={level.access_level_id}>{level.description}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn-login">Login</button>
      </form>
    </div>
  );
}

export default Login;
