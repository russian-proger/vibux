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
 * muted: boolean,
 * selected: boolean,
 * onSelect: function
 * }} props 
 */
export default function PeerStream(props) {
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

    // const play = () => {
    //     setPlaying(true);
    //     const localStream = new MediaStream(stream.getVideoTracks());
    //     videoRef.current.srcObject = localStream;
    //     localStream.onremovetrack = () => setPlaying(false);
    //     videoRef.current.play();
    // }

    // React.useEffect(() => {
    //     if (!hasVideo) {
    //         setPlaying(false);
    //     }
    // }, [hasVideo]);

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
        // <div className="peer-stream-block">
        //     <video autoPlay key={stream.id} className={`${!hasVideo ? "hidden" : ""}`} muted={props.muted} ref={videoRef} />

        //     {!playing && videoRef.current && videoRef.current.paused && hasVideo &&
        //     <div className="peer-stream-plug">
        //         <Button onClick={play}>Показать трансляцию</Button>
        //     </div>
        //     }
        // </div>



        <div className="peer-stream-block">
            <video autoPlay key={stream.id} className={`${!hasVideo ? "hidden" : ""}`} muted={props.muted} ref={videoRef} />

            <div className="peer-stream-top-menu">
            <div className='peer-name'>
                {peer.nick}
            </div>
            <div className='fullscreen-btn'>
                <IconButton onClick={() => props.onSelect(props.selected ? null : props.peer)}>
                    {!props.selected ? <FullscreenIcon color="info" /> : <FullscreenExitIcon color="info" /> }
                </IconButton>
            </div>
            </div>

            <div className="peer-stream-bottom-menu">
            {audioTrack != null ? <MicIcon color="warning" /> : <MicOffIcon color="warning" />}
            {videoTrack != null ? <VideocamIcon color="warning" /> : <VideocamOffIcon color="warning" />}
            </div>

            {!playing && videoRef.current && videoRef.current.paused && hasVideo &&
            <div className="peer-stream-plug">
                <Button color="warning" variant='contained' onClick={play}>open video</Button>
            </div>
            }
        </div>
    );
}