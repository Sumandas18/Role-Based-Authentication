const express = require('express');

const adminRoute = require('./adminRoute');
const userRoute = require('./userRoute');
const commonRoute = require('./commonRoute');

const router = express.Router();

router.use('/admin', adminRoute);
router.use('/user', userRoute);
router.use('/', commonRoute);

module.exports = router;