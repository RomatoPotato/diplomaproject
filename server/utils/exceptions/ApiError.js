class ApiError extends Error {
    status;
    name;

    constructor(status, message) {
        message = JSON.stringify(message);

        super(message);
        this.status = status;
    }

    static BadRequest(message = null){
        return new ApiError(400, message);
    }

    static UnauthorizedError(){
        return new ApiError(401, "User is not authorized!");
    }

    static NotFound(message = null){
        return new ApiError(404, message);
    }
}

module.exports = ApiError;