const bcrypt = require("bcryptjs");

const User = require("../models/User");
const ApiError = require("../utils/exceptions/ApiError");
const tokenService = require("../services/TokensService");

class UsersService {
    async registration(name, surname, login, password) {
        const checkedUser = await User.findOne({login});
        if (checkedUser) {
            throw ApiError.BadRequest(`User with login ${login} already exists!`);
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            surname,
            login,
            password: hash
        });

        return user;
    }

    async login(login, password){
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

        const user = await this.getUser(userData.id);
        const accessToken = tokenService.generateAccessToken(getPayload(user));

        return accessToken;
    }

    async getAllUsers(){
        return User.find();
    }

    async getUser(id){
        return User.findById(id);
    }
}

module.exports = new UsersService();