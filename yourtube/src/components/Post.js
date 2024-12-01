import React, {useEffect, useState} from "react";
import PropTypes from 'prop-types';
import YouTube from "react-youtube";
import axios from "axios";
import { FaRegThumbsUp } from "react-icons/fa";
import { FaRegThumbsDown } from "react-icons/fa";

//Reference for embedding YouTube video
//Reference: https://medium.com/@otooker/embedding-a-youtube-video-in-react-9be0040b050d
const Post = ({videoLink, body, name, likes, dislikes, p_id, PORT}) => {
    //Used the URLSearchParams interface to get the videoId: https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
    const searchParam = new URLSearchParams(new URL(videoLink).search);
    const videoId = searchParam.get("v");
    const [comments, setComments] = useState(null);
    const [error, setError] = useState("");
    const [postLikes, setPostLikes] = useState(likes); 
    const [postDislikes, setPostDislikes] = useState(dislikes); 

    useEffect(() => {
        axios.get('http://localhost:' + PORT + '/posts/' + p_id)
          .then(response => {
            setComments(response.data.comments);
            console.log(response.data);
          })
          .catch(err => {
            setError(err.message);
            console.log(err.message);
          });
      }, [PORT]);

    const handleLike = () => {
        axios.put(`http://localhost:${PORT}/posts/${p_id}/like`)
        .catch((err) => console.error(err));
        setPostLikes(postLikes + 1);
    };

    const handleDislike = () => {
        axios.put(`http://localhost:${PORT}/posts/${p_id}/dislike`)
        .catch((err) => console.error(err));
        setPostDislikes(postDislikes + 1);
    };

    const options = {
        height: "195",
        width: "320",
        playerVars: {
            // autoplay: 1,
            controls: 1,
        }
    };

    const _onReady = (event) => {
        event.target.pauseVideo();
    };

    return (
        <div>
            <h2>{name}: {body}</h2>
            <YouTube videoId={videoId} opts={options} onReady={_onReady} id="video"/>
            <div>
                <FaRegThumbsUp onClick={handleLike}/> {postLikes}
                <FaRegThumbsDown onClick={handleDislike}/> {postDislikes}
            </div>
            <h3>Comments: </h3>
            {(comments) ? (
                comments.map(e => 
                    <div key={e.c_id} style={styles.comments}>
                        <p>{e.u_id}: {e.body}</p>
                        <p>Likes: {e.likes}   Dislikes: {e.dislikes}</p>
                    </div>
                )
            ) : (
                <p></p>
            )}
        </div>
    )
}

Post.propTypes = {
    videoLink: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    dislikes: PropTypes.number.isRequired,
    p_id: PropTypes.number.isRequired,
    PORT: PropTypes.string.isRequired,
  }

const styles = {
    comments: {
        marginLeft: 20,
    }
};

export default Post;