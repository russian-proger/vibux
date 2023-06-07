import React from "react";
import "../css/conference.css";

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

import { Socket } from "../socket";

export default function Conference(props) {
  const params = useParams();
  const id = params.id;

  const [canAudio, setCanAudio] = React.useState(false);
  const [canVideo, setCanVideo] = React.useState(true);
  const [videoEnabled, setVideoEnabled] = React.useState(false);
  const [visibleChat, setVisibleChat] = React.useState(true);
  const [messages, setMessages] = React.useState([
    "ДНС",
    "31",
    "Меня магазин зовут",
    "Сокращенно, мага",
  ]);
  const [textfield, setTextField] = React.useState("");

  console.log(textfield);
  const LogOut = () => {
    //Code
  };

  const onSendMessage = () => {
    setMessages((prev) => [...prev, textfield]);
    // setInputRef();
    setTextField("");
  };

  const onTextField = (ev) => {
    setTextField(ev.target.value);
  };

  // /** @type {React.MutableRefObject<HTMLAudioElement>} */
  // const audioRef = React.useRef(null);

  // const [state, useState] = React.useState({
  //   socket: new Socket(id),
  // });

  // React.useLayoutEffect(() => {}, []);
  return (
    <div className="container">
      <div className="conversation">
        <div className="live">
          <div className="mainVideo">
            {canVideo && (
              <>
                <video
                  autoPlay
                  loop
                  muted={canVideo}
                  style={{ width: "100%", height: "100%", zIndex: "122" }}
                >
                  <source
                    src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
                    // type="/mp4"
                  />
                </video>
                <audio muted={!canAudio} />
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
                    muted={canVideo}
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
            {canAudio ? (
              <MicIcon onClick={() => setCanAudio(!canAudio)} />
            ) : (
              <MicOffIcon onClick={() => setCanAudio(!canAudio)} />
            )}
            {canVideo ? (
              <VideocamIcon onClick={() => setCanVideo(!canVideo)} />
            ) : (
              <VideocamOffIcon onClick={() => setCanVideo(!canVideo)} />
            )}
            <ChatIcon onClick={() => setVisibleChat(!visibleChat)} />
          </div>
          <div className="right_prop">
            <Button
              variant="contained"
              color="error"
              sx={{ height: "45px" }}
              className="exit_button"
              onClick={() => LogOut()}
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
