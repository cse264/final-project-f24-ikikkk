import React, {useState} from "react";
import PropTypes from 'prop-types';
import axios from "axios";
import Popup from 'reactjs-popup';
import TextField from '@mui/material/TextField';

const PostPopup = ({PORT, u_id, popup, setPopup, onRefresh}) => {
    const [youtubeLink, setYoutubeLink] = useState(null);
    const [description, setDescription] = useState(null);
    const [error, setError] = useState(null);

    const createPost = (title, body) => {
      //Check if the link is a valid youtube link
      try{
        const url = new URL(title);
        if(url.hostname === 'www.youtube.com' || url.hostname === 'youtube.com'){
          const searchParam = new URLSearchParams(url.search);
          const videoId = searchParam.get('v');
          console.log(videoId);
          if(videoId && videoId.length === 11 && /^[a-zA-Z0-9_-]+$/.test(videoId)){
              axios.post('http://localhost:' + PORT + '/users/' + u_id + '/posts', {
                Title: title,
                Body: body
                })
                .then(response => {
                  onRefresh();
                  console.log(response);
                  setPopup(false);
                  return;
                })
                .catch(err => {
                    console.log(err.message);
                    return;
                });
          } else{
            setError("Invalid Youtube Video ID");
            return;
          }
      } else{
        setError("Invalid Youtube Link");
        return;
      }
      }
      catch(err){
        setError(err.message);
      }
    }
    
    const changeYoutubeLink = (value) => {
      setYoutubeLink(value);
      setError("");
    }

    const closePopup = () => {
      setPopup(false);
      setError("");
      setYoutubeLink("");
      setDescription("");
    }
    
    return (
        <Popup open={popup} modal nested onClose={() => {closePopup()}}>
        {close => (
          <div style={{ position: 'fixed', backgroundColor: 'white', padding: '50px', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '40vw', height: '40vh', borderStyle: 'solid', borderRadius: '10px', borderWidth: '1px', borderColor: 'black'}}>
            <TextField label="Enter Youtube Link" variant="outlined" size="small" error={!!error} helperText={error || ""} onChange={e => changeYoutubeLink(e.target.value)}/>
            <TextField label="Enter description" variant="outlined" size="small" onChange={e => setDescription(e.target.value)}/>
            <button onClick={() => createPost(youtubeLink, description)}>Submit</button>
          </div>
        )}
      </Popup>
    )
}

Popup.propTypes = {
    PORT: PropTypes.string.isRequired,
    u_id: PropTypes.number.isRequired,
    popup: PropTypes.bool.isRequired,
    setPopup: PropTypes.func.isRequired,
  }

// const styles = {
// };

export default PostPopup;