const cors = require("cors");
const express = require("express");
const {createServer} = require("http");
const {Server} = require("socket.io");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

require("dotenv").config();
const config = require("./config");

const usersRoute = require("./routes/users_route");
const vlssRoute = require("./routes/vlss_route");
const chatsRoute = require("./routes/chats_route");
const groupsRoute = require("./routes/groups_route");
const adsRoute = require("./routes/ads_route");
const specialtiesRoute = require("./routes/specialties_route");
const teachersRoute = require("./routes/teachers_route");
const curriculumRoute = require("./routes/curriculum_route");
const staffRoute = require("./routes/staff_route");
const rolesRoute = require("./routes/roles_route");
const messagesRoute = require("./routes/messages_route");
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
app.use("/api/vlss", vlssRoute);
app.use("/api/chats", chatsRoute);
app.use("/api/groups", groupsRoute);
app.use("/api/academicDisciplines", adsRoute);
app.use("/api/specialties", specialtiesRoute);
app.use("/api/teachers", teachersRoute);
app.use("/api/curriculums", curriculumRoute);
app.use("/api/staff", staffRoute);
app.use("/api/roles", rolesRoute);
app.use("/api/messages", messagesRoute);

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
    socket.user = socket.handshake.auth.user;
    socket.groups = [];

    next();
});

io.on("connection", (socket) => {
    console.log(`User ${socket.user.name} ${socket.user.surname} connected!`)
    socket.join(socket.user._id);

    socket.on("join_room", (room) => {
        socket.join(room);
        socket.groups.push(room);
    });

    socket.on("check users", () => {
        const users = [];
        for (let [, socket] of io.of("/").sockets){
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

    socket.on("message", (message) => {
        socket.to(message.to).emit("message", {
            ...message,
            from: socket.user._id
        });
    });

    socket.on("mailing", ({chats, messages}) => {
        for (const chat of chats){
            socket.to(chat).emit("mailing", messages.filter(message => message.chatId === chat));
        }
    });

    socket.on("delete message", (messageData) => {
        socket.to(messageData.message.chatId).emit("delete message", messageData);
    });

    socket.on("delete messages", (messagesData) => {
        socket.to(messagesData[0].message.chatId).emit("delete messages", messagesData);
    });

    socket.on("edit message", ({messageData, text}) => {
        socket.to(messageData.message.chatId).emit("edit message", {
            messageData,
            text
        });
    });
});

httpServer.listen(config.server.port);