import React from 'react';

const emptyStream = new MediaStream();

export default function useMedia() {
    const [stream, setStream] = React.useState(emptyStream);

    // Waiting for giving permission to audio/video channel
    const [waiting, setWaiting] = React.useState(false);

    const mode = ({
        audio: stream.getAudioTracks().length != 0,
        video: stream.getVideoTracks().length != 0,
    });

    const getUserMedia = React.useCallback((constraints) => {
        if (waiting) return false;
        setWaiting(true);

        // If no input channels
        if (!constraints.audio && !constraints.video) {
            setStream(emptyStream);
            setWaiting(false);
        }
        else {
            navigator.mediaDevices.getUserMedia(constraints).then(stream => {
                setStream(stream);
                setWaiting(false);
            })
        }
    }, [waiting, stream]);

    const toggleAudio = React.useCallback(() => {
        return getUserMedia({...mode, audio: !mode.audio});
    }, [waiting, stream]);

    const toggleVideo = React.useCallback(() => {
        return getUserMedia({...mode, video: !mode.video});
    }, [waiting, stream]);

    const shareDisplay = React.useCallback(() => {
        navigator.mediaDevices.getDisplayMedia().then(displayStream => {
            let newStream = new MediaStream();
            for (let track of stream.getTracks()) {
                newStream.addTrack(track);
            }
            for (let track of displayStream.getTracks()) {
                newStream.addTrack(track);
            }
            setStream(newStream);
            console.log(displayStream);
        });
    }, [waiting, stream]);

    React.useEffect(() => () => {

        // Clear previous stream
        for (let track of stream.getTracks()) {
            track.stop();
        }

    }, [stream]);

    return {
        mode,
        stream,
        toggleAudio,
        toggleVideo,
        shareDisplay
    }
}