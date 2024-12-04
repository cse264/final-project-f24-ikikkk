import React, { useEffect, useLayoutEffect, useState } from 'react';
import Post from './components/Post.js';
import Login from './components/Login.js';
import Popup from './components/Popup.js';
import axios from 'axios';
import Fab from '@mui/material/Fab';
import { FaPlus } from "react-icons/fa";
import sr from './components/ScrollReveal.js';

const PORT = '5000';

export default function App() {
  const [posts, setPosts] = useState(null);
  const [users, setUsers] = useState(null);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("loggedInUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [popup, setPopup] = useState(false);

  useLayoutEffect(() => {
    getPosts();
    const savedUser = localStorage.getItem('LoggedInUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    axios.get('http://localhost:' + PORT + '/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(err => {
        setError(err.message);
        console.log(error);
      });

  }, []);

  useEffect(() => {
    //Checks for new posts
    if(currentUser){
      const timeout = setTimeout(() => {
        getPosts();
      }, 10000);
      return () => clearTimeout(timeout);
    }
  });

  useEffect(() => {
    if (posts){
    const config = {
        origin: "left", 
        distance: "100px",
        duration: 100, 
        delay: 50,
        interval: 200, 
        reset: false, 
    };
    sr.clean(".post");
    sr.reveal(".post", {...config});
  }
  }, [posts]);

  function getPosts(){
    axios.get('http://localhost:' + PORT + '/posts')
      .then(response => {
        setPosts(response.data);
      })
      .catch(error => {
        setError(error.message);
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

  return (
    <div style={styles.container}>
      <div style={styles.userBar}>
        <span style={styles.userName}>Logged in as: {currentUser.f_name} {currentUser.l_name}</span>
        <button onClick={handleLogout} style={styles.logoutButton}>Sign Out</button>
      </div>
      {
        (posts && users) ? (posts.sort((a, b) => b.p_id - a.p_id).map(e =>
          <div key={e.p_id} className='post'>
            <Post videoLink={e.title} body={e.body} name={users.filter(user => user.u_id === e.u_id)[0].f_name + " " + users.filter(user => user.u_id === e.u_id)[0].l_name} u_id={currentUser.u_id} is_admin={currentUser.is_admin} p_id={e.p_id} PORT={PORT} />
          </div>
        )) : (<p>Fetching data...</p>)
      }
      <Fab color="primary" aria-label="add" style={styles.fab} onClick={() => setPopup(true)}>
        <FaPlus />
      </Fab>
      <Popup PORT={PORT} u_id={currentUser.u_id} popup={popup} setPopup={setPopup} onRefresh={getPosts}/>
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
