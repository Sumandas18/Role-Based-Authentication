require('dotenv').config();

const transporter = require('./../config/mailConfig');
const registerOTP = require('./mails/registerOTPTemplate');
const resendOTP = require('./mails/resendOTPTemplate');

const sendMail = async (req, user, otp, type) => {
    console.log(type);
    
    try {
        let subject, html;

        if (type == "register") {
            subject = "Verify Your Email";
            html = registerOTP({
                name: user.name,
                otp
            });
        }
        else if (type == "resend") {
            subject = "Your New OTP";
            html = resendOTP({
                name: user.name,
                otp
            });
        }
        else {
            throw new Error('Invalid email type');
        }

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject,
            text: "",
            html
        });
    } catch (err) {
        console.error("Error while sending mail:", err);
    }
}

module.exports = sendMail;