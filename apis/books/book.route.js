const express = require('express');
const BooksCtrl = require('./book.controller');


const router = express.Router();


router.route('/findBookById/:id')
    .get(BooksCtrl.getBookById);

router.route('/deleteBookById/:bookId')
    .delete(BooksCtrl.deleteBook);

router.route('/updateBook')
    .post(BooksCtrl.updateBookData);


router.route('/numberOfBooks')
    .get(BooksCtrl.getBooksCount);

router.route('/')
    .get(BooksCtrl.getBookData)
    .post( BooksCtrl.createBook);


module.exports = router;