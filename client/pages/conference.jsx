import React from "react";

import { useParams } from "react-router-dom";

import { WebRTCManager } from "../socket";

export default function Conference(props) {
  const params = useParams();
  const id = params.id;

  const manager = React.useMemo(() => new WebRTCManager(id), []);

  React.useLayoutEffect(() => {
    

    return () => {
      manager.destroy();
    }
  }, []);

  return <></>;
}
