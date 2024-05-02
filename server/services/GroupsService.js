const Group = require("../models/Group");
const mongoose = require("mongoose");

class GroupsService {
    async getGroup(id){
        const group = await Group.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(id)
                }
            },
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
                    specialty: {
                        __v: 0
                    },
                    students: {
                        //isFirstLogin: 0, # Не убирать, нужен для проверки при генерации пароля
                        login: 0,
                        password: 0,
                        __v: 0
                    },
                    curator: {
                        isFirstLogin: 0,
                        login: 0,
                        password: 0,
                        __v: 0
                    }
                }
            }
        ]);

        return group[0];
    }
}

module.exports = new GroupsService();