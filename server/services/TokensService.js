const jwt = require("jsonwebtoken");
const config = require("../config");

class TokensService {
    generateAccessToken(payload){
        return jwt.sign(payload, config.jwt.access_secret, {expiresIn: config.cookies.access_token_expiration})
    }

    generateRefreshToken(payload){
        return jwt.sign(payload, config.jwt.refresh_secret, {expiresIn: config.cookies.refresh_token_expiration})
    }

    validateAccessToken(accessToken){
        try{
            return jwt.verify(accessToken, config.jwt.access_secret);
        }catch (err){
            return null;
        }
    }

    validateRefreshToken(refreshToken){
        try{
            return jwt.verify(refreshToken, config.jwt.refresh_secret);
        }catch (err){
            return null;
        }
    }
}

module.exports = new TokensService();