const mongoose = require("mongoose");

const SpecialtySchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
        unique: true
    }
});

module.exports = mongoose.model("Specialty", SpecialtySchema);