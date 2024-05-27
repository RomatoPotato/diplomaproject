const Curriculum = require("../models/Curriculum");
const curriculumService = require("../services/CurriculumService");

class CurriculumController {
    async getAllCurriculums(req, res, next) {
        try {
            const curriculum = await Curriculum.aggregate([
                {
                    $lookup: {
                        from: "groups",
                        localField: "group",
                        foreignField: "_id",
                        as: "group"
                    }
                },
                {
                    $unwind: "$group"
                },
                {
                    $project: {
                        group: 1,
                        counts: 1,
                        academicStartYear: 1,
                        semestersNumber: 1,
                        data: {
                            $map: {
                                input: {
                                    $zip: {
                                        inputs: ["$teachers", "$disciplines"]
                                    }
                                },
                                as: "elem",
                                in: {
                                    teacher: {
                                        $arrayElemAt: ["$$elem", 0]
                                    },
                                    discipline: {
                                        $arrayElemAt: ["$$elem", 1]
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    $unwind: "$data"
                },
                {
                    $lookup: {
                        from: "academicdisciplines",
                        localField: "data.discipline",
                        foreignField: "_id",
                        as: "data.discipline"
                    }
                },
                {
                    $unwind: "$data.discipline"
                },
                {
                    $lookup: {
                        from: "teachers",
                        localField: "data.teacher",
                        foreignField: "_id",
                        as: "data.teacher"
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "data.teacher.user",
                        foreignField: "_id",
                        as: "data.teacher"
                    }
                },
                {
                    $unwind: "$data.teacher"
                },
                {
                    $group: {
                        _id: "$group",
                        curriculumId: {
                            $first: "$_id"
                        },
                        academicStartYear: {
                            $first: "$academicStartYear"
                        },
                        semestersNumber: {
                            $first: "$semestersNumber"
                        },
                        data: {
                            $push: "$data"
                        },
                        counts: {
                            $first: "$counts"
                        }
                    }
                },
                {
                    $addFields: {
                        group: "$_id",
                        _id: "$curriculumId"
                    }
                },
                {
                    $project: {
                        group: 1,
                        data: {
                            teacher: {
                                _id: 1,
                                name: 1,
                                surname: 1,
                                middlename: 1
                            },
                            discipline: 1
                        },
                        counts: 1,
                        academicStartYear: 1,
                        semestersNumber: 1,
                    }
                },
                {
                    $sort: {
                        "_id.name": 1
                    }
                }
            ]);

            res.json(curriculum);
        } catch (err) {
            next(err);
        }
    }

    async getCurriculum(req, res, next) {
        try {
            const groupId = req.params.groupId;
            const curriculum = await curriculumService.getCurriculum(groupId);

            res.json(curriculum);
        } catch (err) {
            next(err);
        }
    }

    async checkCurriculum(req, res, next) {
        try {
            const groupId = req.params.groupId;

            const checked = await Curriculum.findOne({
                group: groupId
            });

            res.json({
                exists: checked !== null,
                id: checked ? checked._id : null
            });
        } catch (err) {
            next(err);
        }
    }

    async addCurriculum(req, res, next) {
        try {
            const group = req.body.group;
            const academicStartYear = req.body.academicStartYear;
            const semestersNumber = req.body.semestersNumber;
            const disciplines = req.body.disciplines;
            const teachers = req.body.teachers;
            const counts = req.body.counts;

            const added = await Curriculum.create({
                group,
                academicStartYear,
                semestersNumber,
                disciplines,
                teachers,
                counts
            });

            res.json(added);
        } catch (err) {
            next(err);
        }
    }

    async editCurriculum(req, res, next) {
        try {

        } catch (err) {
            next(err);
        }
    }

    async deleteCurriculum(req, res, next) {
        try {
            const id = req.params.id;

            const deleted = await Curriculum.findByIdAndDelete(id);

            res.json(deleted);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new CurriculumController();