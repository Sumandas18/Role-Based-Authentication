const express = require('express');

const userController = require('./../controllers/userController');
const checkAuth = require('./../middlewares/checkAuth');

const router = express.Router();

router.post('/verify', userController.verifyEmail);
router.post('/resend', userController.resendOTP);

router.get('/all', checkAuth(['admin']), userController.getAllUser);
router.get('/', checkAuth(['admin', 'user']), userController.fetchProfile);


module.exports = router;