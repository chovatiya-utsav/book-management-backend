const mongoose = require('mongoose');

const WishlistSchema = new mongoose.Schema({
    book_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Books"
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Users"
    }
});

module.exports = mongoose.model('wishlists', WishlistSchema);