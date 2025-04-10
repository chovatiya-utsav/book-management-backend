const express = require('express');
const BooksCtrl = require('./book.controller');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

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
    .post(upload.single('book_image'), BooksCtrl.createBook);


module.exports = router;