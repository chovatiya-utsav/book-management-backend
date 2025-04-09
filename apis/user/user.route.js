const express = require('express');
const UserCtrl = require('./user.controller');

const router = express.Router();

router.route('/Login')
    .post(UserCtrl.userLogin);

router.route('/registration')
    .post(UserCtrl.userRegistration);


router.route('/numberOfUsers')
    .get(UserCtrl.getUserCount);

router.route('/updateUserDetail')
    .post(UserCtrl.updateUserData);

router.route('/')
    .post(UserCtrl.getUserLoginData);

module.exports = router;