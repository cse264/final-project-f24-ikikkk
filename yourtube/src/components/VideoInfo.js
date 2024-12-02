import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Typography from "@mui/material/Typography";

const VideoInfo = ({ videoLink }) => {
    const [title, setTitle] = useState(null);
    const [channel, setChannel] = useState(null);

    const fetchVideo = () => {
        const url = new URL(videoLink);
        if (url.hostname === "www.youtube.com" || url.hostname === "youtube.com") {
            const searchParam = new URLSearchParams(url.search);
            const videoId = searchParam.get("v");
            console.log(videoId);
            if (videoId && videoId.length === 11 && /^[a-zA-Z0-9_-]+$/.test(videoId)) {
                axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&fields=items(id%2Csnippet)&key=AIzaSyCVavSoDzEhgOkOekDQyTnZ70M8hAWQgBs`)
                    .then(response => {
                        console.log(JSON.stringify(response.data.items[0]));
                        return response.data.items[0].snippet;
                    })
                    .then(data => {
                        setTitle(data.title);
                        setChannel(data.channelTitle);
                    })
                    .catch(err => console.log(err));
            } else{console.log("Invalid Youtube Video ID");}
        } else{console.log("Invalid Youtube Link");}
    }

    useEffect(() => {
        fetchVideo();
    }, []);

    return (
        <div style={styles.comment}>
            <Typography variant="body1">
                {title}
            </Typography>
            <Typography variant="body2">
                Channel: {channel}
            </Typography>
        </div>
    );
};

VideoInfo.propTypes = {
    videoLink: PropTypes.string.isRequired,
}

const styles = {
    comment: {
        marginTop: "10px",
        padding: "10px",
        border: "1px solid #ddd",
        borderRadius: "5px",
    },
};

export default VideoInfo;
