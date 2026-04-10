const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const otpSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'rbac_user'
    },
    otp: {
        type: String,
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: '5m'
    }
});

const otpModel = mongoose.model('rbac_otp', otpSchema);

module.exports = otpModel;