const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    user_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    contect_no: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profile_image: {
        type: String,
        default: ""
    },
    token: {
        type: String
    },
});

module.exports = mongoose.model('users', UserSchema);