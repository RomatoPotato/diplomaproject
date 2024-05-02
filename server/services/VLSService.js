const VLS = require("../models/VLS");
const mongoose = require("mongoose");

class VLSService {
    async getVLS(vlsId) {
        const vls = await VLS.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(vlsId)
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
                $lookup: {
                    from: "chats",
                    localField: "mainChat",
                    foreignField: "_id",
                    as: "mainChat"
                }
            },
            {
                $unwind: "$mainChat"
            },
            {
                $lookup: {
                    from: "chats",
                    localField: "currentSemesterChats",
                    foreignField: "_id",
                    as: "currentSemesterChats"
                }
            },
            {
                $unwind: "$currentSemesterChats"
            },
            {
                $lookup: {
                    from: "users",
                    localField: "currentSemesterChats.users",
                    foreignField: "_id",
                    as: "currentSemesterChats.users"
                }
            },
            {
                $project: {
                    group: 1,
                    mainChat: 1,
                    currentSemesterChats: {
                        _id: 1,
                        name: 1,
                        teacher: {
                            $filter: {
                                input: "$currentSemesterChats.users",
                                as: "user",
                                cond: {
                                    $in: ["teacher", "$$user.roles"]
                                }
                            }
                        }
                    }
                }
            },
            {
                $unwind: "$currentSemesterChats.teacher"
            },
            {
                $project: {
                    currentSemesterChats: {
                        teacher: {
                            password: 0,
                            isFirstLogin: 0,
                            login: 0,
                            __v: 0
                        }
                    }
                }
            },
            {
                $group: {
                    _id: "$_id",
                    group: {
                        $addToSet: "$group"
                    },
                    mainChat: {
                        $addToSet: "$mainChat"
                    },
                    currentSemesterChats: {
                        $addToSet: "$currentSemesterChats"
                    }
                }
            },
            {
                $unwind: "$group"
            },
            {
                $unwind: "$mainChat"
            },
            {
                $project: {
                    group: {
                        __v: 0
                    }
                }
            },
        ]);

        return vls[0];
    }
}

module.exports = new VLSService();