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
    const [usernames, setUsernames] = useState(null);
    const [postLikes, setPostLikes] = useState(likes); 
    const [postDislikes, setPostDislikes] = useState(dislikes); 

    useEffect(() => {
        async function getComments(){
            axios.get('http://localhost:' + PORT + '/posts/' + p_id)
            .then(response => {
                setComments(response.data.comments);
                return response.data.comments;
            })
            .then(async data => {
                const newUsernames = {};
                await Promise.all(data.map(async e => {
                    newUsernames[e.u_id] = await getUsername(e.u_id);
                }))
                setUsernames(newUsernames);
            })
            .catch(err => {
                console.log(err.message);
            });
        }
        getComments();
      }, [PORT]);

      function getUsername(u_id){
        return axios.get('http://localhost:' + PORT + '/users/' + u_id)
          .then(response => {
            console.log(response.data);
            return response.data.f_name + " " + response.data.l_name;
          })
          .catch(err => {
            console.log(err.message);
            return "";
          });
      }

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
                    (usernames && usernames[e.u_id]) ? (
                        <div key={e.c_id} style={styles.comments}>
                            <p>{usernames[e.u_id]}: {e.body}</p>
                            <p style={styles.comments}>Likes: {e.likes}   Dislikes: {e.dislikes}</p>
                        </div>
                    ) : (
                        <p>Fetching comments...</p>
                    )
                    
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