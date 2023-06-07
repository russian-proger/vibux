import React from 'react';

import {Peer} from '../socket';

export default function PeerMonitor(props) {

    /** @type {Peer} */
    const peer = props.peer;

    /** @type {HTMLVideoElement} */
    const videoRef = React.useRef(null);



    <>
        <video ref={videoRef} />
    </>
}