const express = require('express');

const adminAuthController = require('./../controllers/adminAuthController');

const router = express.Router();

router.post('/register', adminAuthController.registerAdmin);
router.post('/login', adminAuthController.loginAdmin);

module.exports = router;