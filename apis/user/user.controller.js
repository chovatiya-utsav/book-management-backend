const { getUserID } = require('../../utils/auth.js');
const Users = require('./user.model');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
// const { cloudinary } = require('../../utils.js');
const fs = require('fs');
const { cloudinary } = require('../../utils/cloudinary.js');

const generateToken = (payload) => {
    return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
};

const userRegistration = async (req, res, next) => {
    try {
        const { user_name, email, contect_no, address, password } = req.body;

        if (!(user_name, email, contect_no, address, password)) {
            res.status(400).send("All input is required");
        }

        const user = new Users({
            user_name, email, contect_no, address, password
        });

        const token = generateToken({ id: user._id, email: user.email });

        user.token = token;

        const existingUser = await Users.find({ email });

        if (existingUser?.length > 0) {
            return res.status(200).json({
                message: `email already exists`,
                status: 409
            });
        } else {
            const userData = await user.save();
            return res.status(200).json(
                {
                    message: `${userData?.user_name} successfully register`,
                    status: 200,
                    data: userData
                })
        }

    } catch (error) {
        next(error)
    }
}

const userLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!(email, password)) {
            res.status(400).send("All input is required");
        }

        const existingUser = await Users.findOne({ email });

        if (!existingUser) {
            return res.status(200).json({
                message: `user not register`,
                status: 409
            });
        }
        else {

            const checkPassword = existingUser.password === password;

            if (!checkPassword) {
                return res.status(200).json(
                    {
                        message: `${existingUser?.user_name} enter correct password`,
                        status: 401,
                    })
            }

            const { password: _, ...userWithoutPassword } = existingUser.toObject();

            return res.status(200).json(
                {
                    message: `${existingUser?.user_name} successfully Login`,
                    status: 200,
                    data: userWithoutPassword
                })
        }

    } catch (error) {
        next(error)
    }
}

const getUserLoginData = async (req, res, next) => {
    try {
        const { token } = req.body;

        if (!token) {
            res.status(400).json("token is required");
        }

        const findUserData = await Users.findOne({ token }).select("-password -token");

        if (findUserData) {
            res.status(200).json(
                {
                    message: `user data retrieved susseccfully`,
                    status: 200,
                    data: findUserData
                })
        } else {
            next();
        }

    } catch (error) {
        next(error)
    }
}

const getUserCount = async (req, res, next) => {
    try {
        const users = await Users.find();
        const userNo = users?.length;

        res.status(200).json({
            message: `user count susseccfully`,
            status: 200,
            data: userNo
        })
    } catch (error) {
        next(error)
    }
}

const updateUserData = async (req, res, next) => {
    try {
        const { user_name, email, contect_no, user_token } = req.body;


        if (!user_token) {
            res.status(400).send("token is required");
        } else {
            const UserId = await getUserID(user_token);

            if (UserId) {

                const userData = {}

                if (user_name) { userData.user_name = user_name };
                if (email) { userData.email = email };
                if (contect_no) { userData.contect_no = contect_no };

                // ✅ Check if new image uploaded
                if (req?.file) {

                    if (UserId?.profile_image) {
                        const parts = UserId.profile_image.split('/');
                        const fileName = parts[parts.length - 1];
                        const folder = parts[parts.length - 2]; // assuming one folder level
                        publicId = `${folder}/${fileName.split('.')[0]}`; // remove .jpg or .png

                        await cloudinary.uploader.destroy(publicId);
                    }

                    const result = await cloudinary.uploader.upload(req?.file.buffer, {
                        folder: 'users',
                        transformation: [{ width: 300, height: 300, crop: 'limit' }],
                    });

                    // Optionally: delete old image from cloudinary using public_id if stored
                    // await cloudinary.uploader.destroy(user.image_public_id);

                    userData.profile_image = result.secure_url;

                }


                const updatedUser = await Users.findByIdAndUpdate(
                    new mongoose.Types.ObjectId(UserId._id),
                    {
                        $set: userData
                    },
                    { new: true }
                ).select("-password -token");

                if (updatedUser) {
                    res.status(200).json({
                        message: `user data susseccfully update`,
                        status: 200,
                        data: updatedUser
                    })
                } else {
                    res.status(200).json({
                        message: `user data not update`,
                        status: 402,
                    })
                }
            } else {
                res.status(200).json({
                    message: `invalid token`,
                    status: 401,
                })

            }
        }

    } catch (error) {
        next(error)
    }
}


module.exports = { userRegistration, userLogin, getUserLoginData, getUserCount, updateUserData };