import { io } from "socket.io-client";

import Actions from "./actions";

const options = {
  "force new connection": true,
  reconnectionAttempts: "Infinity", // avoid having user reconnect manually in order to prevent dead clients after a server restart
  timeout: 10000, // before connect_error and connect_timeout are emitted.
  transports: ["websocket"],
};

/**
 * @param {string} sid
 * @param {string} nick
 * @property {string} sid
 */
function Peer(sid, nick) {
  this.sid = sid;
  this.nick = nick;

  this.connection = new RTCPeerConnection({
    iceServers: [
      {urls: 'stun:stun.stunprotocol.org:3478'},
      {urls: 'stun:stun.l.google.com:19302'},
      {urls: 'turn:turn.vibux.ru:3478', username: 'user', credential: 'pwd'}
    ]
  });

  this.connection.ontrack = (ev) => {
    const video = document.createElement("video");
    console.log(ev.track);
    document.body.appendChild(video);
    video.srcObject = new MediaStream([ev.track]);
    video.play();
  }
}

function WebRTCManager(conference_id) {
  this.ondisconnect = () => {}

  this.socket = io(options);

  this.constraints = {
    audio: true,
    video: false
  };

  this.audioTrack = null;
  this.videoTracks = [];

  this.attemptUserMedia = () => {
    navigator.mediaDevices.getUserMedia(this.constraints).then((stream) => {
      this.audioTrack = stream.getAudioTracks()[0];
      console.log(this.audioTrack)
    });
  }

  /** @type {Map<string,Peer>} */
  this.peers = new Map();

  this.socket.on("connect", (...args) => {
    this.socket.emit(Actions.JOIN, {
      room: `conference:${conference_id}`,
    });
  });

  this.socket.on("disconnect", this.ondisconnect);

  // Add new peer
  this.socket.on(Actions.ADD_PEER, async ({sid, nickname}) => {
    const peer = new Peer(sid, nickname);
    this.peers[sid] = peer;

    if (this.audioTrack != null) {
      peer.connection.addTrack(this.audioTrack);
    }

    peer.connection.onicecandidate = (ev) => {
      this.socket.emit(Actions.RELAY_ICE, {
        destination: sid,
        candidate: ev.candidate
      })
    }

    const offer = await peer.connection.createOffer();
    await peer.connection.setLocalDescription(offer);
  
    this.socket.emit(Actions.RELAY_SDP, {
      destination: sid,
      sessionDescription: peer.connection.localDescription
    });
  });

  this.socket.on(Actions.REMOVE_PEER, ({sid, nickname}) => {
    console.log(Actions.REMOVE_PEER, sid, nickname);
  })



  // Receiving SDP
  this.socket.on(Actions.RELAY_SDP, async ({
    sid,
    nickname,
    sessionDescription: remoteDescription
  }) => {

    if (remoteDescription.type == 'offer') {
      const peer = new Peer(sid, nickname);
      this.peers[sid] = peer;
      if (this.audioTrack != null) {
        peer.connection.addTrack(this.audioTrack);
      }
      await peer.connection.setRemoteDescription(remoteDescription);

      peer.connection.onicecandidate = (ev) => {
        this.socket.emit(Actions.RELAY_ICE, {
          destination: sid,
          candidate: ev.candidate
        })
      }

      const answer = await peer.connection.createAnswer();
      await peer.connection.setLocalDescription(answer)

      this.socket.emit(Actions.RELAY_SDP, {
        destination: sid,
        sessionDescription: peer.connection.localDescription
      });

    } else {
      const peer = this.peers[sid];
      await peer.connection.setRemoteDescription(remoteDescription);

    }
  })

  // Receiving ICE
  this.socket.on(Actions.RELAY_ICE, async ({sid, nickname, candidate }) => {
      /** @type {Peer} */
      const peer = this.peers[sid];
      peer.connection.addIceCandidate(candidate);
  });

  this.destroy = () => {
    this.socket.close();
  }

  this.attemptUserMedia();
}

export { Actions, WebRTCManager, Peer };
