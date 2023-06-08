import React from 'react';

import {
    Box,
    Paper,
    Button,
    IconButton
} from '@mui/material';

import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import { Peer } from '../socket';


/**
 * @param {{
* peer: Peer,
* muted: boolean
* }} props 
*/
export default function MainPeerStream(props) {
    if (!props.peer) {
        return null;
    }

    const peer = props.peer;
    const stream = peer.stream;

    /** @type {React.MutableRefObject<HTMLVideoElement>} */
    const videoRef = React.useRef(null);

    const [playing, setPlaying] = React.useState(false);
    const audioTrack = (stream.getAudioTracks().length ? stream.getAudioTracks()[0] : null);
    const videoTrack = (stream.getVideoTracks().length ? stream.getVideoTracks()[0] : null);
    const hasVideo = videoTrack != null;

    React.useLayoutEffect(() => {
        // videoRef.current.srcObject = stream;
        
    }, [stream.id]);

    React.useLayoutEffect(() => {
        console.log(videoTrack);
        let localStream;
        if (videoTrack) localStream = new MediaStream([videoTrack]);
        else localStream = new MediaStream();
        videoRef.current.srcObject = localStream;
        videoRef.current.onplay = () => {
            if (!playing) {
                setPlaying(true);
            }
        }
    }, [videoTrack])

    const play = () => {
        videoRef.current.play();
        setPlaying(true);
    }

    return (
        <div className="main-peer-stream">
            <video autoPlay key={stream.id} className={`${!hasVideo ? "hidden" : ""}`} muted={props.muted} ref={videoRef} />

            <div className="peer-stream-top-menu">
                <div className='peer-name'>
                    {peer.nick}
                </div>
            </div>

            {!playing && videoRef.current && videoRef.current.paused && hasVideo &&
            <div className="peer-stream-plug">
                <Button color="warning" variant='contained' onClick={play}>open video</Button>
            </div>
            }
        </div>
    );
}