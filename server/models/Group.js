const mongoose = require("mongoose");

const GroupSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
        unique: true
    },
    specialty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Specialty",
        require: true
    },
    year: {
        type: Number,
        require: true
    },
    curator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
        require: true
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
});

module.exports = mongoose.model("Group", GroupSchema);