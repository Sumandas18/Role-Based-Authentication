const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const STATUS_CODE = require('./../utils/statusCode');
const userModel = require('./../models/userModel');
const otpModel = require('./../models/otpModel');
const sendMail = require('../utils/sendEmail');

class UserAuthController {

    async registerUser(req, res) {
        try {
            const { name, email, password } = req.body,
                type = 'register';

            if (!name || !email || !password) {
                return res.status(STATUS_CODE.BAD_GATEWAY).json({
                    success: false,
                    message: 'All fields are required'
                });
            }

            const existUser = await userModel.findOne({ email });

            if (existUser) {
                return res.status(STATUS_CODE.BAD_GATEWAY).json({
                    success: false,
                    message: 'User already exist'
                });
            }

            const salt = await bcrypt.genSalt(10);
            const hashPassword = bcrypt.hashSync(password, salt);

            const userObj = new userModel({ name, email, password: hashPassword });

            const user = await userObj.save();

            const otp = Math.floor(100000 + Math.random() * 900000);
            const otpObj = new otpModel({ userId: user._id, otp });
            await otpObj.save();

            await sendMail(req, user, otp, type);

            return res.status(STATUS_CODE.CREATED).json({
                success: true,
                message: 'Registration successfull. Please verify your email id',
                data: user
            });

        }
        catch (err) {
            return res.status(STATUS_CODE.SERVER_ERROR).json({
                success: false,
                message: err.message
            });
        }
    }

    async loginUser(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(STATUS_CODE.BAD_GATEWAY).json({
                    success: false,
                    message: 'All fields are required'
                });
            }

            const existUser = await userModel.findOne({ email });

            if (!existUser) {
                return res.status(STATUS_CODE.NOT_FOUND).json({
                    success: false,
                    message: 'User not found'
                });
            }
            else {
                const checkPassword = await bcrypt.compare(password, existUser.password);

                if (!checkPassword) {
                    return res.status(STATUS_CODE.FORBIDDEN).json({
                        success: false,
                        message: "Password doesn't match"
                    });
                }
                else {

                    if (!existUser.isVerified) {
                        return res.status(STATUS_CODE.FORBIDDEN).json({
                            success: false,
                            message: "Email not verified yet"
                        });
                    }
                    else if (existUser.role != 'user') {
                        return res.status(STATUS_CODE.BAD_GATEWAY).json({
                            success: false,
                            message: "Invalid credentials"
                        });
                    }
                    else {
                        const token = jwt.sign({
                            id: existUser._id,
                            name: existUser.name,
                            email: existUser.email,
                            role: existUser.role
                        }, process.env.JWT_SECRET_KEY, { expiresIn: '2d' });

                        return res.status(STATUS_CODE.OK).json({
                            success: true,
                            message: 'User logged in successfully',
                            data: {
                                name: existUser.name,
                                email: existUser.email,
                                role: existUser.role
                            },
                            token
                        })
                    }
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

module.exports = new UserAuthController();