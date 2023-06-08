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

  this.stream = new MediaStream();

  this.connection = new RTCPeerConnection({
    iceServers: [
      // {urls: 'stun:stun.stunprotocol.org:3478'},
      {urls: 'stun:stun.l.google.com:19302'},
      {urls: 'turn:turn.vibux.ru:3478', username: 'user', credential: 'pwd'}
    ]
  });

  this.connection.createDataChannel("connection");

  this.connection.addEventListener('track', (ev) => {
    const newStream = new MediaStream(this.stream);
    if (ev.track.kind == 'audio') {
      for (let track of newStream.getAudioTracks()) {
        newStream.removeTrack(track);
      }
    } else if (ev.track.kind == 'video') {
      for (let track of newStream.getVideoTracks()) {
        newStream.removeTrack(track);
      }
    }

    newStream.addTrack(ev.track);
    this.stream = newStream;
  });
}

function WebRTCManager(conference_id) {
  this.onaddpeer = () => {}
  this.onremovepeer = () => {}
  this.onupdate = () => {}

  this.socket = io(options);

  this.stream = new MediaStream();

  /** @type {Map<string,Peer>} */
  this.peers = new Map();

  this.createPeer = (sid, nickname) => {
    if (!this.peers.has(sid)) {
      const peer = new Peer(sid, nickname);
      this.peers.set(sid, peer);

      // Adding tracks
      for (let track of this.stream.getTracks()) {
        peer.connection.addTrack(track);
      }

      // Handler to send ICE packet
      peer.connection.onicecandidate = (ev) => {
        this.socket.emit(Actions.RELAY_ICE, {
          destination: sid,
          candidate: ev.candidate
        })
      }

      peer.connection.onnegotiationneeded = () => {
        this.connectPeer({sid, nickname})
      }

      peer.connection.addEventListener('track', this.onupdate);
    }

    const peer = this.peers.get(sid);
    return peer;
  }

  this.connectPeer = async ({sid, nickname}) => {
    // console.info(Actions.ADD_PEER, sid, nickname);

    const peer = this.createPeer(sid, nickname)

    const offer = await peer.connection.createOffer();
    await peer.connection.setLocalDescription(offer);
  
    this.socket.emit(Actions.RELAY_SDP, {
      destination: sid,
      sessionDescription: peer.connection.localDescription
    });

    this.onupdate();
  }


  this.updateStream = (newStream) => {
    this.stream = newStream;

    for (let peer of this.peers.values()) {
      for (let sender of peer.connection.getSenders()) {
        peer.connection.removeTrack(sender);
      }
      for (let track of this.stream.getTracks()) {
        peer.connection.addTrack(track);
      }
      peer.connection.restartIce();
    }
  }

  // Socket Handlers
  this.socket.on("connect", () => {
    this.socket.emit(Actions.JOIN, {
      room: `conference:${conference_id}`,
    });
  });

  // Add new peer
  this.socket.on(Actions.ADD_PEER, ({sid, nickname}) => {
    this.createPeer(sid, nickname);
    this.onupdate();
  });

  // Remove peer
  this.socket.on(Actions.REMOVE_PEER, ({sid, nickname}) => {
    // console.info(Actions.REMOVE_PEER, sid, nickname);

    // Close peer connection
    if (this.peers.has(sid)) {
      this.peers.get(sid).connection.close();
      this.peers.delete(sid);
      this.onupdate();
    }
  })

  // Receiving SDP
  this.socket.on(Actions.RELAY_SDP, async ({
    sid,
    nickname,
    sessionDescription: remoteDescription
  }) => {
    if (remoteDescription.type == 'offer') {
      const peer = this.createPeer(sid, nickname);
      peer.stream = new MediaStream();

      await peer.connection.setRemoteDescription(remoteDescription);

      const answer = await peer.connection.createAnswer();
      await peer.connection.setLocalDescription(answer)

      this.socket.emit(Actions.RELAY_SDP, {
        destination: sid,
        sessionDescription: peer.connection.localDescription
      });
    } else {
      const peer = this.peers.get(sid);
      await peer.connection.setRemoteDescription(remoteDescription);
    }
    this.onupdate();
  })

  // Receiving ICE
  this.socket.on(Actions.RELAY_ICE, async ({sid, nickname, candidate }) => {
      /** @type {Peer} */
      const peer = this.peers.get(sid);
      peer.connection.addIceCandidate(candidate);
  });

  this.destroy = () => {
    for (let peer of this.peers.values()) {
      peer.connection.close();
    }
    this.socket.close();
  }
}

export { Actions, WebRTCManager, Peer };
