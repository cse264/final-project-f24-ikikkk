import React from "react";
import PropTypes from 'prop-types';
import YouTube from "react-youtube";

//Reference for embedding YouTube video
//Reference: https://medium.com/@otooker/embedding-a-youtube-video-in-react-9be0040b050d
const Post = ({videoLink, body, name, likes, dislikes, comments}) => {
    //Used the URLSearchParams interface to get the videoId: https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
    const searchParam = new URLSearchParams(new URL(videoLink).search);
    const videoId = searchParam.get("v");

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
            <h4>Likes: {likes}   Dislikes: {dislikes}</h4>
            <h3>Comments: </h3>
            {comments.map(e => {
                {console.log(e)}
                <div>
                    <h4>{e.u_id}: {e.body}</h4>
                    <h5>Likes: {e.likes}   Dislikes: {e.dislikes}</h5>
                </div>
            })}
        </div>
    )
}

Post.propTypes = {
    videoLink: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    dislikes: PropTypes.number.isRequired,
    comments: PropTypes.array.isRequired,
  }

export default Post;