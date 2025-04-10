const express = require('express');
const UserCtrl = require('./user.controller');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.route('/Login')
    .post(UserCtrl.userLogin);

router.route('/registration')
    .post(UserCtrl.userRegistration);


router.route('/numberOfUsers')
    .get(UserCtrl.getUserCount);

router.route('/updateUserDetail')
    .post(upload.single('profile_image'),UserCtrl.updateUserData);

router.route('/')
    .post(UserCtrl.getUserLoginData);

module.exports = router;