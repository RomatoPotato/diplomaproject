const Message = require("../models/Message");
const Chat = require("../models/Chat");
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
                                deletedUsers: "$deletedUsers",
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

    async deleteMessageForAll(req, res, next){
        try {
            const messageId = req.params.messageId;

            const deleted = await Message.findByIdAndDelete(messageId);

            res.json(deleted);
        }catch (err){
            next(err);
        }
    }

    async deleteMessageForSelf(req, res, next){
        try {
            const userId = req.params.userId;
            const chatId = req.body.chatId;
            const messageId = req.body.messageId;

            const chat = await Chat.findById(chatId);
            const message = await Message.findById(messageId);
            message.deletedUsers.push(userId);

            let deleted;
            if (message.deletedUsers.length === chat.users.length){
                deleted = await Message.findByIdAndDelete(messageId);
            }else {
                deleted = await Message.findByIdAndUpdate(messageId, message);
            }

            res.json(deleted);
        }catch (err){
            next(err);
        }
    }
}

module.exports = new MessagesController();