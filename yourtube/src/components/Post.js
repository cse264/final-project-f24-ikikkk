import React, {useEffect, useState} from "react";
import PropTypes from 'prop-types';
import YouTube from "react-youtube";
import axios from "axios";
import { FaRegThumbsUp } from "react-icons/fa";
import { FaRegThumbsDown } from "react-icons/fa";
import TextField from '@mui/material/TextField';

//Reference for embedding YouTube video
//Reference: https://medium.com/@otooker/embedding-a-youtube-video-in-react-9be0040b050d
const Post = ({videoLink, body, name, u_id, is_admin, p_id, PORT}) => {
    //Used the URLSearchParams interface to get the videoId: https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
    const searchParam = new URLSearchParams(new URL(videoLink).search);
    const videoId = searchParam.get("v");
    const [comments, setComments] = useState(null);
    const [usernames, setUsernames] = useState(null);
    const [postLikes, setPostLikes] = useState(null); 
    const [postDislikes, setPostDislikes] = useState(null);
    const [commentsLikes, setCommentsLikes] = useState(null); 
    const [commentsDislikes, setCommentsDislikes] = useState(null);
    const [newComment, setNewComment] = useState(null);
    
    async function getComments(){
        axios.get('http://localhost:' + PORT + '/posts/' + p_id)
        .then(response => {
            setComments(response.data.comments);
            setPostLikes(response.data.likes);
            setPostDislikes(response.data.dislikes);
            return response.data.comments;
        })
        .then(async data => {
            if(data){
                const newUsernames = {};
                const newCommentsLikes = {};
                const newCommentsDislikes = {};
                await Promise.all(data.map(async e => {
                    newUsernames[e.u_id] = await getUsername(e.u_id);
                    newCommentsLikes[e.c_id] = e.likes;
                    newCommentsDislikes[e.c_id] = e.dislikes;
                }))
                setUsernames(newUsernames);
                setCommentsLikes(newCommentsLikes);
                setCommentsDislikes(newCommentsDislikes);
            }
        })
        .catch(err => {
            console.log(err.message);
        });
    }

    useEffect(() => {
        getComments();
      }, [PORT]);

      useEffect(() => {
        const timeout = setTimeout(() => {
          getComments();
        }, 10000);
        //Clear up the timeout since every time Post component is rerendered, a new timeout is created
        return () => clearTimeout(timeout);
      }, [comments]);

      function getUsername(u_id){
        return axios.get('http://localhost:' + PORT + '/users/' + u_id)
          .then(response => {
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

    const handleCommentLike = (c_id) => {
        axios.put(`http://localhost:${PORT}/posts/${p_id}/comments/${c_id}/like`)
        .catch((err) => console.error(err));
        setCommentsLikes(oldCommentsLikes => ({
            ...oldCommentsLikes, [c_id]: oldCommentsLikes[c_id] + 1,
        }));
    };

    const handleCommentDislike = (c_id) => {
        axios.put(`http://localhost:${PORT}/posts/${p_id}/comments/${c_id}/dislike`)
        .catch((err) => console.error(err));
        setCommentsDislikes(oldCommentsDislikes => ({
            ...oldCommentsDislikes, [c_id]: oldCommentsDislikes[c_id] + 1,
        }));
    };

    const createComment = (comment) => {
        axios.post(`http://localhost:${PORT}/users/${u_id}/posts/${p_id}/comments`, {
            Body: comment
        })
        .then(response => {
            setNewComment("");
            getComments();
        })
        .catch(err => {
            console.log(err.message);
        });
    }

    const deleteComment = (c_id) => {
        axios.delete(`http://localhost:${PORT}/posts/${p_id}/comments/${c_id}`)
        .then(() => {
            setComments(comments.filter(comment => comment.c_id !== c_id));
        })
        .catch(err => {
            console.log(err.message);
        });
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
                            <FaRegThumbsUp onClick={() => handleCommentLike(e.c_id)}/> {commentsLikes[e.c_id]}
                            <FaRegThumbsDown onClick={() => handleCommentDislike(e.c_id)}/> {commentsDislikes[e.c_id]}
                            {is_admin && <button onClick = {() => deleteComment(e.c_id)}>delete</button>}
                        </div>
                    ) : (
                        <p>Fetching comments...</p>
                    )
                    
                )
            ) : (
                <p></p>
            )}
            <TextField label="Enter comment" variant="outlined" size="small" value={newComment} onChange={e => setNewComment(e.target.value)}/>
            <button onClick={() => createComment(newComment)}>Comment</button>
        </div>
    )
}

Post.propTypes = {
    videoLink: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    u_id: PropTypes.number.isRequired,
    p_id: PropTypes.number.isRequired,
    PORT: PropTypes.string.isRequired,
  }

const styles = {
    comments: {
        marginLeft: 20,
    }
};

export default Post;