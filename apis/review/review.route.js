const express = require('express');
const BookReviewCtrl = require('./review.controller');


const router = express.Router();
router.route('/getreview/:id')
    .get( BookReviewCtrl.getAllBookReview);

router.route('/getreview')
    .post(BookReviewCtrl.getBookReview)


router.route('/')
    .post(BookReviewCtrl.review);

module.exports = router;