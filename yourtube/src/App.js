import React, { useEffect, useState } from 'react';
import Post from './components/Post.js';
import axios from 'axios';

const PORT = '5000';

export default function App() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:' + PORT + '/api/posts')
      .then(response => {
        setPosts(response.data);
      })
      .catch(err => {
        setError(err.message);
        console.log(error);
      });
    axios.get('http://localhost:' + PORT + '/api/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(err => {
        setError(err.message);
        console.log(error);
      });
  }, [PORT]);

  function onRefresh(){
    setRefreshing(true);
    axios.get('http://localhost:' + PORT + '/api/users')
      .then(response => {
        setPosts(response.data);
        setRefreshing(false);
      })
      .catch(error => {
        setError(error.message);
        setRefreshing(false);
      });
  };

  return (
    <div style={styles.container}>
      {(posts.length > 0 && users.length > 0) ? (posts.map(e =>
        <div key={e.p_id}>
          <Post videoLink={e.title} body={e.body} name={users.filter(user => user.u_id === e.u_id)[0].f_name + " " + users.filter(user => user.u_id === e.u_id)[0].l_name} likes={e.likes} dislikes={e.dislikes} p_id={e.p_id} PORT={PORT} />
        </div>
      )) : (<p>Fetching data...</p>)}
    </div>
  );
}

const styles = {
  container: {
    flex: 1,
    alignItems: "center",
  }
};