import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";

export const test = (req, res) => {
    res.json({ user: "testmsg" });
};

export const updateUser = async (req, res, next) => {
    if (req.params.userId !== req.body.userId) {
        return next(errorHandler(403, 'You are not allowed to update this user'));
    }

    if (!req.body.username || !req.body.email) {
        return next(errorHandler(400, 'Username and email are required'));
    }

    if (req.body.password && req.body.password.length < 6) {
        return next(errorHandler(400, 'Password must be at least 6 characters long'));
    }

    if (req.body.username.length < 7) {
        return next(errorHandler(400, 'Username must be at least 7 characters long'));
    }

    try {
        const updateFields = {
            username: req.body.username,
            email: req.body.email,
            profilePicture: req.body.profilePicture,
        };

        if (req.body.password) {
            updateFields.password = bcryptjs.hashSync(req.body.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,
            {
                $set: updateFields,
            },
            { new: true }
        );

        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    if (req.params.userId !== req.body.userId) {
        return next(errorHandler(403, 'You are not allowed to delete this user'));
    }

    try {
        await User.findByIdAndDelete(req.params.userId);
        res.clearCookie('access_token').status(200).json('User has been deleted');
    } catch (error) {
        next(error);
    }
};
