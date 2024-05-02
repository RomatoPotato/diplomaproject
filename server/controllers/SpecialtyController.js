const Specialty = require("../models/Specialty");
const config = require("../config");

class SpecialtyController {
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

            const edited = await Specialty.findByIdAndUpdate(id, {name}, config.updateOptions);

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
}

module.exports = new SpecialtyController();