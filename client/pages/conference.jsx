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
} from "@mui/material";

import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import ChatIcon from "@mui/icons-material/Chat";
import SendIcon from "@mui/icons-material/Send";

import { useParams } from "react-router-dom";

import { WebRTCManager } from "../socket";

import useChat from '../hooks/useChat';
import useMedia from '../hooks/useMedia';
import useWebRTC from '../hooks/useWebRTC';

export default function Conference(props) {
  const params = useParams();
  const id = params.id;

  const navigate = ReactRouter.useNavigate();

  const [streams, updateStream] = useWebRTC(1);
  const userMedia = useMedia();

  const [messages, appendMessage] = useChat();

  const [audioEnabled, setAudioEnabled] = React.useState(false);
  const [videoEnabled, setVideoEnabled] = React.useState(true);
  const [visibleChat, setVisibleChat] = React.useState(true);
  const [textfield, setTextField] = React.useState("");

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

  return (
    <div className="container">
      <div className="conversation">
        <div className="live">
          <div className="mainVideo">
            {videoEnabled && (
              <>
                <video
                  autoPlay
                  loop
                  muted={videoEnabled}
                  style={{ width: "100%", height: "100%", zIndex: "122" }}
                >
                  <source
                    src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
                    // type="/mp4"
                  />
                </video>
              </>
            )}
          </div>
          <div className="streamers">
            {new Array(4).fill("1").map((obj, index) => (
              <div className="streamer" key={index}>
                {videoEnabled ? (
                  <video
                    autoPlay
                    loop
                    muted={videoEnabled}
                    style={{ width: "100%", height: "100%", zIndex: "122" }}
                    src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
                  />
                ) : (
                  <img
                    style={{ width: "100%", height: "100%", zIndex: "122" }}
                    src="https://vdostavka.ru/wp-content/uploads/2019/05/no-avatar.png"
                  />
                )}

                <audio />
              </div>
            ))}
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
            {messages.map((obj, index) => (
              <div key={index} className="messageBox">
                <Avatar>D</Avatar>
                <div className="message">
                  <Typography sx={{ fontSize: "18px" }}>Daniel</Typography>
                  <Typography>{obj}</Typography>
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
    </div>
  );
}
