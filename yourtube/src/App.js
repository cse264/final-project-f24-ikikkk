import React, { useEffect, useState } from 'react';
import Post from './components/Post.js';
// import axios from 'axios';

// const ipAddress = 'localhost';

export default function App() {
  let posts = [{"p_id":1,"u_id":1,"title":"https://www.youtube.com/watch?v=jfKfPfyJRdk","body":"A classic","likes":20,"dislikes":2},
    {"p_id":2,"u_id":1,"title":"https://www.youtube.com/watch?v=TyUA1OmXMXA","body":"Learned a lot","likes":100,"dislikes":4},
    {"p_id":3,"u_id":4,"title":"https://www.youtube.com/watch?v=ZAqIoDhornk","body":"Physics!!!!","likes":1,"dislikes":0},
    {"p_id":4,"u_id":2,"title":"https://www.youtube.com/watch?v=vr5dCRHAgb0","body":"sooo relaxing","likes":20,"dislikes":2},
    {"p_id":5,"u_id":5,"title":"https://www.youtube.com/watch?v=xvFZjo5PgG0","body":"It is soooo good!!","likes":2,"dislikes":20},
    {"p_id":6,"u_id":5,"title":"https://www.youtube.com/watch?v=xvFZjo5PgG0","body":"It is soooo good!!!!!!","likes":2,"dislikes":100}];
  
  let users = [{"u_id":1,"f_name":"Mustang","l_name":"John","is_admin":false},
    {"u_id":2,"f_name":"John","l_name":"Phillips","is_admin":true},
    {"u_id":3,"f_name":"Katusha","l_name":"Vasilischev","is_admin":true},
    {"u_id":4,"f_name":"Hal","l_name":"Gloster","is_admin":false},
    {"u_id":5,"f_name":"Henry","l_name":"Schumacher","is_admin":false}];
  
  let comments = [{"c_id":1,"u_id":2,"p_id":1,"body":"I AGREE!!!","likes":100,"dislikes":1},
    {"c_id":2,"u_id":5,"p_id":1,"body":"I Watch This Like Everyday!!!","likes":500,"dislikes":10},
    {"c_id":3,"u_id":1,"p_id":6,"body":"Please remove for spamming","likes":200,"dislikes":0},
    {"c_id":4,"u_id":1,"p_id":6,"body":"AHHHHHHH","likes":100,"dislikes":1}];
  
  // const [data, setData] = useState(null);
  // const [error, setError] = useState(null);
  // const [refreshing, setRefreshing] = useState(false);

  // useEffect(() => {
  //   axios.get('http://' + ipAddress + ':3000/posts')
  //     .then(response => {
  //       setData(response.data);
  //     })
  //     .catch(error => {
  //       setError(error.message);
  //     });
  // });

  // function onRefresh(){
  //   setRefreshing(true);
  //   axios.get('http://' + ipAddress + ':3000/posts')
  //     .then(response => {
  //       setData(response.data);
  //       setRefreshing(false);
  //     })
  //     .catch(error => {
  //       setError(error.message);
  //       setRefreshing(false);
  //     });
  // };

  return (
    <div style={styles.container}>
      {posts.map(e => 
        <div>
          <Post videoLink={e.title} body={e.body} name={users.filter(user => user.u_id === e.u_id)[0].f_name} likes={e.likes} dislikes={e.dislikes} comments={comments.filter(comment => comment.p_id === e.p_id)}/>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: '#FEFAFF',
  }
};