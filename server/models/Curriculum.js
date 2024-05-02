const mongoose = require("mongoose");

const CurriculumSchema = mongoose.Schema({
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
        require: true,
        unique: true
    },
    academicStartYear: {
        type: Number,
        require: true
    },
    semestersNumber: {
        type: Number,
        require: true
    },
    disciplines: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "AcademicDiscipline",
        require: true
    }],
    teachers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
        require: true
    }],
    counts: [{
        type: Number,
        require: true
    }]
});

module.exports = mongoose.model("Curriculum", CurriculumSchema);