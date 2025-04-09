const express = require('express');
const wishlistCtrl = require('./wishlist.controller');


const router = express.Router();



router.route('/deleteWishlist/:WishlistId')
    .delete(wishlistCtrl.deleteWishlist);

router.route('/getBookWishlist')
    .post(wishlistCtrl.getBookWishlist);

router.route('/')
    .post(wishlistCtrl.wishlist);

module.exports = router;