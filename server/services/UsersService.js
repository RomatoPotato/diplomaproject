const bcrypt = require("bcryptjs");

const User = require("../models/User");
const ApiError = require("../utils/exceptions/ApiError");
const tokenService = require("../services/TokensService");
const config = require("../config");

class UsersService {
    async checkLoginData(login, password){
        const user = await User.findOne({login});
        if (!user) {
            throw ApiError.NotFound({error: "WrongLogin", data: login});
        }

        const checkedPassword = await bcrypt.compare(password, user.password);

        if (!checkedPassword){
            throw ApiError.BadRequest({error: "WrongPassword"});
        }

        return user;
    }

    async checkAuth(refreshToken){
        if (!refreshToken){
            throw ApiError.UnauthorizedError();
        }

        const userData = tokenService.validateRefreshToken(refreshToken);
        if (!tokenService.validateRefreshToken(refreshToken)){
            throw ApiError.UnauthorizedError();
        }

        return (await User.findById(userData.userId));
    }

    async refresh(refreshToken, getPayload){
        if (!refreshToken){
            throw ApiError.UnauthorizedError();
        }

        const userData = tokenService.validateRefreshToken(refreshToken);
        if (!userData){
            throw ApiError.UnauthorizedError();
        }

        const user = await User.findById(userData.id);

        return tokenService.generateAccessToken(getPayload(user));
    }

    async setIsFirstLoginFalse(id){
        return (await User.findByIdAndUpdate(id, {
            isFirstLogin: false
        }, config.updateOptions));
    }

    async updateLoginData(id, login, password){
        const hash = generatePasswordHash(password);

        return (await User.findByIdAndUpdate(id, {
            login,
            password: hash
        }, config.updateOptions));
    }
}

function generatePasswordHash(password){
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}

module.exports = new UsersService();