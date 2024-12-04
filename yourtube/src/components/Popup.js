import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Popup from "reactjs-popup";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const PostPopup = ({ PORT, u_id, popup, setPopup, onRefresh }) => {
  const [youtubeLink, setYoutubeLink] = useState(null);
  const [description, setDescription] = useState(null);
  const [error, setError] = useState(null);

  const createPost = (title, body) => {
    // Check if the link is a valid youtube link
    try {
      const url = new URL(title);
      if (url.hostname === "www.youtube.com" || url.hostname === "youtube.com") {
        const searchParam = new URLSearchParams(url.search);
        const videoId = searchParam.get("v");
        console.log(videoId);
        if (videoId && videoId.length === 11 && /^[a-zA-Z0-9_-]+$/.test(videoId)) {
          axios
            .post(`http://localhost:${PORT}/users/${u_id}/posts`, {
              Title: title,
              Body: body.replace(/'/g, "''"),
            })
            .then((response) => {
              onRefresh();
              console.log(response);
              setPopup(false);
              return;
            })
            .catch((err) => {
              console.log(err.message);
              return;
            });
        } else {
          setError("Invalid Youtube Video ID");
          return;
        }
      } else {
        setError("Invalid Youtube Link");
        return;
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const changeYoutubeLink = (value) => {
    setYoutubeLink(value);
    setError("");
  };

  const closePopup = () => {
    setPopup(false);
    setError("");
    setYoutubeLink("");
    setDescription("");
  };

  return (
    <Popup open={popup} modal nested onClose={() => closePopup()}>
      {close => (
        <div style={styles.popupContainer}>
          <Typography variant="h6" sx={{ marginBottom: "20px", textAlign: "center", color: "#000" }}>
            Create a New Post
          </Typography>
          <div style={styles.formContainer}>
            <TextField
              label="Enter Youtube Link"
              variant="outlined"
              size="small"
              fullWidth
              error={!!error}
              helperText={error || ""}
              value={youtubeLink}
              onChange={(e) => changeYoutubeLink(e.target.value)}
              style={styles.textField}
            />
            <TextField
              label="Enter description"
              variant="outlined"
              size="small"
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={styles.textField}
            />
          </div>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => createPost(youtubeLink, description)}
            style={{ marginBottom: "10px", backgroundColor: "#e53935" }}
          >
            Submit
          </Button>
          <Button
            variant="outlined"
            color="#e53935"
            fullWidth
            onClick={closePopup}
            style={{ marginBottom: "10px", color: "#e53935" }}
          >
            Cancel
          </Button>
        </div>
      )}
    </Popup>
  );
};

PostPopup.propTypes = {
  PORT: PropTypes.string.isRequired,
  u_id: PropTypes.number.isRequired,
  popup: PropTypes.bool.isRequired,
  setPopup: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
};

const styles = {
  popupContainer: {
    position: "relative",
    backgroundColor: "#ffffff", 
    padding: "30px",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "40vw",
    maxWidth: "500px",
    borderRadius: "12px", 
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", 
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    border: "none", 
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "16px", 
    marginBottom: "20px",
    width: "100%",
  },
  textField: {
    backgroundColor: "#f9f9f9", 
    borderRadius: "8px", 
    padding: "8px", 
  },
  buttonSubmit: {
    marginBottom: "12px", 
    fontWeight: "bold", 
    backgroundColor: "#e53935", 
    color: "#fff",
    transition: "background-color 0.3s ease",
  },
  buttonSubmitHover: {
    backgroundColor: "#0056b3", 
  },
  buttonCancel: {
    fontWeight: "bold",
    borderColor: "#e53935", 
    color: "#e53935", 
    transition: "background-color 0.3s ease, color 0.3s ease", 
  },
  buttonCancelHover: {
    backgroundColor: "#f9f9f9", 
    color: "#0056b3", 
  },
};

export default PostPopup;
