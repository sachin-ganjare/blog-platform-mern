import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";

export const test = (req, res) => {
    res.json({ user: "testmsg" });
};

export const updateUser = async (req, res, next) => {
    if (req.params.userId !== req.user.id) {
        return next(errorHandler(403, 'You are not allowed to update this user'));
    }

    if (!req.body.username || !req.body.email) {
        return next(errorHandler(400, 'Username and email are required'));
    }

    if (req.body.password && req.body.password.length < 6) {
        return next(errorHandler(400, 'Password must be at least 6 characters long'));
    }

    if (req.body.username.length < 7 || req.body.username.length > 20) {
        return next(errorHandler(400, 'Username must be between 7 and 20 characters'));
    }

     if (req.body.username.includes(' ')) {
        return next(errorHandler(400, 'Username cannot contain spaces!'));
    }

     if (req.body.username !== req.body.username.toLowerCase() ) {
        return next(errorHandler(400, 'Username must be lowercase'));
    }


     if (!req.body.username.match(/^[a-zA-Z0-9]+$/) ) {
        return next(errorHandler(400, 'Username cannot contain special characters'));
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

        // send back without password
        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    if (!req.user.isAdmin && req.params.userId !== req.user.id) {
        return next(errorHandler(403, 'You are not allowed to delete this user'));
    }

    try {
        await User.findByIdAndDelete(req.params.userId);

        // Only clear auth cookie if the logged-in user deleted their own account.
        if (req.params.userId === req.user.id) {
            res.clearCookie('access_token');
        }

        res.status(200).json('User has been deleted');
    } catch (error) {
        next(error);
    }
};


export const getUsers = async (req, res, next) => {
    if(!req.user.isAdmin){
        return next(errorHandler(403, 'You are not allowed to see all users!'))
    }

    try {
        const startIndex = parseInt(req.query.startIndex) || 0; 
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sort === 'asc' ? 1 : -1;

        const users = await User.find()
                        .sort({createdAt: sortDirection})
                        .skip(startIndex)
                        .limit(limit);
        const usersWithoutPassword = users.map((user)=>{
            const { password, ...rest} = user._doc;
            return rest;
        })

            const totalUsers = await User.countDocuments();

            const now = new Date();

            const oneMonthAgo = new Date(
                now.getFullYear(),
                now.getMonth() - 1,
                now.getDate()
            )

            const lastMonthUsers = await User.countDocuments({
            createdAt: {$gte: oneMonthAgo},
        });

        res.status(200).json({
            users: usersWithoutPassword,
            totalUsers,
            lastMonthUsers,
        });
    } catch (error) {
        next(error);       
    }
}