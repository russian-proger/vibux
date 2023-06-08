import React from 'react';
import { Peer } from '../socket';

/**
 * 
 * @param {Peer[]} peers 
 */
export default function useVoiceStream(peers) {
    const [_cnt, forceUpdate] = React.useReducer(x => x + 1, 0);
    const stream = React.useMemo(() => new MediaStream(), []);

    React.useEffect(() => {
        let currTracks = stream.getAudioTracks();
        let newTracks = [];
        for (let peer of peers) {
            const tracks = peer.stream.getAudioTracks();
            if (tracks.length != 0) {
                newTracks.push(tracks[0]);
            }
        }

        for (let track of currTracks) {
            let res = newTracks.find(t => t.id == track.id);
            if (res == undefined) {
                stream.removeTrack(track);
            }
        }

        for (let track of newTracks) {
            let res = currTracks.find(t => t.id == track.id);
            if (res == undefined) {
                stream.addTrack(track);
            }
        }
    }, [peers]);

    return stream;
}