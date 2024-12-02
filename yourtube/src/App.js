import React, { useEffect, useState } from 'react';
import Post from './components/Post.js';
import Login from './components/Login.js';
import Popup from './components/Popup.js';
import axios from 'axios';
import Fab from '@mui/material/Fab';
import { FaPlus } from "react-icons/fa";

const PORT = '5000';

export default function App() {
  const [posts, setPosts] = useState(null);
  const [users, setUsers] = useState(null);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [popup, setPopup] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('LoggedInUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }

  }, []);

  useEffect(() => {
    if (currentUser) {
    axios.get('http://localhost:' + PORT + '/posts')
      .then(response => {
        setPosts(response.data);
      })
      .catch(err => {
        setError(err.message);
        console.log(error);
      });
    axios.get('http://localhost:' + PORT + '/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(err => {
        setError(err.message);
        console.log(error);
      });
    }
  }, [PORT, currentUser]);

  function onRefresh(){
    setRefreshing(true);
    axios.get('http://localhost:' + PORT + '/posts')
      .then(response => {
        setPosts(response.data);
        setRefreshing(false);
      })
      .catch(error => {
        setError(error.message);
        setRefreshing(false);
      });
  };

  const handleLogin = (user) => {
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    setCurrentUser(null);
  }
  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  const deletePost = (p_id) => {
    axios.delete(`http://localhost:${PORT}/posts/${p_id}`)
      .then(() => {
        setPosts(posts.filter(post => post.p_id !== p_id));
      })
      .catch(err => {
        setError(err.message);
        console.log(err);
      });
  };

  return (
    <div style={styles.container}>
      <div style={styles.userBar}>
        <span style={styles.userName}>Logged in as: {currentUser.f_name} {currentUser.l_name}</span>
        <button onClick={handleLogout} style={styles.logoutButton}>Sign Out</button>
      </div>
      {
        (posts && users) ? (posts.map(e =>
          <div key={e.p_id}>
            <Post videoLink={e.title} body={e.body} name={users.filter(user => user.u_id === e.u_id)[0].f_name + " " + users.filter(user => user.u_id === e.u_id)[0].l_name} u_id={currentUser.u_id} is_admin={currentUser.is_admin} likes={e.likes} dislikes={e.dislikes} p_id={e.p_id} PORT={PORT} />
            {currentUser.is_admin && <button onClick = {() => deletePost(e.p_id)}>delete</button>}
          </div>
        )) : (<p>Fetching data...</p>)
      }
      <Fab color="primary" aria-label="add" style={styles.fab} onClick={() => setPopup(true)}>
        <FaPlus />
      </Fab>
      <Popup PORT={PORT} u_id={currentUser.u_id} popup={popup} setPopup={setPopup} onRefresh={onRefresh}/>
    </div>
  );
}

const styles = {
  container: {
    flex: 1,
    alignItems: "center",
  },
  userBar: {
    position: "absolute",
    top: 10,
    right: 10,
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  userName: {
    fontSize: "16px",
    fontWeight: "bold",
  },
  logoutButton: {
    padding: "10px 20px",
    backgroundColor: "#f44",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  fab: {
    position: "fixed", 
    bottom: 16, 
    right: 16,
  }
};
