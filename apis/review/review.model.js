const mongoose = require('mongoose');

const BookReviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: true
    },
    book_id: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    user_name: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('review', BookReviewSchema);