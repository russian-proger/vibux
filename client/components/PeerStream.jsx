import React from 'react';

import {
    Box,
    Paper,
    Button
} from '@mui/material';

/**
 * @param {{
 * stream: MediaStream,
 * muted: boolean
 * }} props 
 */
export default function PeerStream(props) {
    const stream = props.stream;

    /** @type {React.MutableRefObject<HTMLVideoElement>} */
    const videoRef = React.useRef(null);

    const [playing, setPlaying] = React.useState(false);
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
        <div className="peer-stream-block">
            <video autoPlay key={stream.id} className={`${!hasVideo ? "hidden" : ""}`} muted={props.muted} ref={videoRef} />

            {!playing && videoRef.current && videoRef.current.paused && hasVideo &&
            <div className="peer-stream-plug">
                <Button onClick={play}>Показать трансляцию</Button>
            </div>
            }
        </div>
    );
}