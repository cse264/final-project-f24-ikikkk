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

  app.post('/api/users/:u_id/posts', async (req, res) => {
    try {
      const newPost = req.body; 
      const paramId = req.params.u_id;
      if(!newPost.Title || !newPost.Body){ 
        return res.status(400).send("Missing required fields: title, body");
      }
      let qs1 = `SELECT * FROM users WHERE u_id = ${paramId}`;
      query(qs1).then(data => {
        if (data.rows.length === 0) { 
          return res.status(404).send("User not found");
        }
        let post_id_qs = `SELECT COALESCE(MAX(p_id), 0) AS max_post_id FROM posts`;
        query(post_id_qs).then(newestPost => {
          let qs2 = `INSERT INTO posts (p_id, u_id, title, body, likes, dislikes) VALUES (${newestPost.rows[0].max_post_id + 1}, ${paramId}, '${newPost.Title}', '${newPost.Body}', 0, 0);`;
          query(qs2).then(() => res.json({ message: "Post added successfully" }));
        });
      });
    } catch (err) {
      console.error("something went wrong: " + err);
    }
  });

  app.post('/api/users/:u_id/posts/:p_id/comments', async (req, res) => {
    try {
      const newComment = req.body; 
      const paramId = req.params;
      if(!newComment.Body){ 
        return res.status(400).send("Missing required fields: body");
      }
      let qs1 = `SELECT * FROM users WHERE u_id = ${paramId.u_id}`;
      query(qs1).then(data => {
        if (data.rows.length === 0) { 
          return res.status(404).send("User not found");
        }
        let qs2 = `SELECT * FROM posts WHERE p_id = ${paramId.p_id}`;
        query(qs2).then(data => {
          if (data.rows.length === 0) { 
            return res.status(404).send("Posts not found");
          }
          let comment_id_qs = `SELECT COALESCE(MAX(c_id), 0) AS max_comment_id FROM comments`;
          query(comment_id_qs).then(newestComment => {
            let qs3 = `INSERT INTO comments (c_id, u_id, p_id, body, likes, dislikes) VALUES (${newestComment.rows[0].max_comment_id + 1}, ${paramId.u_id}, '${paramId.p_id}', '${newComment.Body}', 0, 0);`;
            query(qs3).then(() => res.json({ message: "Comment added successfully" }));
          });
        });
      });
    } catch (err) {
      console.error("something went wrong: " + err);
    }
  });

  app.delete('/api/posts/:p_id', async (req, res) => {
    try {
      const paramId = req.params.p_id;
      let qs1 = `SELECT * FROM posts WHERE p_id = ${paramId}`;
      query(qs1).then(data => {
        if (data.rows.length === 0) { 
          return res.status(404).send("Post not found");
        }
        let qs2 = `DELETE FROM posts WHERE p_id = ${paramId}`;
        query(qs2).then(data => {
          let qs3 = `SELECT * FROM comments WHERE p_id = ${paramId}`;
          query(qs3).then(data => {
            if (data.rows.length > 0) { 
              let qs4 = `DELETE FROM comments WHERE p_id = ${paramId}`;
              return query(qs4).then(() => res.json({ message: "Post deleted successfully" }));
            }
            res.json({ message: "Post deleted successfully" });
          });
        });
      });
    } catch (err) {
      console.error("Something went wrong: " + err);
    }
  });
  app.delete('/api/posts/:p_id/comments/c_id', async (req, res) => {
    try {
      const paramId = req.params;
      let qs1 = `SELECT * FROM posts WHERE p_id = ${paramId.p_id}`;
      query(qs1).then(data => {
        if (data.rows.length === 0) { 
          return res.status(404).send("Post not found");
        }
        let qs2 = `SELECT * FROM comments WHERE c_id = ${paramId.c_id}`;
        query(qs2).then(data => {
          if (data.rows.length === 0) { 
            return res.status(404).send("Comment not found");
          }
          let qs3 = `DELETE FROM comments WHERE c_id = ${paramId.c_id}`;
          query(qs3).then(() => res.json({ message: "Comment deleted successfully" }));
        });
      });
    } catch (err) {
      console.error("Something went wrong: " + err);
    }
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});