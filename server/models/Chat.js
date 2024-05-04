const mongoose = require("mongoose");

const ChatSchema = mongoose.Schema({
    name: {
        type: String
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    type: {
        type: String
    },
    /*
        Тип чата:
            dialog - чат между 2 людьми
            group - группа, беседа
            mainGroup - главная учебная группа (с админами и куратором)
            studyGroup - учебная группа (где только 1 учитель, а остальные - студенты)
     */
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
        default: null
    }
});

module.exports = mongoose.model("Chat", ChatSchema);