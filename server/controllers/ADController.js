const AcademicDiscipline = require("../models/AcademicDiscipline");
const config = require("../config");

class ADController {
    async getAcademicDisciplines(req, res, next){
        try {
            const ads = await AcademicDiscipline.aggregate([
                {
                    $sort: {
                        "name": 1
                    }
                }
            ]);

            res.json(ads);
        }catch (err){
            next(err);
        }
    }

    async addAcademicDiscipline(req, res, next){
        try {
            const name = req.body.name;

            const added = await AcademicDiscipline.create({
                name
            });

            res.json(added);
        }catch (err){
            next(err);
        }
    }

    async editAcademicDiscipline(req, res, next){
        try {
            const id = req.body.id;
            const name = req.body.name;

            const edited = await AcademicDiscipline.findByIdAndUpdate(id, {
                name
            }, config.updateOptions);

            res.json(edited);
        }catch (err){
            next(err);
        }
    }

    async deleteAcademicDiscipline(req, res, next){
        try {
            const id = req.params.id;

            const deleted = await AcademicDiscipline.findByIdAndDelete(id);

            res.json(deleted);
        }catch (err){
            next(err);
        }
    }
}

module.exports = new ADController();