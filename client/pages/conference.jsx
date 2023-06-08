import React from 'react';
import * as ReactRouter from 'react-router-dom';
import '../css/conference.css';

import {
  Box,
  Button,
  Paper,
  Container,
  Typography,
  Grid,
  Avatar,
  TextField,
  IconButton,
} from "@mui/material";

import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import ChatIcon from "@mui/icons-material/Chat";
import SendIcon from "@mui/icons-material/Send";
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import CastIcon from '@mui/icons-material/Cast';

import { useParams } from "react-router-dom";

import { WebRTCManager } from "../socket";

import useChat from '../hooks/useChat';
import useMedia from '../hooks/useMedia';
import useWebRTC from '../hooks/useWebRTC';
import PeerMonitor from '../components/PeerMonitor.jsx';
import useVoiceStream from '../hooks/useVoiceStream';
import MainPeerStream from '../components/MainPeerStream.jsx';

export default function Conference(props) {
  const params = useParams();
  const id = params.id;

  const navigate = ReactRouter.useNavigate();

  const [peers, updateStream, webrtc] = useWebRTC(id);
  const userMedia = useMedia();

  const renderPeers = [{nick: 'Me', stream: userMedia.stream, sid: "__me__"}, ...peers];

  const [selectedPeer, selectPeer] = React.useState(null);

  const [messages, appendMessage] = useChat(webrtc.socket);

  const [voiceStreamEnabled, setVoiceStreamEnabled] = React.useState(false);

  const voiceStream = useVoiceStream(peers);

  /** @type {React.MutableRefObject<HTMLAudioElement>} */
  const audioStreamEl = React.useRef(null);

  const [visibleChat, setVisibleChat] = React.useState(true);
  const [textfield, setTextField] = React.useState("");

  React.useEffect(() => {
    updateStream(userMedia.stream);
  }, [userMedia.stream]);

  // React.useEffect(() => {
  //   audioStreamEl.current.srcObject = voiceStream;
  // }, [voiceStream]);

  const enableVoiceStream = () => {
    const audioEl = audioStreamEl.current;
    if (audioEl.paused) {
      audioEl.currentTime = 0;
      audioEl.srcObject = voiceStream;
      audioEl.play();
    }
    setVoiceStreamEnabled(true);
  }

  const disableVoiceStream = () => {
    const audioEl = audioStreamEl.current;
    if (!audioEl.paused) {
      // audioEl.pause();
      audioEl.srcObject = null;
    }
    setVoiceStreamEnabled(false);
  }

  React.useEffect(() => {

    // console.log(voiceStream);
  }, [voiceStream]);

  const logout = () => {
    navigate('/');
  };

  const onSendMessage = () => {
    appendMessage(textfield);
    setTextField("");
  };

  const onTextField = (ev) => {
    setTextField(ev.target.value);
  };

  const audioComponent = React.useMemo(() => (
    <audio autoPlay key={voiceStream.id} className="hidden" ref={audioStreamEl} />
  ), [voiceStream]);

  const streamMonitorsComponent = React.useMemo(() => (
    <>
     {
      renderPeers.map(peer => (
        <PeerMonitor key={peer.sid} selected={selectedPeer && peer.sid == selectedPeer.sid} onSelect={(peer) => selectPeer(peer)} peer={peer} />
      ))
     }
    </>
  ));

  return (
    <div className="container">
      <div className="conversation">
        <div className="live">
          <div className="mainVideo">
            {selectedPeer && (
              <MainPeerStream muted={true} peer={selectedPeer} />
            )}
          </div>
          <div className="streamers-wrap">
            
            <div className="streamers">
              {streamMonitorsComponent}
            </div>
          </div>
        </div>
        <div className="properites">
          <div className="left_prop">
            {userMedia.mode.audio ? (
              <MicIcon onClick={userMedia.toggleAudio} />
            ) : (
              <MicOffIcon onClick={userMedia.toggleAudio} />
            )}
            {userMedia.mode.video ? (
              <VideocamIcon onClick={userMedia.toggleVideo} />
            ) : (
              <VideocamOffIcon onClick={userMedia.toggleVideo} />
            )}
            {voiceStreamEnabled ? (
              <VolumeUpIcon onClick={disableVoiceStream} />
            ) : (
              <VolumeOffIcon onClick={enableVoiceStream} />
            )}
            {!userMedia.mode.video && navigator.mediaDevices.getDisplayMedia && (
              <CastIcon onClick={userMedia.shareDisplay} />
            )}
            <ChatIcon onClick={() => setVisibleChat(!visibleChat)} />
          </div>
          <div className="right_prop">
            <Button
              variant="contained"
              color="error"
              sx={{ height: "45px" }}
              className="exit_button"
              onClick={logout}
            >
              Exit
            </Button>
          </div>
        </div>
      </div>
      {visibleChat ? (
        <div className="chat-active">
          <div className="textArea">
            {messages.map(([nick, message], index) => (
              <div key={index} className="messageBox">
                <Avatar>{nick[0]}</Avatar>
                <div className="message">
                  <Typography sx={{ fontSize: "18px" }}>{nick}</Typography>
                  <Typography>{message}</Typography>
                </div>
              </div>
            ))}
          </div>
          <div className="sendMessage">
            <TextField
              placeholder="Write..."
              value={textfield}
              size="small"
              // ref={inputRef}
              onChange={(ev) => onTextField(ev)}
              sx={{
                margin: "10px",
                background: "rgb(251, 251, 251)",
                color: "white",
              }}
            />
            <Button
              variant="contained"
              sx={{ height: "40px" }}
              endIcon={<SendIcon />}
              // sx={{ margin: "0 10px" }}
              onClick={() => onSendMessage()}
            >
              Send
            </Button>
          </div>
        </div>
      ) : (
        <div className="chat-disabled"></div>
      )}
      {audioComponent}
    </div>
  );
}
