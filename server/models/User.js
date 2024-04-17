const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    surname: {
        type: String,
        require: true,
    },
    login: {
        type: String,
        sparse: true
    },
    password: {
        type: String,
    },
    isFirstLogin: {
        type: Boolean,
        default: true
    },
    role: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model("User", UserSchema);