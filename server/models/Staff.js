const mongoose = require("mongoose");

const StaffSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    appointment: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model("Staff", StaffSchema);