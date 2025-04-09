const mongoose = require("mongoose");
const { getUserID } = require('../../utils/auth');
const Review = require('./review.model');

const review = async (req, res, next) => {
    try {
        const { token, book_id, rating, comment } = req.body;

        const findUserData = await getUserID(token);

        const data = {
            user_id: findUserData?._id,
            user_name: findUserData.user_name,
            book_id: book_id,
            rating: rating,
            comment: comment
        }

        if (!(token, book_id, rating, comment, findUserData?._id)) {
            res.status(400).send("All input is required");
        }

        const review = new Review({
            ...data
        });

        const reviewData = await review.save();

        res.status(200).json(
            {
                message: ``,
                status: 200,
                data: data
            })

    } catch (error) {
        next(error)
    }
}

const getBookReview = async (req, res, next) => {
    try {
        const { token, book_id } = req.body;

        if (!(token, book_id)) {
            res.status(400).send("All input is required");
        }

        const findUserData = await getUserID(token);



        if (findUserData) {

            const reviewData = await Review.findOne({
                user_id: new mongoose.Types.ObjectId(findUserData._id),
                book_id: new mongoose.Types.ObjectId(book_id)
            }).select("rating comment -_id");


            if (reviewData) {
                res.status(200).json(
                    {
                        message: `review retrieved successfully`,
                        status: 200,
                        data: reviewData
                    })
            } else {
                res.status(200).json(
                    {
                        message: `review not found`,
                        status: 404,
                    })
            }
        }

    } catch (error) {
        next(error)
    }
}

const getAllBookReview = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!(id)) {
            res.status(400).send("book id is required");
        }

        const bookObjectId = new mongoose.Types.ObjectId(id);

        const bookReviewData = await Review.find({ book_id: bookObjectId })

        if (bookReviewData) {
            res.status(200).json(
                {
                    message: `review retrieved successfully`,
                    status: 200,
                    data: bookReviewData
                })

        } else {
            res.status(200).json(
                {
                    message: `review not found`,
                    status: 404,
                })

        }


    } catch (error) {
        next(error)
    }
}


module.exports = { review, getBookReview, getAllBookReview };