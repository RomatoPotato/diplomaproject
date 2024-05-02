const mongoose = require("mongoose");

const AcademicDisciplineSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
        unique: true
    }
});

module.exports = mongoose.model("AcademicDiscipline", AcademicDisciplineSchema);