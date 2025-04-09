const mongoose = require("mongoose");
const { getUserID } = require('../../utils/auth');
const wishlists = require("./wishlist.model");


const wishlist = async (req, res, next) => {
    try {
        const { token, book_id } = req.body;


        const findUserData = await getUserID(token);

        const data = {
            user_id: findUserData?._id,
            book_id: book_id,
        }


        if (!(token, book_id, findUserData?._id)) {
            res.status(400).send("All input is required");
        }

        const existBookWishlist = await wishlists.findOne(data);

        if (existBookWishlist) {

            res.status(200).json(
                {
                    message: ` Book already in Read Later`,
                    status: 200,
                    data: existBookWishlist
                })
        } else {
            const wishlist = new wishlists({
                ...data
            });

            const wishlistsData = await wishlist.save();

            res.status(200).json(
                {
                    message: `Book added to Read Later`,
                    status: 200,
                    data: wishlistsData
                })

        }



    } catch (error) {
        next(error)
    }
}

const getBookWishlist = async (req, res, next) => {
    try {
        const { token } = req.body;

        if (!(token)) {
            res.status(400).send("All input is required");
        }

        const findUserData = await getUserID(token);

        if (findUserData) {

            const wishlistsData = await wishlists.find({
                user_id: new mongoose.Types.ObjectId(findUserData._id)
            }).populate("book_id");


            if (wishlistsData) {
                res.status(200).json(
                    {
                        message: `review retrieved successfully`,
                        status: 200,
                        data: wishlistsData
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

const deleteWishlist = async (req, res, next) => {
    try {

        const { WishlistId } = req.params

        if (!(WishlistId)) {
            res.status(400).json("Wishlist id is requrid")
        }

        const wishlistData = await wishlists.findByIdAndDelete({ _id: WishlistId })


        if (wishlistData) {
            res.status(200).json({
                message: "wishlist susseccfully deleted",
                status: 200,
                data: wishlistData
            })
        } else {
            res.status(200).json({
                message: "wishlist not found and already deleted",
                status: 400,
            })
        }

    } catch (error) {
        next(error);
    }
}

module.exports = { wishlist, getBookWishlist, deleteWishlist };