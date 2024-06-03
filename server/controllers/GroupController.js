const Group = require("../models/Group");
const config = require("../config");
const User = require("../models/User");
const Chat = require("../models/Chat");
const Teacher = require("../models/Teacher");
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
                const [surname, name, middlename] = student.initials.split(" ");
                const roles = ["student"];

                if (headman && student.id === headman) {
                    roles.push("headman");
                }

                const _id = new mongoose.Types.ObjectId();

                await User.create({
                    _id,
                    name,
                    surname,
                    middlename,
                    login: _id.toString(),
                    roles: roles,
                });

                studentIds.push(_id);
            }

            const teacherUser = await Teacher.findById(curator);
            await User.findByIdAndUpdate(teacherUser.user._id, {
                $addToSet: {
                    roles: ["curator"]
                }
            });

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

            const students = (await Group.findById(id)).students;

            await User.deleteMany({
                _id: {
                    $in: students
                }
            });
            const deleted = await Group.findByIdAndDelete(id);

            res.json(deleted);
        } catch (err) {
            next(err);
        }
    }

    async addStudent(req, res, next) {
        try {
            const groupId = req.params.id;
            const name = req.body.name;
            const surname = req.body.surname;
            const middlename = req.body.middlename;

            const _id = new mongoose.Types.ObjectId();

            const chatsToAddTo = await Chat.aggregate([
                {
                    $match: {
                        group: new mongoose.Types.ObjectId(groupId)
                    }
                },
                {
                    $project: {
                        _id: 1
                    }
                }
            ]);

            await Chat.updateMany({
                _id: {
                    $in: chatsToAddTo
                }
            }, {
                $push: {
                    users: _id
                }
            }, config.updateOptions);

            await User.create({
                _id,
                name,
                surname,
                middlename,
                login: _id.toString(),
                roles: ["student"],
            });

            const added = await Group.findByIdAndUpdate(groupId, {
                $addToSet: {
                    students: _id
                }
            }, config.updateOptions);

            res.json(added);
        } catch (err) {
            next(err);
        }
    }

    async deleteStudent(req, res, next) {
        try {
            const groupId = req.params.id;
            const studentId = req.body.studentId;

            await Group.findByIdAndUpdate(groupId, {
                $pull: {
                    students: studentId
                }
            }, config.updateOptions);

            const chatsToDeleteFrom = await Chat.aggregate([
                {
                    $match: {
                        group: new mongoose.Types.ObjectId(groupId)
                    }
                },
                {
                    $project: {
                        _id: 1
                    }
                }
            ]);

            await Chat.updateMany({
                _id: {
                    $in: chatsToDeleteFrom
                }
            }, {
                $pull: {
                    users: studentId
                }
            }, config.updateOptions);

            const deleted = await User.findByIdAndDelete(studentId);

            res.json(deleted);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new GroupController();