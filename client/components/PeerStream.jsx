import React from 'react';

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



    React.useLayoutEffect(() => {
        // videoRef.current.srcObject = stream;
        
    }, [stream.id]);

    return (
        <video key={stream.id} autoPlay loop muted={props.muted} ref={videoRef} />
    );
}