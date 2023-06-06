import React from "react";

import { useParams } from "react-router-dom";

import { Socket } from "../socket";

export default function Conference(props) {
  const params = useParams();
  const id = params.id;

  /** @type {React.MutableRefObject<HTMLAudioElement>} */
  const audioRef = React.useRef(null);

  const [state, useState] = React.useState({
    socket: new Socket(id),
  });

  React.useLayoutEffect(() => {}, []);

  return <audio ref={audioRef} />;
}
