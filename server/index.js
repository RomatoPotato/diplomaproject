const cors = require("cors");
const express = require("express");
const {createServer} = require("http");
const {Server} = require("socket.io");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

require("dotenv").config();
const config = require("./config");

const usersRoute = require("./routes/users_route");
const eiRoute = require("./routes/ei_route");
const chatRoute = require("./routes/chat_route");
const errorMiddleware = require("./middlewares/ErrorMiddleware");

const app = express();
const httpServer = createServer(app);
const client_url = `${config.client.host}:${config.client.port}`;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: client_url
}));

app.use("/api/users", usersRoute);
app.use("/api/ei", eiRoute);
app.use("/api/chats", chatRoute);

app.use(errorMiddleware);

const io = new Server(httpServer, {
    cors: {
        origin: client_url
    }
});

(async () => {
    try {
        await mongoose.connect(config.mongo.db_url);
    } catch (e) {
        console.error("ERROR!!!: " + e);
    }
})();

io.use((socket, next) => {
    const user = socket.handshake.auth.user;

    socket.user = user;

    next();
});

io.on("connection", (socket) => {
    console.log(`User ${socket.user.name} ${socket.user.surname} connected!`)
    socket.join(socket.user._id);

    socket.on("join_room", (room) => {
        socket.join(room);
    });

    socket.on("check users", () => {
        const users = [];
        for (let [_, socket] of io.of("/").sockets){
            users.push(socket.user);
        }

        socket.emit("users", users);
    });

    socket.broadcast.emit("user connected", socket.user);

    socket.on("disconnect", async () => {
        const matchingSockets = await io.in(socket.user._id).allSockets();
        const isDisconnected = matchingSockets.size === 0;

        if (isDisconnected) {
            socket.broadcast.emit("user disconnected", socket.user._id);
            console.log(`User ${socket.user.name} ${socket.user.surname} disconnected!`)
        }
    });

    socket.on("message", ({text, to, date}) => {
        socket.to(to).emit("message", {
            text: text,
            from: socket.user._id,
            to: to,
            date: date
        });
    });
});

httpServer.listen(config.server.port);