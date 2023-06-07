import React from 'react';
import { WebRTCManager } from '../socket';



export default function useWebRTC(conference_id) {

    const [webrtc] = React.useState(new WebRTCManager(conference_id));

    let streams = React.useMemo(() => {
        let result = [];
        for (let peer of webrtc.peers.values()) {
            result.push(peer);
        }
        return result;
    }, [webrtc.peers]);

    const updateStream = React.useCallback((stream) => {
        webrtc.updateStream(stream);
    });

    React.useEffect(() => () => {
        webrtc.destroy();
    }, [webrtc]);

    return [streams, updateStream];
}