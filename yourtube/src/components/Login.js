import React, { useEffect, useState } from 'react';
import './login.css';
import axios from 'axios';
import { Button, ButtonGroup, TextField, Typography, Container, Box, Checkbox, FormControlLabel } from '@mui/material';

const PORT = '5000';

const Login = ({ onLogin }) => {
  const [isReturningUser, setIsReturningUser] = useState(null); // Tracks if returning or new user
  const [isAdmin, setIsAdmin] = useState(false); // Tracks if Admin login is selected
  const [selectedUser, setSelectedUser] = useState(null); // Tracks selected user
  const [users, setUsers] = useState([]); // State to store user data
  const [newUserDetails, setNewUserDetails] = useState({ f_name: '', l_name: '', is_admin: false }); // New user input

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
      alert('Please select a user to log in.');
    }
  };

  const handleNewUserChange = (e) => {
    setNewUserDetails({ ...newUserDetails, [e.target.name]: e.target.value });
  };

  const handleNewUserSubmit = () => {
    if (!newUserDetails.f_name || !newUserDetails.l_name) {
      alert("Please provide both first and last name.");
      return;
    }

    const payload = {
      f_name: newUserDetails.f_name.trim(),
      l_name: newUserDetails.l_name.trim(),
      is_admin: newUserDetails.is_admin ? "true" : "false",
    };

    axios
      .post(`http://localhost:${PORT}/users`, payload)
      .then((response) => {
        alert("User created successfully!");
        setUsers([...users, response.data]);
        setIsReturningUser(true); // Switch to returning user view
      })
      .catch((error) => {
        console.error("Error response:", error.response?.data || error.message);
        alert("Failed to create user.");
      });
  };

  // Filter the users based on the selected login type
  const filteredUsers = users.filter((user) => user.is_admin === isAdmin);

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',  // Adjust the container height to take up half of the viewport
        backgroundColor: '#f5f5f5',
        borderRadius: 3,
        boxShadow: 3,
        padding: 3,
        marginTop: '5vh', // Added margin-top for spacing from the top
        marginBottom: '5vh', // Added margin-bottom for spacing from the bottom
      }}
    >
      <Box textAlign="center" py={5}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: '#e53935', letterSpacing: 1 }}>
          YourTube
        </Typography>

        {isReturningUser === null && (
          <>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: '500' }}>
              Are you a returning user or a new user?
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
              {isReturningUser ? 'Log In' : 'Create a New Account'}
            </Typography>

            {isReturningUser ? (
              <>
                <Box mt={3}>
                  <ButtonGroup variant="contained" fullWidth>
                    <Button
                      onClick={() => handleLoginAs(false)}
                      sx={{
                        backgroundColor: !isAdmin ? '#801613' : '#e53935',
                        '&:hover': { backgroundColor: !isAdmin ? '#801613' : '#d32f2f' },
                      }}
                    >
                      Log in as User
                    </Button>
                    <Button
                      onClick={() => handleLoginAs(true)}
                      sx={{
                        backgroundColor: isAdmin ? '#801613' : '#e53935',
                        '&:hover': { backgroundColor: isAdmin ? '#801613' : '#d32f2f' },
                      }}
                    >
                      Log in as Admin
                    </Button>
                  </ButtonGroup>
                </Box>
                {!selectedUser && (
                  <Box mt={3}>
                    <Typography>Select an account:</Typography>
                    <TextField
                      select
                      fullWidth
                      onChange={handleUserSelect}
                      value={selectedUser ? selectedUser.u_id : ''}
                      SelectProps={{ native: true }}
                    >
                      <option value="" disabled>Select {isAdmin ? 'Admin' : 'User'}</option>
                      {filteredUsers.map((user) => (
                        <option key={user.u_id} value={user.u_id}>
                          {user.f_name} {user.l_name} {user.is_admin ? '(Admin)' : ''}
                        </option>
                      ))}
                    </TextField>
                  </Box>
                )}
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
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={newUserDetails.is_admin}
                        onChange={(e) =>
                          setNewUserDetails({ ...newUserDetails, is_admin: e.target.checked })
                        }
                        sx={{
                          color: '#e53935',
                          '&.Mui-checked': { color: '#e53935' },
                        }}
                      />
                    }
                    label="Admin Account"
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
                onClick={() => setIsReturningUser(null)} // Button to toggle back to the initial state
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
