const Message = require("../models/Message");
const config = require("../config");
const mongoose = require("mongoose");

const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;


class MessagesController {
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
            const message = req.body.message;

            const _id = message._id;
            const text = message.text;
            const from = message.sender._id;
            const chatId = message.chatId;
            const datetime = message.datetime;
            const to = req.body.to;

            const newMessage = await Message.create({
                _id,
                text,
                from,
                to,
                chatId,
                datetime
            });

            res.json(newMessage);
        } catch (err) {
            next(err);
        }
    }

    async editMessage(req, res, next){
        try {
            const messageId = req.body.messageId;
            const text = req.body.text;

            const edited = await Message.findByIdAndUpdate(messageId, {
                text
            }, config.updateOptions);

            res.json(edited);
        }catch (err){
            next(err);
        }
    }

    async deleteMessage(req, res, next){
        try {
            const messageId = req.params.messageId;

            const deleted = await Message.findByIdAndDelete(messageId);

            res.json(deleted);
        }catch (err){
            next(err);
        }
    }
}

module.exports = new MessagesController();