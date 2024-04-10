const io = require("socket.io-client");
const config = require("../config");

const URL = `${config.server.host}:${config.server.port}`;

const socket = io(URL, {
    autoConnect: false
});

socket.onAny((event, ...args) => {
    console.log(event, args);
});

export default socket;