const { io } = require('socket.io-client');

// const socket = io('ws://localhost:80/socket.io');
const socket = io();
console.log(socket);
