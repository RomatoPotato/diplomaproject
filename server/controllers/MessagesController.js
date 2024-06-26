const Message = require("../models/Message");
const Chat = require("../models/Chat");
const config = require("../config");
const mongoose = require("mongoose");
const fs = require("fs");

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
                                    format: "%Y.%m.%d",
                                    date: "$datetime",
                                    timezone: localTimeZone
                                }
                            }
                        },
                        messages: {
                            $push: {
                                _id: "$_id",
                                type: "$type",
                                attachments: "$attachments",
                                text: "$text",
                                sender: {
                                    _id: "$from._id",
                                    name: "$from.name",
                                    surname: "$from.surname",
                                },
                                chatId: "$chatId",
                                edited: "$edited",
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
            const type = message.type;
            const attachments = message.attachments;
            const text = message.text;
            const from = message.sender._id;
            const chatId = message.chatId;
            const datetime = message.datetime;
            const to = req.body.to;

            const newMessage = await Message.create({
                _id,
                type,
                text,
                attachments,
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

    async saveManyMessages(req, res, next) {
        try {
            const messages = req.body.messages;

            for (let i = 0; i < messages.length; i++) {
                messages[i] = {
                    ...messages[i],
                    from: messages[i].sender._id
                }
                delete messages[i].sender;
            }

            const newMessages = await Message.insertMany(messages, {
                ordered: false
            });

            res.json(newMessages);
        } catch (err) {
            next(err);
        }
    }

    async editMessage(req, res, next) {
        try {
            const messageId = req.body.messageId;
            const text = req.body.text;

            const edited = await Message.findByIdAndUpdate(messageId, {
                text,
                edited: true
            }, config.updateOptions);

            res.json(edited);
        } catch (err) {
            next(err);
        }
    }

    async deleteMessageForAll(req, res, next) {
        try {
            const messageId = req.body.messageId;

            const deleted = await Message.findByIdAndDelete(messageId);

            if (deleted.type === "attachment") {
                deleteAttachments(deleted);
            }

            res.json({
                deletedMessage: deleted,
                deletedFiles: deleted.attachments
            });
        } catch (err) {
            next(err);
        }
    }

    async deleteMessageForSelf(req, res, next) {
        try {
            const userId = req.body.userId;
            const chatId = req.body.chatId;
            const messageId = req.body.messageId;

            const chat = await Chat.findById(chatId);
            const message = await Message.findById(messageId);
            message.deletedUsers.push(userId);

            let deleted;
            if (message.deletedUsers.length === chat.users.length) {
                deleted = await Message.findByIdAndDelete(messageId);

                if (deleted.type === "attachment") {
                    deleteAttachments(deleted);
                }
            } else {
                deleted = await Message.findByIdAndUpdate(messageId, message, config.updateOptions);
            }

            res.json(deleted);
        } catch (err) {
            next(err);
        }
    }

    async deleteManyMessagesForAll(req, res, next) {
        try {
            const messagesIds = req.body.messagesIds;

            const messagesFromDB = await Message.find({
                _id: {
                    $in: messagesIds
                }
            });

            for (const message of messagesFromDB){
                if (message.type === "attachment") {
                    deleteAttachments(message);
                }
            }

            const deleted = await Message.deleteMany({
                _id: {
                    $in: messagesIds
                }
            });

            res.json(deleted);
        } catch (err) {
            next(err);
        }
    }

    async deleteManyMessagesForSelf(req, res, next) {
        try {
            const userId = req.body.userId;
            const chatId = req.body.chatId;
            const messagesIds = req.body.messagesIds;

            const chat = await Chat.findById(chatId);
            const messagesFromDB = await Message.find({
                _id: {
                    $in: messagesIds
                }
            });

            const messagesToDelete = [];
            const messagesToUpdate = [];
            for (const message of messagesFromDB) {
                message.deletedUsers.push(userId);

                if (message.deletedUsers.length === chat.users.length) {
                    messagesToDelete.push(message._id);
                } else {
                    messagesToUpdate.push(message._id);
                }
            }

            let deleted;
            if (messagesToDelete.length > 0) {
                deleted = await Message.deleteMany({
                    _id: {
                        $in: messagesToDelete
                    }
                });

                const messagesFromDBToDelete = await Message.find({
                    _id: {
                        $in: messagesToDelete
                    }
                });

                for (const message of messagesFromDBToDelete){
                    if (message.type === "attachment") {
                        deleteAttachments(message);
                    }
                }
            }
            if (messagesToUpdate.length > 0) {
                deleted = await Message.updateMany({
                    _id: {
                        $in: messagesToUpdate
                    }
                }, {
                    $push: {
                        deletedUsers: userId
                    }
                }, config.updateOptions);
            }

            res.json(deleted);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new MessagesController();

function deleteAttachments(message) {
    for (const attachment of message.attachments) {
        if (fs.existsSync(attachment.path)) {
            fs.unlinkSync(attachment.path);
        }
    }
}