const Curriculum = require("../models/Curriculum");
const mongoose = require("mongoose");

class CurriculumService {
    async getCurriculum(groupId){
        const curriculum = await Curriculum.aggregate([
            {
                $match: {
                    group: new mongoose.Types.ObjectId(groupId)
                }
            },
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
                    group: {
                        _id: 1,
                        name: 1
                    },
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
                $project: {
                    data: {
                        teacher: {
                            isFirstLogin: 0,
                            __v: 0,
                            login: 0,
                            password: 0
                        },
                        discipline: {
                            __v: 0
                        }
                    }
                }
            },
        ]);

        return curriculum[0];
    }
}

module.exports = new CurriculumService();