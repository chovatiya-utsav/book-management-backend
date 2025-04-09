const mongoose = require('mongoose');

const BooksSchema = new mongoose.Schema({
    book_name: {
        type: String,
        required: true
    },
    author_name: {
        type: String,
        required: true
    },
    book_type: {
        type: String,
        required: true
    },
    book_image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    published_year: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: false,
        default: 1
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Users"
    }
});

module.exports = mongoose.model('Books', BooksSchema);