import {io} from 'socket.io-client';

import Actions from './actions';

const options = {
    "force new connection": true,
    reconnectionAttempts: "Infinity", // avoid having user reconnect manually in order to prevent dead clients after a server restart
    timeout : 10000, // before connect_error and connect_timeout are emitted.
    transports : ["websocket"]
}

function Socket(conference_id) {
    this.socket = io(options);

    this.socket.on('connect', (...args) => {
        this.socket.emit(Actions.JOIN, {
            room: `conference:${conference_id}`
        })
    })
}

export {
    Actions,
    Socket,
};