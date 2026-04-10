const express = require('express');

const userAuthController = require('./../controllers/userAuthController');

const router = express.Router();

router.post('/register',userAuthController.registerUser);
router.post('/login',userAuthController.loginUser);

module.exports = router;