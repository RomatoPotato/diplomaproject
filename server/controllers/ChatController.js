const Chat = require("../models/Chat");
const mongoose = require("mongoose");

class ChatController {
    async createChat(req, res, next) {
        try {
            const user1Id = req.body.user1Id;
            const user2Id = req.body.user2Id;

            const created = await Chat.create({
                users: [user1Id, user2Id],
                type: "dialog"
            });

            res.json(created);
        } catch (err) {
            next(err);
        }
    }

    async getChats(req, res, next) {
        try {
            const userId = req.params.userId;

            const chat = await Chat.aggregate([
                {
                    $match: {
                        users: {
                            $in: [new mongoose.Types.ObjectId(userId)]
                        }
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "users",
                        foreignField: "_id",
                        as: "users"
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
                        from: "specialties",
                        localField: "group.specialty",
                        foreignField: "_id",
                        as: "group.specialty"
                    }
                },
                {
                    $unwind: "$group.specialty"
                },
                {
                    $project: {
                        users: {
                            isFirstLogin: 0,
                            __v: 0,
                            password: 0
                        },
                        group: {
                            students: 0,
                            __v: 0,
                            curator: 0,
                            specialty: {
                                __v: 0
                            }
                        }
                    }
                },
                {
                    $sort: {
                        name: 1
                    }
                }
            ]);

            res.json(chat);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new ChatController();