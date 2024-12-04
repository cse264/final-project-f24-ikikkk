require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { query } = require('./db');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const app = express();

app.use(cors());
app.use(express.json());

app.get('/users', (req, res) => {
    try {
        let qs = `SELECT * FROM users`;
        query(qs).then(data => res.json(data.rows));
    } catch (err) {
        console.error("something went wrong: " + err);
    }
});

app.get('/posts', (req, res) => {
    try {
        let qs = `SELECT * FROM posts`;
        query(qs).then(data => res.json(data.rows));
    } catch (err) {
        console.error("something went wrong: " + err);
    }
});

app.get('/users/:u_id', async (req, res) => {
    try {
    const paramId = req.params.u_id;
    let qs1 = `SELECT * FROM users WHERE u_id = ${paramId}`;
    query(qs1).then(data => {
        if (data.rows.length === 0) { 
        return res.status(404).send("User not found");
        }
        let qs2 = 
        `SELECT users.u_id AS u_id, 
        users.usr_name AS usr_name,
        users.f_name AS f_name, 
        users.l_name AS l_name,
        users.password AS password,
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
            u_id: data.rows[0].u_id,
            usr_name: data.rows[0].usr_name,
            f_name: data.rows[0].f_name,
            l_name: data.rows[0].l_name,
            password: data.rows[0].password,
            posts: data.rows
            .filter(row => row.p_id)
            .map(row => ({
                p_id: row.p_id,
                title: row.p_title,
                body: row.p_body,
                likes: row.p_likes,
                dislikes: row.p_dislikes,
            }))
        };
        res.json(userData);
        });
    });
    } catch (err) {
        console.error("something went wrong: " + err);
    }
});

app.get('/posts/:p_id', async (req, res) => {
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
        comments.u_id AS u_id,
        comments.body AS c_text,
        comments.likes as c_likes,
        comments.dislikes as c_dislikes
        FROM posts 
        LEFT JOIN comments ON posts.p_id = comments.p_id
        WHERE posts.p_id = ${paramId}`;
        query(qs2).then(data => {
          const postData = {
            p_id: data.rows[0].p_id,
            title: data.rows[0].p_title,
            body: data.rows[0].p_body,
            likes: data.rows[0].p_likes,
            dislikes: data.rows[0].p_dislikes,
            comments: data.rows
            .filter(row => row.c_id)
            .map(row => ({
              c_id: row.c_id,
              u_id: row.u_id,
              body: row.c_text,
              likes: row.c_likes,
              dislikes: row.c_dislikes,
            }))
          };
          res.json(postData);
        });
      });
    } catch (err) {
      console.error("something went wrong: " + err);
    }
  });

  app.post('/users', async (req, res) => {
    try {
      const { f_name, l_name, usr_name, is_admin, password } = req.body;
  
      if (!usr_name || !f_name || !l_name || !is_admin || !password) {
        return res
          .status(400)
          .send("Missing required fields: username, first name, last name, admin_privilege, password");
      }
  
      if (is_admin !== "true" && is_admin !== "false") {
        return res.status(400).send("is_admin must be either 'true' or 'false'");
      }
  
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      let qs1 = `SELECT * FROM users WHERE usr_name = '${usr_name}'`;
      query(qs1).then(data => {
        if (data.rows.length > 0) { 
          return res.status(400).send("Username already taken" );
        }
        let user_id_qs = `SELECT COALESCE(MAX(u_id), 0) AS max_user_id FROM users`;
        query(user_id_qs).then(newestUser => {
          let qs1 = `
            INSERT INTO users (u_id, f_name, l_name, is_admin, password, usr_name)
            VALUES (${newestUser.rows[0].max_user_id + 1}, '${f_name}', '${l_name}', ${is_admin}, '${hashedPassword}', '${usr_name}');
          `;
          query(qs1).then(() => res.json({ message: "User added successfully" }));
        });
      });
    } catch (err) {
      console.error("Something went wrong: " + err);
      res.status(500).send("Internal server error");
    }
  });
  app.post('/login', async (req, res) => {
    try {
      const { usr_name, password } = req.body;
  
      if (!usr_name || !password) {
        return res.status(400).send("Missing username or password");
      }
  
      // Fetch user by username
      const qs = `SELECT * FROM users WHERE usr_name = '${usr_name}'`;
      const result = await query(qs);
      const user = result.rows[0];
  
      if (!user) {
        return res.status(404).send("User not found");
      }
  
      // Compare the provided password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).send("Invalid username or password");
      }
  
      // Remove sensitive data before sending the response
      const { password: _, ...userWithoutPassword } = user;
  
      res.status(200).json({
        message: "Login successful",
        user: userWithoutPassword,
      });
    } catch (err) {
      console.error("Error in /login:", err);
      res.status(500).send("Internal server error");
    }
  });

  app.post('/users/:u_id/posts', async (req, res) => {
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

  app.post('/users/:u_id/posts/:p_id/comments', async (req, res) => {
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

  app.delete('/posts/:p_id', async (req, res) => {
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

  app.delete('/posts/:p_id/comments/:c_id', async (req, res) => {
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

  app.delete('/users/:u_id', async (req, res) => {
    try {
      const paramId = req.params.u_id;
      let qs1 = `SELECT * FROM users WHERE u_id = ${paramId}`;
      query(qs1).then(userData => {
        if (userData.rows.length === 0) {
          return res.status(404).send("User not found");
        }
        let qs2 = `DELETE FROM users WHERE u_id = ${paramId}`;
        query(qs2).then(() => {
          let qs3 = `SELECT * FROM comments WHERE u_id = ${paramId}`;
          query(qs3).then((data) => {
            if (data.rows.length > 0) {
              let qs4 = `DELETE FROM comments WHERE u_id = ${paramId}`;
              query(qs4).then(() => {
                let qs5 = `SELECT * FROM posts WHERE u_id = ${paramId}`;
                query(qs5).then((data) => {
                  if (data.rows.length > 0) {
                    let qs6 = `DELETE FROM posts WHERE u_id = ${paramId}`;
                    return query(qs6).then(() =>
                    res.json({ message: "User and their posts and comments deleted successfully" })
                    );
                  }
                });
              });
            } 
            res.json({ message: "User deleted successfully" });
          });
        });
      });
    } catch (err) {
      console.error("Something went wrong: " + err);
    }
  });

  app.put('/posts/:p_id/like', async (req, res) => {
    try {
      const paramId = req.params.p_id;
      let qs1 = `SELECT * FROM posts WHERE p_id = ${paramId}`;
      query(qs1).then(data => {
        if (data.rows.length === 0) { 
          return res.status(404).send("Post not found");
        }
        let qs2 = `SELECT likes FROM posts WHERE p_id = ${paramId}`;
        query(qs2).then(likeAmt => {
          let qs3 = `UPDATE posts SET likes = ${likeAmt.rows[0].likes + 1} WHERE p_id = ${paramId}`;
          query(qs3).then(() => res.json({ message: "Like added successfully" }));
        });
      });
    } catch (err) {
      console.error("Something went wrong: " + err);
    }
  });

  app.put('/posts/:p_id/dislike', async (req, res) => {
    try {
      const paramId = req.params.p_id;
      let qs1 = `SELECT * FROM posts WHERE p_id = ${paramId}`;
      query(qs1).then(data => {
        if (data.rows.length === 0) { 
          return res.status(404).send("Post not found");
        }
        let qs2 = `SELECT dislikes FROM posts WHERE p_id = ${paramId}`;
        query(qs2).then(dislikeAmt => {
          let qs3 = `UPDATE posts SET dislikes = ${dislikeAmt.rows[0].dislikes + 1} WHERE p_id = ${paramId}`;
          query(qs3).then(() => res.json({ message: "Dislike added successfully" }));
        });
      });
    } catch (err) {
      console.error("Something went wrong: " + err);
    }
  });

  app.put('/posts/:p_id/unlike', async (req, res) => {
    try {
      const paramId = req.params.p_id;
      let qs1 = `SELECT * FROM posts WHERE p_id = ${paramId}`;
      query(qs1).then(data => {
        if (data.rows.length === 0) { 
          return res.status(404).send("Post not found");
        }
        let qs2 = `SELECT likes FROM posts WHERE p_id = ${paramId}`;
        query(qs2).then(likeAmt => {
          let qs3 = `UPDATE posts SET likes = ${likeAmt.rows[0].likes - 1} WHERE p_id = ${paramId}`;
          query(qs3).then(() => res.json({ message: "Like removed successfully" }));
        });
      });
    } catch (err) {
      console.error("Something went wrong: " + err);
    }
  });

  app.put('/posts/:p_id/undislike', async (req, res) => {
    try {
      const paramId = req.params.p_id;
      let qs1 = `SELECT * FROM posts WHERE p_id = ${paramId}`;
      query(qs1).then(data => {
        if (data.rows.length === 0) { 
          return res.status(404).send("Post not found");
        }
        let qs2 = `SELECT dislikes FROM posts WHERE p_id = ${paramId}`;
        query(qs2).then(dislikeAmt => {
          let qs3 = `UPDATE posts SET dislikes = ${dislikeAmt.rows[0].dislikes - 1} WHERE p_id = ${paramId}`;
          query(qs3).then(() => res.json({ message: "Dislike removed successfully" }));
        });
      });
    } catch (err) {
      console.error("Something went wrong: " + err);
    }
  });

  app.put('/posts/:p_id/comments/:c_id/like', async (req, res) => {
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
          let qs3 = `SELECT likes FROM comments WHERE c_id = ${paramId.c_id}`;
          query(qs3).then(likeAmt => {
            let qs4 = `UPDATE comments SET likes = ${likeAmt.rows[0].likes + 1} WHERE c_id = ${paramId.c_id}`;
            query(qs4).then(() => res.json({ message: "Like added successfully" }));
          });
        });
      });
    } catch (err) {
      console.error("Something went wrong: " + err);
    }
  });

  app.put('/posts/:p_id/comments/:c_id/dislike', async (req, res) => {
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
          let qs3 = `SELECT dislikes FROM comments WHERE c_id = ${paramId.c_id}`;
          query(qs3).then(dislikeAmt => {
            let qs4 = `UPDATE comments SET dislikes = ${dislikeAmt.rows[0].dislikes + 1} WHERE c_id = ${paramId.c_id}`;
            query(qs4).then(() => res.json({ message: "Disike added successfully" }));
          });
        });
      });
    } catch (err) {
      console.error("Something went wrong: " + err);
    }
  });

  app.put('/posts/:p_id/comments/:c_id/unlike', async (req, res) => {
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
          let qs3 = `SELECT likes FROM comments WHERE c_id = ${paramId.c_id}`;
          query(qs3).then(likeAmt => {
            let qs4 = `UPDATE comments SET likes = ${likeAmt.rows[0].likes - 1} WHERE c_id = ${paramId.c_id}`;
            query(qs4).then(() => res.json({ message: "Like removed successfully" }));
          });
        });
      });
    } catch (err) {
      console.error("Something went wrong: " + err);
    }
  });

  app.put('/posts/:p_id/comments/:c_id/undislike', async (req, res) => {
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
          let qs3 = `SELECT dislikes FROM comments WHERE c_id = ${paramId.c_id}`;
          query(qs3).then(dislikeAmt => {
            let qs4 = `UPDATE comments SET dislikes = ${dislikeAmt.rows[0].dislikes - 1} WHERE c_id = ${paramId.c_id}`;
            query(qs4).then(() => res.json({ message: "Disike removed successfully" }));
          });
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