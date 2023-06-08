import React from 'react';

import {Peer} from '../socket';

import PeerStream from '../components/PeerStream.jsx';

export default function PeerMonitor(props) {
    /** @type {Peer} */
    const peer = props.peer;

    /** @type {HTMLVideoElement} */
    const videoRef = React.useRef(null);

    return (
        <PeerStream stream={peer.stream} />
    );
}