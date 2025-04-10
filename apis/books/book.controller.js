const Books = require('./book.model');
// const { getUserID, uplodeBookImage, deleteCloudinaryImage } = require('../../middleware.js');
const { getUserID } = require('../../utils/auth.js')
const mongoose = require('mongoose');
const Review = require('../review/review.model.js');
const wishlist = require('../wishlist/wishlist.model.js');
const { uplodeBookImage, deleteCloudinaryImage } = require('../../utils/image.js');

const createBook = async (req, res, next) => {
    try {
        const { token, author_name, book_type, description, price, category, published_year, book_name } = req?.body;

        // Basic field validation
        if (!author_name || !book_type || !description || !price || !category || !published_year || !token) {
            return res.status(400).send("All input is required");
        }

        // Check if image is uploaded
        if (!req.file) {
            return res.status(400).send("Image is required");
        }

        // Check for existing book
        const bookNameExists = await Books.findOne({ book_name: book_name });
        if (bookNameExists) {
            return res.status(409).json({ message: "Book name already exists" });
        }

        // Validate user token and get user ID
        const userData = await getUserID(token);
        if (!userData) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        // Upload book image
        const imageUrl = await uplodeBookImage(req.file.buffer);
        if (!imageUrl) {
            return res.status(400).json({ message: "Image not uploaded" });
        }

        // Save book to DB
        const user_id = new mongoose.Types.ObjectId(userData._id);
        const book = new Books({
            book_name,
            author_name,
            book_type,
            description,
            price,
            category,
            published_year,
            book_image: imageUrl,
            user_id
        });

        await book.save();

        const allBookData = await Books.find({});
        return res.status(200).json({
            message: "Book added successfully",
            status: 200,
            data: allBookData
        });

    } catch (error) {
        next(error);
    }
};


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
            return res.status(400).json({ message: "bookId is required" });
        }

        // Find the book by its ID
        const book = await Books.findById(bookId);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        // If the book has an image, proceed to delete the image from Cloudinary
        if (book.book_image) {
            const getPublicIdFromUrl = (imageUrl) => {
                const parts = imageUrl.split('/');
                const fileName = parts[parts.length - 1];
                const folder = parts[parts.length - 2]; // assuming one folder level
                return `${folder}/${fileName.split('.')[0]}`;
            };

            const publicId = getPublicIdFromUrl(book.book_image);
            // Call the function to delete the image from Cloudinary
            const imageDeleted = await deleteCloudinaryImage(publicId);
            if (!imageDeleted) {
                return res.status(400).json({ message: "Failed to delete image from Cloudinary" });
            }
        }

        // Delete the book data from the database
        const deleteBookData = await Books.findByIdAndDelete(bookId);

        // Delete related reviews and wishlist items
        const deleteBookReview = await Review.deleteMany({ book_id: bookId });
        const deleteBookWishlist = await wishlist.deleteMany({ book_id: bookId });

        if (deleteBookData && deleteBookReview && deleteBookWishlist) {
            return res.status(200).json({
                message: "Book deleted successfully",
                status: 200
            });
        } else {
            return res.status(500).json({ message: "Failed to delete book, review, or wishlist" });
        }

    } catch (error) {
        next(error);
    }
};

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


                // If a new image is provided
                if (req?.file) {
                    // Delete the old image from Cloudinary if it exists
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

                    // Upload the new image to Cloudinary
                    const imagePath = req.file?.buffer;
                    const imageUrl = imagePath ? await uplodeBookImage(imagePath) : null;

                    if (imageUrl) {
                        bookDataToUpdate.book_image = imageUrl; // Update the book with the new image URL
                    }
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