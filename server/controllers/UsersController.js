const usersService = require("../services/UsersService");
const config = require("../config");
const tokenService = require("../services/TokensService");

class UsersController {
    async registration(req, res, next){
        try {
            const {name, surname, login, password} = req.body;
            const registered = await usersService.registration(name, surname, login, password);

            res.json(registered);
        }catch (err){
            next(err);
        }
    }

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
            const user = await usersService.getUser(req.params.login);

            res.json(user);
        } catch (err) {
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