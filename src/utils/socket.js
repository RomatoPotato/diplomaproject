const io = require("socket.io-client");
const config = require("../config");

const URL = config.server.url;

const socket = io(URL, {
    autoConnect: false
});

/*socket.onAny((event, ...args) => {
    console.log(event, args);
});*/

export default socket;