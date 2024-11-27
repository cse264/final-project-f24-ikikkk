require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { query } = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/users', (req, res) => {
    try {
        let qs = `SELECT * FROM users`;
        query(qs).then(data => res.json(data.rows));
    } catch (err) {
        console.error("something went wrong: " + err);
    }
});

app.get('/api/posts', (req, res) => {
    try {
        let qs = `SELECT * FROM posts`;
        query(qs).then(data => res.json(data.rows));
    } catch (err) {
        console.error("something went wrong: " + err);
    }
});

app.get('/api/users/:u_id', async (req, res) => {
    try {
    const paramId = req.params.u_id;
    let qs1 = `SELECT * FROM users WHERE u_id = ${paramId}`;
    query(qs1).then(data => {
        if (data.rows.length === 0) { 
        return res.status(404).send("User not found");
        }
        let qs2 = 
        `SELECT users.u_id AS u_id, 
        users.f_name AS f_name, 
        users.l_name AS l_name,
        posts.p_id AS p_id, 
        posts.title AS p_title, 
        posts.body AS p_body, 
        posts.likes as p_likes,
        posts.dislikes as p_dislikes
        FROM users 
        LEFT JOIN posts ON users.u_id = posts.u_id
        WHERE users.u_id = ${paramId}`;
        query(qs2).then(data => {
        const userData = {
            UserID: data.rows[0].u_id,
            FirstName: data.rows[0].p_title,
            LastName: data.rows[0].p_body,
            Posts: data.rows
            .filter(row => row.p_id)
            .map(row => ({
                CommentsID: row.p_id,
                Title: row.p_title,
                Body: row.p_body,
                Likes: data.rows[0].p_likes,
                Dislikes: data.rows[0].p_dislikes,
            }))
        };
        res.json(userData);
        });
    });
    } catch (err) {
        console.error("something went wrong: " + err);
    }
});

app.get('/api/posts/:p_id', async (req, res) => {
    try {
      const paramId = req.params.p_id;
      let qs1 = `SELECT * FROM posts WHERE p_id = ${paramId}`;
      query(qs1).then(data => {
        if (data.rows.length === 0) { 
          return res.status(404).send("Post not found");
        }
        let qs2 = 
        `SELECT posts.p_id AS p_id, 
        posts.title AS p_title, 
        posts.body AS p_body, 
        posts.likes as p_likes,
        posts.dislikes as p_dislikes,
        comments.c_id AS c_id,
        comments.body AS c_text,
        comments.likes as c_likes,
        comments.dislikes as c_dislikes
        FROM posts 
        LEFT JOIN comments ON posts.p_id = comments.p_id
        WHERE posts.p_id = ${paramId}`;
        query(qs2).then(data => {
          const postData = {
            PostID: data.rows[0].p_id,
            Title: data.rows[0].p_title,
            Body: data.rows[0].p_body,
            Likes: data.rows[0].p_likes,
            Dislikes: data.rows[0].p_dislikes,
            Comments: data.rows
            .filter(row => row.c_id)
            .map(row => ({
              CommentsID: row.c_id,
              Body: row.c_text,
              Likes: data.rows[0].c_likes,
              Dislikes: data.rows[0].c_dislikes,
            }))
          };
          res.json(postData);
        });
      });
    } catch (err) {
        console.error("something went wrong: " + err);
    }
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});