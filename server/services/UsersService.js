const bcrypt = require("bcryptjs");

const User = require("../models/User");
const ApiError = require("../utils/exceptions/ApiError");
const tokenService = require("../services/TokensService");

const updateOptions = {
    returnDocument: "after",
    upsert: false // вставляет новый документ, если этот не найден
}

class UsersService {
    async registration(name, surname, login, password) {
        const checkedUser = await User.findOne({login});
        if (checkedUser) {
            throw ApiError.BadRequest(`User with login ${login} already exists!`);
        }

        const hash = generatePasswordHash(password);

        const user = await User.create({
            name,
            surname,
            login,
            password: hash
        });

        return user;
    }

    async checkLoginData(login, password){
        const user = await User.findOne({login});
        if (!user) {
            throw ApiError.NotFound(`User with login ${login} not found!`)
        }

        const checkedPassword = await bcrypt.compare(password, user.password);

        if (!checkedPassword){
            throw ApiError.BadRequest("Incorrect password!");
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

        const user = await User.findById(userData.userId);

        return user;
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
        const accessToken = tokenService.generateAccessToken(getPayload(user));

        return accessToken;
    }
/*
    async getAllUsers(){
        return User.find();
    }*/

    async getUser(login){
        const user = await User.findOne({login})
        return user;
    }

    async setIsFirstLoginFalse(id){
        const user = await User.findByIdAndUpdate(id, {
            isFirstLogin: false
        }, updateOptions);
        return user;
    }

    async updateLoginData(id, login, password){
        const hash = generatePasswordHash(password);

        const updated = await User.findByIdAndUpdate(id, {
            login,
            password: hash
        }, updateOptions);

        return updated;
    }
}

function generatePasswordHash(password){
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    return hash;
}

module.exports = new UsersService();