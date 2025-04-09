const express = require('express');
const BooksCtrl = require('./book.controller');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // temp storage for local file


const router = express.Router();


router.route('/findBookById/:id')
    .get(BooksCtrl.getBookById);

router.route('/deleteBookById/:bookId')
    .delete(BooksCtrl.deleteBook);

router.route('/updateBook')
    .post(upload.single('book_image'),BooksCtrl.updateBookData);


router.route('/numberOfBooks')
    .get(BooksCtrl.getBooksCount);

router.route('/')
    .get(BooksCtrl.getBookData)
    .post(upload.single('book_image'), BooksCtrl.createBook);


module.exports = router;