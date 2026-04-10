const jwt = require('jsonwebtoken');

const STATUS_CODE = require("./../utils/statusCode");

const checkAuth = (accessUser = []) => {

    return async (req, res, next) => {
        try {

            const token = req.body?.token || req.query?.token || req.headers['authorization'] || req.headers['x-access-token'];

            if (!token) {
                return res.status(STATUS_CODE.NOT_FOUND).json({
                    success: false,
                    message: 'Token not available'
                });
            }
            else {
                const verifyToken = await jwt.verify(token, process.env.JWT_SECRET_KEY);

                if (!verifyToken) {
                    return res.status(STATUS_CODE.BAD_GATEWAY).json({
                        success: false,
                        message: 'Invalid token'
                    });
                }
                else if (!accessUser.includes(verifyToken.role)) {
                    return res.status(STATUS_CODE.UNAUTHORISED).json({
                        success: false,
                        message: 'Un-authorised access'
                    });
                }
                else {
                    req.user = verifyToken;
                    next();
                }
            }
        }
        catch (err) {

            return res.status(STATUS_CODE.SERVER_ERROR).json({
                success: false,
                message: err.message
            });
        }
    }
}

module.exports = checkAuth;