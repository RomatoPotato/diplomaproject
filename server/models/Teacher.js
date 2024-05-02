const mongoose = require("mongoose");

const TeacherSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true,
        unique: true
    },
    disciplines: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "AcademicDiscipline"
    }]
});

module.exports = mongoose.model("Teacher", TeacherSchema);