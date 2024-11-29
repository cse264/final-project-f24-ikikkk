import React, { useEffect, useState } from 'react';
import './login.css';
import axios from 'axios';

const PORT = '5000';
const Login = ({ onLogin }) => {
  const [isAdmin, setIsAdmin] = useState(false); // Tracks if Admin login is selected
  const [selectedUser, setSelectedUser] = useState(null); // Tracks selected user
  const [users, setUsers] = useState([]); // State to store user data
 
  useEffect(() => {
    axios
      .get('http://localhost:' + PORT + '/users')
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleLoginAs = (isAdminLogin) => {
    setIsAdmin(isAdminLogin); // Update whether Admin or User is selected
    setSelectedUser(null); // Reset the selected user
  };

  const handleUserSelect = (e) => {
    const userId = e.target.value;
    const user = users.find((user) => user.u_id.toString() === userId);
    setSelectedUser(user);
  };

  const handleLogin = () => {
    if (selectedUser) {
      localStorage.setItem('loggedInUser', JSON.stringify(selectedUser));
      onLogin(selectedUser); // Pass the selected user to App.js
    } else {
      alert("Please select a user to log in.");
    }
  };

  // Filter the users based on the selected login type
  const filteredUsers = users.filter((user) => user.is_admin === isAdmin);

  return (
    <div className="login-container">
      <h1 className="login-title">YourTube</h1>

      <div className="login-buttons">
        <button
          className={`login-button ${!isAdmin ? 'active' : ''}`}
          onClick={() => handleLoginAs(false)}
        >
          Log in as User
        </button>
        <button
          className={`login-button ${isAdmin ? 'active' : ''}`}
          onClick={() => handleLoginAs(true)}
        >
          Log in as Admin
        </button>
      </div>

      {!selectedUser && (
        <div className="login-dropdown">
          <label>Select an account:</label>
          <select onChange={handleUserSelect} defaultValue="">
            <option value="" disabled>
              Select {isAdmin ? "Admin" : "User"}
            </option>
            {filteredUsers.map((user) => (
              <option key={user.u_id} value={user.u_id}>
                {user.f_name} {user.l_name} {user.is_admin ? "(Admin)" : ""}
              </option>
            ))}
          </select>
        </div>
      )}

      <button onClick={handleLogin} className="home-button">
        Log In
      </button>
    </div>
  );
};

export default Login;
