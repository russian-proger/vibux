import React from 'react';
import { WebRTCManager } from '../socket';

export default function useWebRTC(conference_id) {
    const [_version, forceUpdate] = React.useReducer(x => x + 1, 0);
    const webrtc = React.useMemo(() => new WebRTCManager(conference_id), [conference_id]);

    const peers = React.useMemo(() => {
        let result = [];
        for (let peer of webrtc.peers.values()) {
            result.push(peer);
        }
        return result;
    });

    const updateStream = React.useCallback((stream) => {
        webrtc.updateStream(stream);
        webrtc.onupdate = forceUpdate;
    }, [webrtc]);

    React.useEffect(() => () => {
        webrtc.destroy();
    }, [webrtc]);

    return [peers, updateStream];
}