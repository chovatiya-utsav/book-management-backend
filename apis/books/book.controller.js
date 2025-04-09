const Books = require('./book.model');
// const { getUserID, uplodeBookImage, deleteCloudinaryImage } = require('../../middleware.js');
const { getUserID } = require('../../utils/auth.js')
const mongoose = require('mongoose');
const Review = require('../review/review.model.js');
const wishlist = require('../wishlist/wishlist.model.js');
const { uplodeBookImage, deleteCloudinaryImage } = require('../../utils/image.js');

const createBook = async (req, res, next) => {
    try {
        const { book_name, author_name, book_type, description, price, category, published_year, token } = req.body;

        if (!(book_name, author_name, book_type, description, price, category, published_year, token)) {
            res.status(400).send("All input is required");
        } else {
            if (!req.file) {
                res.status(400).send("image is required");
            }

            const bookNameExists = await Books.findOne({ book_name: book_name });


            if (bookNameExists) {
                res.status(409).send({ message: "book name is alerdy exists" });
            }

            userData = await getUserID(token);

            if (userData && !bookNameExists) {

                user_id = new mongoose.Types.ObjectId(userData._id);

                // Upload book image
                const imagePath = req.file?.path;
                const imageUrl = imagePath ? await uplodeBookImage(imagePath) : null;

                if (!imageUrl) {
                    res.status(400).json({ message: "image not uploaded", imageUrl })
                }
                const book = new Books({
                    book_name,
                    author_name,
                    book_type,
                    description,
                    price, category,
                    published_year,
                    book_image: imageUrl,
                    user_id

                });

                const bookData = await book.save();

                const allBookData = await Books.find({});
                res.status(200).json(
                    {
                        message: "book added successfully",
                        status: 200,
                        data: [...allBookData]
                    })

            } else {
                res.status(401).json({ message: "Invalid or expired token" });
            }
        }




    } catch (error) {
        next(error)
    }
}

const getBookData = async (req, res, next) => {
    try {
        const allBookData = await Books.find({});

        res.status(200).json(
            {
                status: 200,
                data: [...allBookData]
            });
    } catch (error) {
        next(error)
    }
};

const getBookById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const book = await Books.findById(id);
        if (!book) {
            return res.status(404).json({
                status: 404,
                message: "Book not found",
            });
        }

        res.status(200).json({
            status: 200,
            data: book,
        });

    } catch (error) {
        next(error)
    }
}

const getBooksCount = async (req, res, next) => {
    try {
        const books = await Books.find();
        const booksNo = books?.length;

        res.status(200).json({
            message: `user count susseccfully`,
            status: 200,
            data: booksNo
        })
    } catch (error) {
        next(error)
    }
}

const deleteBook = async (req, res, next) => {
    try {
        const { bookId } = req.params;

        if (!bookId) {
            res.status(400).json("bookId is Requrid")
        }

        const book = await Books.findById(bookId)


        if (!book) {
            throw new ApiError(404, "Book not found or already deleted")
        }

        if (book.book_image) {
            const getPublicIdFromUrl = (imageUrl) => {
                const parts = imageUrl.split('/');
                const fileName = parts[parts.length - 1];
                const folder = parts[parts.length - 2]; // assuming one folder level
                return `${folder}/${fileName.split('.')[0]}`;
            };

            const publicId = getPublicIdFromUrl(book.book_image);
            await deleteCloudinaryImage(publicId);
        }

        const deleteBookData = await Books.findByIdAndDelete(bookId);

        const deleteBookReview = await Review.deleteMany({ book_id: bookId });

        const deleteBookwishlist = await wishlist.deleteMany({ book_id: bookId });


        if (deleteBookData && deleteBookReview && deleteBookwishlist) {
            res.status(200).json({
                message: "book delete susseccfully",
                status: 200
            })
        } else {
            next()
        }

    } catch (error) {
        next(error);
    }
}

const updateBookData = async (req, res, next) => {
    try {

        const { book_name, author_name, book_type, description, price, category, published_year, book_id } = req.body;


        if (!book_id) {
            res.status(400).send("token is required");
        } else {

            const existingBook = await Books.findById(book_id);

            if (existingBook) {

                const bookDataToUpdate = {};

                if (book_name) bookDataToUpdate.book_name = book_name;
                if (author_name) bookDataToUpdate.author_name = author_name;
                if (book_type) bookDataToUpdate.book_type = book_type;
                if (description) bookDataToUpdate.description = description;
                if (price) bookDataToUpdate.price = price;
                if (category) bookDataToUpdate.category = category;
                if (published_year) bookDataToUpdate.published_year = published_year;


                if (req?.file) {

                    if (existingBook?.book_image) {
                        const getPublicIdFromUrl = (imageUrl) => {
                            const parts = imageUrl.split('/');
                            const fileName = parts[parts.length - 1];
                            const folder = parts[parts.length - 2]; // assuming one folder level
                            return `${folder}/${fileName.split('.')[0]}`;
                        };

                        const publicId = getPublicIdFromUrl(existingBook?.book_image);
                        await deleteCloudinaryImage(publicId);
                    }

                    const imagePath = req.file?.path;
                    const imageUrl = imagePath ? await uplodeBookImage(imagePath) : null;

                    // Optionally: delete old image from cloudinary using public_id if stored
                    // await cloudinary.uploader.destroy(user.image_public_id);

                    bookDataToUpdate.book_image = imageUrl;

                }


                const updatedBook = await Books.findByIdAndUpdate(
                    book_id,
                    { $set: bookDataToUpdate },
                    { new: true }
                );

                if (updatedBook) {
                    return res.status(200).json({
                        message: "Book successfully updated",
                        status: 200,
                        data: updatedBook
                    });
                } else {
                    return res.status(400).json({
                        message: "Failed to update book",
                        status: 400
                    });
                }
            } else {
                return res.status(404).json({
                    message: "Book not found",
                    status: 404
                });

            }
        }

    } catch (error) {
        next(error)
    }
}


module.exports = { createBook, getBookData, getBookById, getBooksCount, deleteBook, updateBookData };