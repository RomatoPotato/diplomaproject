const VLS = require("../models/VLS");
const config = require("../config");
const Chat = require("../models/Chat");
const VLSService = require("../services/VLSService");
const groupServce = require("../services/GroupsService");

class VLSController {
    async getAllVLSs(req, res, next) {
        try {
            const VLSs = await VLS.aggregate([
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
            ]);

            res.json(VLSs);
        } catch (err) {
            next(err);
        }
    }

    async getVLS(req, res, next) {
        try {
            const id = req.params.id;

            const vls = await VLSService.getVLS(id);

            res.json(vls);
        } catch (err) {
            next(err);
        }
    }

    async addVLS(req, res, next) {
        try {
            const groupId = req.body.groupId;
            const admins = req.body.admins;

            const group = await groupServce.getGroup(groupId);

            const mainChat = await Chat.create({
                name: group.name,
                users: group.students.concat(admins).concat([group.curator._id]),
                type: "mainGroup",
                group: groupId
            });

            const added = await VLS.create({
                group,
                mainChat: mainChat
            });

            res.json(added);
        } catch (err) {
            next(err);
        }
    }

    async editVLS(req, res, next) {
        try {
            const id = req.body.id;
            const group = req.body.group;
            const edited = await VLS.findByIdAndUpdate(id, {
                group
            }, config.updateOptions);

            res.json(edited);
        } catch (err) {
            next(err);
        }
    }

    async deleteVLS(req, res, next) {
        try {
            const id = req.params.id;

            const vls = await VLS.findById(id);
            const mainChat = vls.mainChat;
            const otherChats = vls.currentSemesterChats;
            const allChats = [mainChat, ...otherChats];

            await Chat.deleteMany({
                _id: {
                    $in: allChats
                }
            })
            const deleted = await VLS.findByIdAndDelete(id);

            res.json(deleted);
        } catch (err) {
            next(err);
        }
    }

    async addStudyChats(req, res, next){
        try {
            const vlsId = req.body.vlsId;
            const disciplines = req.body.disciplines;
            const teachers = req.body.teachers;
            const vls = await VLSService.getVLS(vlsId);

            const studyChats = [];
            for (let i = 0; i < disciplines.length; i++){
                const newChat = await Chat.create({
                    name: disciplines[i],
                    users: vls.group.students.concat([teachers[i]]),
                    type: "studyGroup",
                    group: vls.group._id
                });
                studyChats.push(newChat._id);
            }

            const added = await VLS.findByIdAndUpdate(vlsId, {
                $addToSet: {
                    currentSemesterChats: studyChats
                }
            }, config.updateOptions);

            res.json(added);
        }catch (err){
            next(err);
        }
    }
}

module.exports = new VLSController();