const jwt = require('jsonwebtoken');
const UserModel = require('../modules/user/user.model');  // Adjust this path to your user model location
require('dotenv').config();

const loginCheck = async (req, res, next) => {
    try {
        let token = req.headers['authorization'] || null;

        if (!token) {
            throw {
                statusCode: 401,
                message: 'Unauthorized, Please login first',
                detail: null
            };
        }

        // Extract Bearer token
        token = token.split(' ').pop();

        // Verify token
        const data = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch user from database by id stored in token's 'sub' or '_id'
        const userId = data.sub || data._id;
        if (!userId) {
            throw {
                statusCode: 401,
                message: 'Invalid token payload: no user id',
                detail: null
            };
        }

        const user = await UserModel.findById(userId).select('-password');  // exclude password for security

        // Check if user exists
        if (!user) {
            throw {
                statusCode: 401,
                message: 'Unauthorized, User not found',
                detail: null
            };
        }

        // Check if user is active
        if (user.status !== 'active') {
            throw {
                statusCode: 403,
                message: 'Forbidden, User is inactive',
                detail: null
            };
        }

        // Attach user details to req.authUser for downstream middleware/controllers
        req.authUser = {
            id: user._id,
            email: user.email,
            role: user.role,
            status: user.status,
            fullName: user.name || null,
            profile: user.image || null,
            phone: user.phone || null,
        };

        next();
    } catch (exception) {
        console.log('Exception in login check middleware', exception);

        let errorMessage = 'Unauthorized';
        if (exception.name === 'JsonWebTokenError' || exception.name === 'TokenExpiredError') {
            errorMessage = 'Invalid or expired token';
        } else if (exception.message) {
            errorMessage = exception.message;
        }

        next({
            statusCode: exception.statusCode || 401,
            message: errorMessage,
            detail: null
        });
    }
};

module.exports = {
    loginCheck
};
