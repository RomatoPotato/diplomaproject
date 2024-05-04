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
    middlename: {
        type: String
    },
    login: {
        type: String,
        unique: true
    },
    password: {
        type: String,
    },
    isFirstLogin: {
        type: Boolean,
        default: true
    },
    icon: {
        type: String,
        require: true,
        default: null
    },
    roles: [{
        type: String,
        require: true
    }]
});

module.exports = mongoose.model("User", UserSchema);