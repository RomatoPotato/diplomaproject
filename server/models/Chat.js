const mongoose = require("mongoose");

const ChatSchema = mongoose.Schema({
    name: {
        type: String
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    isMain: {
        type: Boolean,
        default: false
    },
    isGroup: {
        type: Boolean,
        require: true,
        default: false
    }
});

module.exports = mongoose.model("Chat", ChatSchema);