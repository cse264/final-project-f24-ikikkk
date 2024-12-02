import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import YouTube from "react-youtube";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
//Reference for embedding YouTube video
//Reference: https://medium.com/@otooker/embedding-a-youtube-video-in-react-9be0040b050d
const Post = ({ videoLink, body, name, u_id, is_admin,  likes, dislikes, p_id, PORT, onRefresh }) => {
    //Used the URLSearchParams interface to get the videoId: https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
    const searchParam = new URLSearchParams(new URL(videoLink).search);
  const videoId = searchParam.get("v");

  const [comments, setComments] = useState([]);
  const [usernames, setUsernames] = useState({});
  const [postLikes, setPostLikes] = useState(likes);
  const [postDislikes, setPostDislikes] = useState(dislikes);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);
  const [commentsLikes, setCommentsLikes] = useState({});
  const [commentsDislikes, setCommentsDislikes] = useState({});
  const [newComment, setNewComment] = useState("");

  const getComments = async () => {
    try {
      const response = await axios.get(`http://localhost:${PORT}/posts/${p_id}`);
      const post = response.data;

      setComments(post.comments);
      setPostLikes(post.likes);
      setPostDislikes(post.dislikes);

      const usernamesMap = {};
      const commentLikesMap = {};
      const commentDislikesMap = {};

      for (const comment of post.comments) {
        const user = await getUsername(comment.u_id);
        usernamesMap[comment.u_id] = user;
        commentLikesMap[comment.c_id] = comment.likes;
        commentDislikesMap[comment.c_id] = comment.dislikes;
      }

      setUsernames(usernamesMap);
      setCommentsLikes(commentLikesMap);
      setCommentsDislikes(commentDislikesMap);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleDelete = () => {
    axios
        .delete(`http://localhost:${PORT}/posts/${p_id}`)
        .then(() => {
            onRefresh();
        })
        .catch((err) => console.error(err));
};
  const getUsername = async (u_id) => {
    try {
      const response = await axios.get(`http://localhost:${PORT}/users/${u_id}`);
      return `${response.data.f_name} ${response.data.l_name}`;
    } catch (error) {
      console.error("Error fetching username:", error);
      return "Unknown User";
    }
  };

  useEffect(() => {
    getComments();
  }, [PORT]);

  const handleLike = () => {
    if (hasLiked) {
      axios.put(`http://localhost:${PORT}/posts/${p_id}/unlike`).catch((err) => console.error(err));
      setPostLikes(postLikes - 1);
      setHasLiked(false);
    } else {
      if (hasDisliked) {
        axios.put(`http://localhost:${PORT}/posts/${p_id}/unlike`).catch((err) => console.error(err));
        setPostDislikes(postDislikes - 1);
        setHasDisliked(false);
      }
      axios.put(`http://localhost:${PORT}/posts/${p_id}/like`).catch((err) => console.error(err));
      setPostLikes(postLikes + 1);
      setHasLiked(true);
    }
  };

  const handleDislike = () => {
    if (hasDisliked) {
      axios.put(`http://localhost:${PORT}/posts/${p_id}/undislike`).catch((err) => console.error(err));
      setPostDislikes(postDislikes - 1);
      setHasDisliked(false);
    } else {
      if (hasLiked) {
        axios.put(`http://localhost:${PORT}/posts/${p_id}/unlike`).catch((err) => console.error(err));
        setPostLikes(postLikes - 1);
        setHasLiked(false);
      }
      axios.put(`http://localhost:${PORT}/posts/${p_id}/dislike`).catch((err) => console.error(err));
      setPostDislikes(postDislikes + 1);
      setHasDisliked(true);
    }
  };

  const handleCommentLike = (c_id) => {
    const hasLiked = commentsLikes[`liked_${c_id}`]; // Track if the comment has been liked
    if (hasLiked) {
      // Unlike the comment
      axios
        .put(`http://localhost:${PORT}/posts/${p_id}/comments/${c_id}/unlike`)
        .then(() =>
          setCommentsLikes((prev) => ({
            ...prev,
            [c_id]: (prev[c_id] || 1) - 1, // Decrement like count
            [`liked_${c_id}`]: false, // Remove like state
          }))
        )
        .catch((error) => console.error("Error unliking comment:", error));
    } else {
      // Like the comment
      axios
        .put(`http://localhost:${PORT}/posts/${p_id}/comments/${c_id}/like`)
        .then(() =>
          setCommentsLikes((prev) => ({
            ...prev,
            [c_id]: (prev[c_id] || 0) + 1, // Increment like count
            [`liked_${c_id}`]: true, // Set like state
          }))
        )
        .catch((error) => console.error("Error liking comment:", error));
    }
  };
  
  const handleCommentDislike = (c_id) => {
    const hasDisliked = commentsDislikes[`disliked_${c_id}`]; // Track if the comment has been disliked
    if (hasDisliked) {
      // Remove dislike
      axios
        .put(`http://localhost:${PORT}/posts/${p_id}/comments/${c_id}/undislike`)
        .then(() =>
          setCommentsDislikes((prev) => ({
            ...prev,
            [c_id]: (prev[c_id] || 1) - 1, // Decrement dislike count
            [`disliked_${c_id}`]: false, // Remove dislike state
          }))
        )
        .catch((error) => console.error("Error undisliking comment:", error));
    } else {
      // Dislike the comment
      axios
        .put(`http://localhost:${PORT}/posts/${p_id}/comments/${c_id}/dislike`)
        .then(() =>
          setCommentsDislikes((prev) => ({
            ...prev,
            [c_id]: (prev[c_id] || 0) + 1, // Increment dislike count
            [`disliked_${c_id}`]: true, // Set dislike state
          }))
        )
        .catch((error) => console.error("Error disliking comment:", error));
    }
  };

  const createComment = () => {
    axios
      .post(`http://localhost:${PORT}/users/${u_id}/posts/${p_id}/comments`, { Body: newComment })
      .then(() => {
        setNewComment("");
        getComments();
      })
      .catch((error) => console.error("Error creating comment:", error));
  };

  const deleteComment = (c_id) => {
    axios
      .delete(`http://localhost:${PORT}/posts/${p_id}/comments/${c_id}`)
      .then(() => setComments((prev) => prev.filter((comment) => comment.c_id !== c_id)))
      .catch((error) => console.error("Error deleting comment:", error));
  };

  const options = {
    height: "195",
    width: "320",
    playerVars: { controls: 1 },
  };

  return (
    <Card style={styles.card}>
      <div style={styles.header}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {name}
        </Typography>
        {is_admin && (
          <IconButton onClick={handleDelete} style={styles.deleteButton}>
            <DeleteIcon />
          </IconButton>
        )}
      </div>
      <CardContent>
  <Typography variant="body1">{body}</Typography>
  <hr />
  <YouTube videoId={videoId} opts={options} />
  <div style={styles.reactions}>
    {hasLiked ? (
      <ThumbUpAltIcon onClick={handleLike} style={styles.icon} />
    ) : (
      <ThumbUpOffAltIcon onClick={handleLike} style={styles.icon} />
    )}{" "}
    {postLikes}
    {hasDisliked ? (
      <ThumbDownAltIcon onClick={handleDislike} style={styles.icon} />
    ) : (
      <ThumbDownOffAltIcon onClick={handleDislike} style={styles.icon} />
    )}{" "}
    {postDislikes}
  </div>
  <Typography variant="h6">Comments</Typography>
  {comments.map((comment) => (
    <div key={comment.c_id} style={styles.comment}>
      <Typography variant="body2">
        {usernames[comment.u_id]}: {comment.body}
      </Typography>
      <div style={styles.reactions}>
        {commentsLikes[`liked_${comment.c_id}`] ? (
          <ThumbUpAltIcon
            onClick={() => handleCommentLike(comment.c_id)}
            style={styles.iconActive}
          />
        ) : (
          <ThumbUpOffAltIcon
            onClick={() => handleCommentLike(comment.c_id)}
            style={styles.icon}
          />
        )}{" "}
        {commentsLikes[comment.c_id] || 0}
        {commentsDislikes[`disliked_${comment.c_id}`] ? (
          <ThumbDownAltIcon
            onClick={() => handleCommentDislike(comment.c_id)}
            style={styles.iconActive}
          />
        ) : (
          <ThumbDownOffAltIcon
            onClick={() => handleCommentDislike(comment.c_id)}
            style={styles.icon}
          />
        )}{" "}
        {commentsDislikes[comment.c_id] || 0}
        {is_admin && (
          <Button
            onClick={() => deleteComment(comment.c_id)}
            size="small"
            color="error"
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  ))}
  <TextField
    label="Add a comment"
    variant="outlined"
    size="small"
    fullWidth
    value={newComment}
    onChange={(e) => setNewComment(e.target.value)}
    style={{ marginTop: "20px" }}
  />
  <Button
    variant="contained"
    sx={{ backgroundColor: "#e53935" }}
    onClick={createComment}
    style={{ marginTop: "10px" }}
  >
    Add Comment
  </Button>
</CardContent>
    </Card>
  );
};

Post.propTypes = {
  videoLink: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  u_id: PropTypes.number.isRequired,
  likes: PropTypes.number.isRequired,
  dislikes: PropTypes.number.isRequired,
  p_id: PropTypes.number.isRequired,
  PORT: PropTypes.string.isRequired,
  onRefresh: PropTypes.func.isRequired,
};

const styles = {
  card: {
    maxWidth: 600,
    margin: "20px auto",
    padding: "20px",
    position: "relative",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deleteButton: {
    color: "#e53935",
  },
  reactions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  icon: {
    cursor: "pointer",
  },
  comment: {
    marginTop: "10px",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
  },
};

export default Post;

