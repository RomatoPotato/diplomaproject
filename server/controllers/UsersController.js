const usersService = require("../services/UsersService");
const config = require("../config");
const tokenService = require("../services/TokensService");

class UsersController {
    async registration(req, res, next){
        try {
            const {name, surname, login, password} = req.body;
            const user = await usersService.registration(name, surname, login, password);

            res.status(200).json({
                message: `User with login '${login}' is registered!`,
                user
            });
        }catch (err){
            next(err);
        }
    }

    async login(req, res, next){
        try {
            const login = req.body.login;
            const password = req.body.password;

            const user = await usersService.login(login, password);

            const accessToken = tokenService.generateAccessToken(getPayload(user));
            const refreshToken = tokenService.generateRefreshToken(getPayload(user));

            res.cookie("refresh_token", refreshToken, refreshTokenCookieOptions);
            res.cookie("access_token", accessToken, accessTokenCookieOptions);

            res.status(200).json(user);
        }catch (err){
            next(err);
        }
    }

    async checkAuth(req, res, next){
        try {
            const refreshToken = req.cookies.refresh_token;
            const user = await usersService.checkAuth(refreshToken);

            res.status(200).json(user);
        }catch (err){
            next(err);
        }
    }

    async logout(req, res, next){
        try {
            res.clearCookie("refresh_token");

            res.status(200);
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

    async getAllUsers(req, res, next){
        try {
            const users = await usersService.getAllUsers();

            res.status(200).json(users);
        }catch (err){
            next(err);
        }
    }

    async getUser(req, res, next){
        try {
            const user = await usersService.getUser(req.params.id);

            res.status(200).json(user);
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

module.exports = new UsersController();