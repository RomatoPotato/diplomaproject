const Specialty = require("../models/Specialty");
const Group = require("../models/Group");
const User = require("../models/User");
const VLS = require("../models/VLS");
const bcrypt = require("bcryptjs");

const updateOptions = {
    returnDocument: "after",
    upsert: false // вставляет новый документ, если этот не найден
}

class EIController {
    async getAllSpecialties(req, res, next) {
        try {
            const all = await Specialty.find();

            res.json(all);
        }catch (err){
            next(err);
        }
    }

    async addSpecialty(req, res, next) {
        try {
            const name = req.body.name;
            const added = await Specialty.create({name});

            res.json(added);
        }catch (err){
            next(err);
        }
    }

    async editSpecialty(req, res, next) {
        try {
            const id = req.body.id;
            const name = req.body.newName;

            const edited = await Specialty.findByIdAndUpdate(id, {name}, updateOptions);

            res.json(edited);
        }catch (err){
            next(err);
        }
    }

    async deleteSpecialty(req, res, next) {
        try {
            const id = req.params.id;
            const deleted = await Specialty.findByIdAndDelete(id);

            res.json(deleted);
        }catch (err){
            next(err);
        }
    }

    async getAllGroups(req, res, next) {
        try {
            const groups = await Group.find().populate("specialty").populate("students");

            res.json(groups);
        }catch (err){
            next(err);
        }
    }

    async addGroup(req, res, next) {
        try {
            const name = req.body.name;
            const specialty = req.body.specialty;
            const year = req.body.year;
            const students = req.body.students;

            const studentIds = [];
            for (const student of students){
                const [name, surname] = student.split(" ");
                const newStudent = await User.create({
                    name,
                    surname,
                    role: "student"
                });

                studentIds.push(newStudent._id);
            }

            const added = await Group.create({
                name,
                specialty,
                year,
                students: studentIds
            });

            res.json(added);
        }catch (err){
            next(err);
        }
    }

    async editGroup(req, res, next) {
        try {
            const id = req.body.id;
            const name = req.body.name;
            const specialty = req.body.specialty;
            const year = req.body.year;

            const edited = await Group.findByIdAndUpdate(id, {
                name,
                specialty,
                year
            }, updateOptions);

            res.json(edited);
        }catch (err){
            next(err);
        }
    }

    async deleteGroup(req, res, next) {
        try {
            const id = req.params.id;
            const deleted = await Group.findByIdAndDelete(id);

            res.json(deleted);
        }catch (err){
            next(err);
        }
    }

    async getAllVLSs(req, res, next){
        try {
            const VLSs = await VLS.find().populate({
                path: "group",
                populate: ["students", "specialty"]
            });

            res.json(VLSs);
        }catch (err){
            next(err);
        }
    }

    async addVLS(req, res, next){
        try {
            const group = req.body.group;
            const added = await VLS.create({
                group
            });

            res.json(added);
        }catch (err){
            next(err);
        }
    }

    async editVLS(req, res, next){
        try {
            const id = req.body.id;
            const group = req.body.group;
            const edited = await VLS.findByIdAndUpdate(id, {
                group
            }, updateOptions);

            res.json(edited);
        }catch (err){
            next(err);
        }
    }

    async deleteVLS(req, res, next){
        try {
            const id = req.params.id;
            const deleted = await VLS.findByIdAndDelete(id);

            res.json(deleted);
        }catch (err){
            next(err);
        }
    }

    async generatePasswords(req, res, next){
        try {
            const groupId = req.params.id;
            const students = (await Group.findById(groupId).populate("students")).students;

            const loginsAndPasswords = [];
            for (const student of students){
                if (student.isFirstLogin){
                    const salt = await bcrypt.genSalt(10);
                    const hash = await bcrypt.hash(student._id.toString(), salt);

                    await User.findByIdAndUpdate(student._id, {
                        login: student._id,
                        password: hash
                    }, updateOptions);

                    loginsAndPasswords.push({
                        student: student.surname + " " + student.name,
                        login: student._id,
                        password: student._id
                    })
                }
            }

            res.json(loginsAndPasswords);
        }catch (err){
            next(err);
        }
    }
}

module.exports = new EIController();