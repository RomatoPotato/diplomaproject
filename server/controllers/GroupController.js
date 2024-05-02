const Group = require("../models/Group");
const config = require("../config");
const User = require("../models/User");
const mongoose = require("mongoose");
const groupServce = require("../services/GroupsService");

class GroupController {
    async getAllGroups(req, res, next) {
        try {
            const groups = await Group.aggregate([
                {
                    $lookup: {
                        from: "specialties",
                        localField: "specialty",
                        foreignField: "_id",
                        as: "specialty"
                    }
                },
                {
                    $unwind: "$specialty"
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "students",
                        foreignField: "_id",
                        as: "students"
                    }
                },
                {
                    $lookup: {
                        from: "teachers",
                        localField: "curator",
                        foreignField: "_id",
                        as: "curator"
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "curator.user",
                        foreignField: "_id",
                        as: "curator"
                    }
                },
                {
                    $unwind: "$curator"
                },
                {
                    $set: {
                        students: {
                            $sortArray: {
                                input: "$students",
                                sortBy: {
                                    surname: 1
                                }
                            }
                        }
                    }
                },
                {
                    $project: {
                        students: {
                            isFirstLogin: 0,
                            login: 0,
                            password: 0,
                        },
                        curator: {
                            isFirstLogin: 0,
                            login: 0,
                            password: 0
                        }
                    }
                },
                {
                    $sort: {
                        year: 1
                    }
                }
            ]);

            res.json(groups);
        } catch (err) {
            next(err);
        }
    }

    async getGroup(req, res, next) {
        try {
            const groupId = req.params.id;

            const group = await groupServce.getGroup(groupId);

            res.json(group);
        } catch (err) {
            next(err);
        }
    }

    async addGroup(req, res, next) {
        try {
            const name = req.body.name;
            const specialty = req.body.specialty;
            const year = req.body.year;
            const students = req.body.students;
            const headman = req.body.headman;
            const curator = req.body.curator;

            const studentIds = [];
            for (const student of students) {
                const [surname, name, middlename] = student.split(" ");
                const roles = ["student"];

                if (student === headman) {
                    roles.push("headman");
                }

                const _id = new mongoose.Types.ObjectId();

                const newStudent = await User.create({
                    _id,
                    name,
                    surname,
                    middlename,
                    login: _id.toString(),
                    roles: roles,
                });

                studentIds.push(_id);
            }

            const added = await Group.create({
                name,
                specialty,
                year,
                curator,
                students: studentIds
            });

            res.json(added);
        } catch (err) {
            next(err);
        }
    }

    async editGroup(req, res, next) {
        try {
            const id = req.body.id;
            const name = req.body.name;
            const specialty = req.body.specialty;
            const year = req.body.year;

            const edited = await Group.findByIdAndUpdate(id, {
                name,
                specialty,
                year
            }, config.updateOptions);

            res.json(edited);
        } catch (err) {
            next(err);
        }
    }

    async deleteGroup(req, res, next) {
        try {
            const id = req.params.id;
            const deleted = await Group.findByIdAndDelete(id);

            res.json(deleted);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new GroupController();