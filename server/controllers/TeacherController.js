const Teacher = require("../models/Teacher");
const User = require("../models/User");
const mongoose = require("mongoose");

class TeacherController {
    async getAllTeachers(req, res, next){
        try {
            const teachers = await Teacher.aggregate([
                {
                    $lookup: {
                        from: "academicdisciplines",
                        localField: "disciplines",
                        foreignField: "_id",
                        as: "disciplines"
                    }
                },
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
                    $set: {
                        disciplines: {
                            $sortArray: {
                                input: "$disciplines",
                                sortBy: {
                                    name: 1
                                }
                            }
                        }
                    }
                },
                {
                    $unset: "user"
                },
                {
                    $sort: {
                        "disciplines.name": 1
                    }
                },
                {
                    $sort: {
                        surname: 1
                    }
                }
            ]);

            res.json(teachers);
        }catch (err){
            next(err);
        }
    }

    async addTeacher(req, res, next){
        try {
            const name = req.body.name;
            const surname = req.body.surname;
            const middlename = req.body.middlename;
            const disciplines = req.body.disciplines;

            const _id = new mongoose.Types.ObjectId();

            let newUser = await User.create({
                _id,
                name,
                surname,
                middlename,
                login: _id.toString(),
                roles: ["teacher"]
            });

            const added = await Teacher.create({
                user: _id,
                disciplines
            });

            res.json(added);
        }catch (err){
            next(err);
        }
    }
}

module.exports = new TeacherController();