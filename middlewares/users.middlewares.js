const { User } = require("../models/user.model");
const { response } = require('express');
const { catchAsync } = require("../helpers/catchAsync");
const { AppError } = require("../helpers/appError");


const userExists = catchAsync(async (req, res = response, next) => {

    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
        return next(new AppError('User not found given that id', 404));
    }

    if (user.status !== 'available') {
        return next(new AppError('User not found given that id', 404));
    }

    req.user = user;
    next();
});

const emailExist = catchAsync(async (req, res = response, next) => {

    const { name, email, password, role } = req.body

    const emailExists = await User.findOne({
        where: {
            email
        }
    })

    if (emailExists) {
        return next(new AppError('There is already a user with that email', 400));
    }

    req.user = { name, email, password, role };
    console.log(req.user)
    next()
})



module.exports = {
    userExists,
    emailExist
}