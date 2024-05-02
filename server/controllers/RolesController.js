const User = require("../models/User");
const config = require("../config");

class RolesController {
    async getUsersByRoles(req, res, next) {
        try {
            let {roles} = req.query;

            if (!(roles instanceof Array)) {
                roles = [roles];
            }

            const users = await User.aggregate([
                {
                    $match: {
                        roles: {
                            $in: roles
                        }
                    }
                },
                {
                    $project: {
                        isFirstLogin: 0,
                        login: 0,
                        password: 0,
                        __v: 0
                    }
                },
                {
                    $sort: {
                        surname: 1
                    }
                }
            ]);

            res.json(users);
        } catch (err) {
            next(err);
        }
    }

    async addRoleToUser(req, res, next) {
        try {
            const userId = req.body.userId;
            const role = req.body.role;

            const added = await User.findByIdAndUpdate(userId, {
                $addToSet: {
                    roles: role
                }
            }, config.updateOptions);

            res.json(added);
        } catch (err) {
            next(err);
        }
    }

    async changeUserRole(req, res, next) {
        try {
            const userId = req.body.userId;
            const oldRole = req.body.oldRole;
            const newRole = req.body.newRole;

            const changed = await User.updateOne({
                _id: userId,
                roles: oldRole,
            },{
                $set: {
                    "roles.$": newRole
                }
            }, config.updateOptions);

            res.json(changed);
        } catch (err) {
            next(err);
        }
    }

    async removeRoleFromUser(req, res, next) {
        try {
            const userId = req.params.userId;
            const role = req.params.role;

            const removed = await User.findByIdAndUpdate(userId, {
                $pull: {
                    roles: role
                }
            }, config.updateOptions);

            res.json(removed);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new RolesController();