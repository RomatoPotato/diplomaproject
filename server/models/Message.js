const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema({
    text: {
        type: String,
        require: true
    },
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
    }
});

module.exports = mongoose.model("Message", MessageSchema);