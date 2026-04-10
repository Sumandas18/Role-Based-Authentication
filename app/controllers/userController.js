const STATUS_CODE = require('./../utils/statusCode');
const userModel = require('./../models/userModel');
const otpModel = require('./../models/otpModel');
const sendMail = require('../utils/sendEmail');

class UserController {

    async resendOTP(req, res) {
        try {
            const { email } = req.body,
                type = 'resend';

            if (!email) {
                return res.status(STATUS_CODE.BAD_GATEWAY).json({
                    success: false,
                    message: 'All fields are required'
                });
            }

            const existUser = await userModel.findOne({ email });

            if (!existUser) {
                return res.status(STATUS_CODE.NOT_FOUND).json({
                    success: false,
                    message: "User doesn't exist"
                });
            }
            else {
                const newOTP = Math.floor(100000 + Math.random() * 900000);

                const newOTPObj = new otpModel({ userId: existUser._id, otp: newOTP });
                await newOTPObj.save();

                await sendMail(req, existUser, newOTP, type);

                return res.status(STATUS_CODE.OK).json({
                    success: true,
                    message: 'OTP re-send successfully'
                });
            }
        }
        catch (err) {
            return res.status(STATUS_CODE.SERVER_ERROR).json({
                success: false,
                message: err.message
            });
        }
    }

    async verifyEmail(req, res) {
        try {
            const { email, otp } = req.body;

            if (!email || !otp) {
                return res.status(STATUS_CODE.BAD_GATEWAY).json({
                    success: false,
                    message: 'All fields are required'
                });
            }

            const existUser = await userModel.findOne({ email });

            if (!existUser) {
                return res.status(STATUS_CODE.NOT_FOUND).json({
                    success: false,
                    message: "User doesn't exist"
                });
            }
            else if (existUser.isVerified) {
                return res.status(STATUS_CODE.BAD_GATEWAY).json({
                    success: false,
                    message: "User already verified"
                });
            }
            else {
                const existUserOTPDetails = await otpModel.findOne({ userId: existUser._id, otp });

                if (!existUserOTPDetails) {
                    return res.status(STATUS_CODE.NOT_FOUND).json({
                        success: false,
                        message: "Invalid OTP"
                    });
                }
                else {
                    if (!existUser.isVerified) {
                        existUser.isVerified = true;
                        await existUser.save();

                        await otpModel.deleteMany({ userId: existUser._id });

                        return res.status(STATUS_CODE.OK).json({
                            success: true,
                            message: "Email verification successfull"
                        });
                    }
                    else {
                        return res.status(STATUS_CODE.BAD_GATEWAY).json({
                            success: true,
                            message: "User already verified"
                        });
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

    async fetchProfile(req, res) {
        try {
            const user = req.user;

            if (!user) {
                return res.status(STATUS_CODE.NOT_FOUND).json({
                    success: false,
                    message: 'No profile details available'
                });
            }

            return res.status(STATUS_CODE.OK).json({
                success: true,
                message: 'User profile details',
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

    async getAllUser(req, res) {
        try {
            const users = await userModel.find();

            return res.status(STATUS_CODE.OK).json({
                success: true,
                message: "All available users",
                count: users.length,
                data: users
            })
        }
        catch (err) {
            return res.status(STATUS_CODE.SERVER_ERROR).json({
                success: false,
                message: err.message
            });
        }
    }

}

module.exports = new UserController();