const mongoose = require("mongoose");

const VLSSchema = mongoose.Schema({
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
        unique: true
    },
    mainChat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat"
    },
    currentSemesterChats: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat"
    }]
});

module.exports = mongoose.model("VLS", VLSSchema);