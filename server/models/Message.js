const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema({
    type: {
        type: String,
        require: true,
        default: "text"
        /*
        text - просто текстовове сообщение
        attachment - вложение (файл)
         */
    },
    text: {
        type: String,
        require: true
    },
    attachments: [{
        type: Object
    }],
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat"
    },
    datetime: {
        type: Date,
        require: true
    },
    edited: {
        type: Boolean,
        default: false
    },
    deletedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
});

module.exports = mongoose.model("Message", MessageSchema);