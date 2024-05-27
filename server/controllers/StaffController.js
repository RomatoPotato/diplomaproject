const Staff = require("../models/Staff");
const User = require("../models/User");
const mongoose = require("mongoose");

class StaffController {
    async getAllStaff(req, res, next){
        try {
            const staff = await Staff.aggregate([
                {
                    $lookup: {
                        from: "users",
                        localField: "user",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                {
                    $unwind: "$user"
                },
                {
                    $set: {
                        userId: "$user._id",
                        name: "$user.name",
                        surname: "$user.surname",
                        middlename: "$user.middlename"
                    }
                },
                {
                    $unset: "user"
                },
                {
                    $sort: {
                        surname: 1
                    }
                }
            ]);

            res.json(staff);
        }catch (err){
            next(err);
        }
    }

    async addStaff(req, res, next){
        try {
            const name = req.body.name;
            const surname = req.body.surname;
            const middlename = req.body.middlename;
            const appointment = req.body.appointment;

            const _id = new mongoose.Types.ObjectId();

            await User.create({
                _id,
                name,
                surname,
                middlename,
                login: _id.toString(),
                roles: ["staff"]
            });

            const added = await Staff.create({
                user: _id,
                appointment
            });

            res.json(added);
        }catch (err){
            next(err);
        }
    }

    async deleteStaff(req, res, next){
        try {
            const id = req.params.id;

            const deleted = await Staff.findByIdAndDelete(id);

            res.json(deleted);
        }catch (err){
            next(err);
        }
    }
}

module.exports = new StaffController();