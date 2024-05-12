const usersService = require("../services/UsersService");
const config = require("../config");
const tokenService = require("../services/TokensService");
const User = require("../models/User");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

class UserController {
    async login(req, res, next){
        try {
            const login = req.body.login;
            const password = req.body.password;

            const user = await usersService.checkLoginData(login, password);

            if (user.isFirstLogin){
                await usersService.setIsFirstLoginFalse(user._id);
            }

            const accessToken = tokenService.generateAccessToken(getPayload(user));
            const refreshToken = tokenService.generateRefreshToken(getPayload(user));

            res.cookie("refresh_token", refreshToken, refreshTokenCookieOptions);
            res.cookie("access_token", accessToken, accessTokenCookieOptions);

            res.json(user);
        }catch (err){
            next(err);
        }
    }

    async checkAuth(req, res, next){
        try {
            const refreshToken = req.cookies.refresh_token;
            const user = await usersService.checkAuth(refreshToken);

            res.json(user);
        }catch (err){
            next(err);
        }
    }

    async logout(req, res, next){
        try {
            res.clearCookie("refresh_token");
            res.clearCookie("access_token");

            res.status(200);
            res.end();
        }catch (err){
            next(err);
        }
    }

    async refresh(req, res, next){
        try {
            const refreshToken = req.cookies.refresh_token;
            const accessToken = await usersService.refresh(refreshToken, getPayload);

            res.json(accessToken);
        }catch (err){
            next(err);
        }
    }

    async getUser(req, res, next){
        try {
            const login = req.params.login;
            const user = await User.findOne({login});

            res.json(user);
        } catch (err) {
            next(err);
        }
    }

    async addUserWithRoles(req, res, next){
        try {
            const name = req.body.name;
            const surname = req.body.surname;
            const middlename = req.body.middlename;
            const roles = req.body.roles;

            const _id = new mongoose.Types.ObjectId();
            const added = await User.create({
                _id,
                name,
                surname,
                middlename,
                login: _id.toString(),
                roles
            });

            res.json(added);
        }catch (err){
            next(err);
        }
    }

    async updateLoginData(req, res, next){
        try{
            const userId = req.body.userId;
            const login = req.body.login;
            const password = req.body.password;

            const updated = await usersService.updateLoginData(userId, login, password);

            res.json(updated);
        }catch (err){
            next(err);
        }
    }

    async generateLoginsAndPasswords(req, res, next) {
        try {
            const users = req.body.users; // user ids

            const loginsAndPasswords = [];
            for (const userId of users) {
                const user = await User.findById(userId);
                const middlename = user.middlename ? user.middlename : "";

                if (user.isFirstLogin) {
                    const salt = await bcrypt.genSalt(10);
                    const hash = await bcrypt.hash(userId, salt);

                    await User.findByIdAndUpdate(userId, {
                        login: userId,
                        password: hash
                    }, config.updateOptions);

                    loginsAndPasswords.push({
                        user: (user.surname + " " + user.name + " " + middlename).trim(),
                        login: userId,
                        password: userId
                    });
                }else {
                    loginsAndPasswords.push({
                        user: (user.surname + " " + user.name + " " + middlename).trim(),
                        alreadyLoggedIn: true
                    })
                }
            }

            res.json(loginsAndPasswords);
        } catch (err) {
            next(err);
        }
    }
}

const accessTokenCookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: config.cookies.access_token_expiration * 1000
}

const refreshTokenCookieOptions = {
    ...accessTokenCookieOptions,
    maxAge: config.cookies.refresh_token_expiration * 1000
}

function getPayload(user){
    return {
        userId: user._id
    }
}

module.exports = new UserController();