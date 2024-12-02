import React, { useEffect, useState } from 'react';
import './login.css';
import axios from 'axios';
import { Button, ButtonGroup, TextField, Typography, Container, Box, Checkbox, FormControlLabel } from '@mui/material';

const PORT = '5000';
const Login = ({ onLogin }) => {
  const [isReturningUser, setIsReturningUser] = useState(null); // New or returning user selection
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

    // Prepare the payload
    const payload = {
      f_name: newUserDetails.f_name.trim(),
      l_name: newUserDetails.l_name.trim(),
      is_admin: newUserDetails.is_admin ? "true" : "false",
    };

    console.log("Payload to send:", JSON.stringify(payload)); // Debugging the payload

    axios
      .post(`http://localhost:${PORT}/users`, payload)
      .then((response) => {
        console.log("User created successfully:", response.data); // Debugging the response
        alert("User created successfully!");
        setUsers([...users, response.data]);
        setIsReturningUser(true); // Switch to returning user view
      })
      .catch((error) => {
        console.error("Error response:", error.response?.data || error.message); // Debugging the error
        alert("Failed to create user.");
      });
  };

  // Filter the users based on the selected login type
  const filteredUsers = users.filter((user) => user.is_admin === isAdmin);

  if (isReturningUser === null) {
    return (
      <Container maxWidth="sm">
        <Box textAlign="center" py={5}>
          <Typography variant="h4" gutterBottom sx={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
            YourTube
          </Typography>
          <Typography variant="h6" gutterBottom>
            Are you a returning user or a new user?
          </Typography>
          <Box mt={3}>
            <Button
              variant="contained"
              onClick={() => setIsReturningUser(true)}
              sx={{
                marginRight: 2,
                backgroundColor: '#e53935', // Red color
                color: '#fff', // White text
                '&:hover': {
                  backgroundColor: '#d32f2f', // Darker red on hover
                },
              }}
            >
              Returning User
            </Button>
            <Button
              variant="outlined"
              onClick={() => setIsReturningUser(false)}
              sx={{
                color: '#e53935', // Red text
                borderColor: '#e53935', // Red border
                '&:hover': {
                  borderColor: '#d32f2f', // Darker red border on hover
                  backgroundColor: 'rgba(229, 57, 53, 0.04)', // Light red background on hover
                },
              }}
            >
              New User
            </Button>
          </Box>
        </Box>
      </Container>
    );
  }

  if (!isReturningUser) {
    return (
      <Container maxWidth="sm">
        <Box py={5}>
          <Typography variant="h5" gutterBottom>
            Create a New Account
          </Typography>
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
                  checked={newUserDetails.is_admin} // Boolean state
                  onChange={(e) =>
                    setNewUserDetails({
                      ...newUserDetails,
                      is_admin: e.target.checked, // Set as boolean
                    })
                  }
                  sx={{
                    color: '#e53935', // Red color when unchecked
                    '&.Mui-checked': {
                      color: '#e53935', // Red color when checked
                    },
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
                backgroundColor: '#e53935', // Red color
                color: '#fff', // White text
                '&:hover': {
                  backgroundColor: '#d32f2f', // Darker red on hover
                },
              }}
            >
              Create Account
            </Button>
          </Box>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box py={5} >
        <Typography variant="h5" gutterBottom sx={{ fontSize: '2.5rem', fontWeight: 'bold', textAlign: 'center' }}>
          YourTube
        </Typography>
        <Box mt={3}>
          <ButtonGroup
            variant="contained"
            fullWidth
            sx={{
              '& .MuiButtonGroup-grouped': {
                color: '#fff', // Default text color
                '&:hover': {
                  backgroundColor: '#d32f2f', // Darker red on hover
                },
              },
            }}
          >
            <Button
              onClick={() => handleLoginAs(false)}
              sx={{
                backgroundColor: !isAdmin ? '#801613' : '#e53935', // Black when selected, red otherwise
                '&:hover': {
                  backgroundColor: !isAdmin ? '#801613' : '#d32f2f', // Maintain hover effect
                },
              }}
            >
              Log in as User
            </Button>
            <Button
              onClick={() => handleLoginAs(true)}
              sx={{
                backgroundColor: isAdmin ? '#801613' : '#e53935', // Black when selected, red otherwise
                '&:hover': {
                  backgroundColor: isAdmin ? '#801613' : '#d32f2f', // Maintain hover effect
                },
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
              SelectProps={{
                native: true,
              }}
            >
              <option value="" disabled>
                Select {isAdmin ? 'Admin' : 'User'}
              </option>
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
              backgroundColor: '#e53935', // Red color
              color: '#fff', // White text
              '&:hover': {
                backgroundColor: '#d32f2f', // Darker red on hover
              },
            }}
          >
            Log In
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
