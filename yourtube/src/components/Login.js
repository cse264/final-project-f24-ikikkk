import React, { useEffect, useState } from 'react';
import './login.css';
import axios from 'axios';
import {
  Button,
  TextField,
  Typography,
  Container,
  Box,
} from '@mui/material';

const PORT = '5000';

const Login = ({ onLogin }) => {
  const [isReturningUser, setIsReturningUser] = useState(null); // Tracks if returning or new user
  const [userDetails, setUserDetails] = useState({ usr_name: '', password: '' }); // User input for login
  const [users, setUsers] = useState([]); // State to store user data
  const [newUserDetails, setNewUserDetails] = useState({ f_name: '', l_name: '', usr_name: '', password: '' }); // New user input

  useEffect(() => {
    axios
      .get(`http://localhost:${PORT}/users`)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleUserChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handleNewUserChange = (e) => {
    setNewUserDetails({ ...newUserDetails, [e.target.name]: e.target.value });
  };

  const handleLogin = () => {
    const { usr_name, password } = userDetails;
  
    if (!usr_name || !password) {
      alert('Please enter both username and password.');
      return;
    }
  
    axios
      .post(`http://localhost:${PORT}/login`, { usr_name, password })
      .then((response) => {
        const user = response.data.user;
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        onLogin(user);
        alert('Login successful!');
      })
      .catch((error) => {
        console.error(error.response?.data || error.message);
        alert('Invalid username or password.');
      });
  };

  const handleNewUserSubmit = () => {
    if (!newUserDetails.f_name || !newUserDetails.l_name) {
      alert('Please provide both first and last name.');
      return;
    }

    const payload = {
      f_name: newUserDetails.f_name.trim(),
      l_name: newUserDetails.l_name.trim(),
      usr_name: newUserDetails.usr_name.trim(),
      password: newUserDetails.password.trim(),
      is_admin: "false",
    };

    axios
      .post(`http://localhost:${PORT}/users`, payload)
      .then((response) => {
        alert('User created successfully!');
        setUsers([...users, response.data]);
        setIsReturningUser(true);
      })
      .catch((error) => {
        console.error('Error response:', error.response?.data || error.message);
        alert(error.response?.data);
      });
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
        backgroundColor: '#f5f5f5',
        borderRadius: 3,
        boxShadow: 3,
        padding: 3,
        marginTop: '5vh',
        marginBottom: '5vh',
      }}
    >
      <Box textAlign="center" py={5}>
        <Typography
          variant="h3"
          gutterBottom
          sx={{ fontWeight: 'bold', color: '#e53935', letterSpacing: 1 }}
        >
          YourTube
        </Typography>

        {isReturningUser === null && (
          <>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: '500' }}>
              Welcome To YourTube
            </Typography>
            <Box mt={3}>
              <Button
                variant="contained"
                onClick={() => setIsReturningUser(true)}
                sx={{
                  marginRight: 2,
                  backgroundColor: '#e53935',
                  color: '#fff',
                  '&:hover': { backgroundColor: '#d32f2f' },
                  fontSize: '1.1rem',
                  padding: '10px 30px',
                }}
              >
                Returning User
              </Button>
              <Button
                variant="outlined"
                onClick={() => setIsReturningUser(false)}
                sx={{
                  color: '#e53935',
                  borderColor: '#e53935',
                  '&:hover': {
                    borderColor: '#d32f2f',
                    backgroundColor: 'rgba(229, 57, 53, 0.1)',
                  },
                  fontSize: '1.1rem',
                  padding: '10px 30px',
                }}
              >
                New User
              </Button>
            </Box>
          </>
        )}

        {isReturningUser !== null && (
          <>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              {isReturningUser ? 'Login' : 'Create a New Account'}
            </Typography>

            {isReturningUser ? (
              <>
                <Box mt={3}>
                  <TextField
                    label="Username"
                    name="usr_name"
                    fullWidth
                    value={userDetails.usr_name}
                    onChange={handleUserChange}
                    sx={{ marginBottom: 2 }}
                  />
                  <TextField
                    label="Password"
                    name="password"
                    fullWidth
                    type="password"
                    value={userDetails.password}
                    onChange={handleUserChange}
                    sx={{ marginBottom: 2 }}
                  />
                </Box>
                <Box mt={3}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleLogin}
                    sx={{
                      backgroundColor: '#e53935',
                      color: '#fff',
                      '&:hover': { backgroundColor: '#d32f2f' },
                      fontSize: '1.1rem',
                      padding: '12px 0',
                    }}
                  >
                    Log In
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <Box mt={2}>
                  <TextField
                    label="First Name"
                    name="f_name"
                    fullWidth
                    value={newUserDetails.f_name}
                    onChange={handleNewUserChange}
                    sx={{ marginBottom: 2 }}
                  />
                  <TextField
                    label="Last Name"
                    name="l_name"
                    fullWidth
                    value={newUserDetails.l_name}
                    onChange={handleNewUserChange}
                    sx={{ marginBottom: 2 }}
                  />
                  <TextField
                    label="Username"
                    name="usr_name"
                    fullWidth
                    value={newUserDetails.usr_name}
                    onChange={handleNewUserChange}
                    sx={{ marginBottom: 2 }}
                  />
                  <TextField
                    label="Password"
                    name="password"
                    fullWidth
                    type="password"
                    value={newUserDetails.password}
                    onChange={handleNewUserChange}
                    sx={{ marginBottom: 2 }}
                  />
                </Box>
                <Box mt={3}>
                  <Button
                    variant="contained"
                    onClick={handleNewUserSubmit}
                    sx={{
                      backgroundColor: '#e53935',
                      color: '#fff',
                      '&:hover': { backgroundColor: '#d32f2f' },
                      fontSize: '1.1rem',
                      padding: '12px 0',
                    }}
                  >
                    Create Account
                  </Button>
                </Box>
              </>
            )}
            <Box mt={3}>
              <Button
                variant="outlined"
                onClick={() => setIsReturningUser(null)}
                sx={{
                  borderColor: '#e53935',
                  color: '#e53935',
                  '&:hover': { borderColor: '#d32f2f', backgroundColor: 'rgba(229, 57, 53, 0.1)' },
                  padding: '8px 20px',
                  fontSize: '1rem',
                }}
              >
                Go Back
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
};

export default Login;
