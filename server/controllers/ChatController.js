const Chat = require("../models/Chat");
const Message = require("../models/Message");
const mongoose = require("mongoose");

const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

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
                    $project: {
                        users: {
                            isFirstLogin: 0,
                            __v: 0,
                            password: 0
                        },
                        group: {
                            students: 0,
                            __v: 0,
                            specialty: 0,
                            year: 0,
                            curator: 0
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

    async getMessages(req, res, next) {
        try {
            const chatId = req.params.chatId;

            const chat = await Message.aggregate([
                {
                    $match: {
                        chatId: new mongoose.Types.ObjectId(chatId)
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "from",
                        foreignField: "_id",
                        as: "from"
                    }
                },
                {
                    $unwind: "$from"
                },
                {
                    $group: {
                        _id: {
                            "datetime": {
                                $dateToString: {
                                    format: "%d.%m.%Y",
                                    date: "$datetime",
                                    timezone: localTimeZone
                                }
                            }
                        },
                        messages: {
                            $push: {
                                _id: "$_id",
                                text: "$text",
                                sender: {
                                    _id: "$from._id",
                                    name: "$from.name",
                                    surname: "$from.surname",
                                },
                                chatId: "$chatId",
                                datetime: "$datetime"
                            }
                        }
                    }
                },
                {
                    $sort: {
                        _id: 1
                    }
                }
            ]);

            res.json(chat);
        } catch (err) {
            next(err);
        }
    }

    async saveMessage(req, res, next) {
        try {
            const text = req.body.text;
            const from = req.body.from;
            const to = req.body.to;
            const chatId = req.body.chatId;
            const datetime = req.body.datetime;

            const message = await Message.create({
                text,
                from,
                to,
                chatId,
                datetime
            });

            res.json(message);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new ChatController();