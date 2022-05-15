const { User } = require("../models/user.model");
const { response } = require('express');
const { catchAsync } = require("../helpers/catchAsync");
const { AppError } = require("../helpers/appError");
const jwt = require('jsonwebtoken');


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

    const { name, email, password, role = 'normal' } = req.body;


    const existE = await User.findOne({
        where: {
            email,
            status: 'available'
        }
    })

    if (existE) {
        return next(new AppError('There is already a user with that email', 400));
    }

    req.user = { name, email, password, role };
    next();
});

const existUserPerEmail = catchAsync(async (req, res = response, next) => {
    const { email } = req.body;

    const user = await User.findOne({ where: { email, status: 'available' } })

    if (!user) {
        return next(new AppError('The user is not registered', 400));
    }

    req.user = user;
    next();
});

const validPassword = catchAsync(async (req, res = response, next) => {
    const { user } = req;
    const { password } = req.body;

    if (!(await bcrypt.compare(password, user.password))) {
        return next(new AppError('Invalid credential', 400));
    }

    next();
});

const isValidRole = catchAsync(async (req, res = response, next) => {
    const { role } = req.body;

    if (role !== 'client' && role !== 'employee') {
        return next(new AppError('the role is not allowed', 400));
    }

    next();
});

const protectToken = catchAsync(async (req, res = response, next) => {
    let token;


    //extract token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('Session invalid', 403))
    }

    //validate token
    const decoded = await jwt.verify(token, process.env.SECRET_JWT_SEED);

    const user = await User.findOne({ where: { id: decoded.id, status: 'available' } });

    if (!user) {
        return next(new AppError('The owner of this token is not longer available', 403))
    }

    req.sessionUser = user;

    next();
});

const protectEmployee = catchAsync(async (req, res = response, next) => {

    console.log(req.sessionUser)

    if (req.sessionUser.role !== 'employee') {
        return next(new AppError('Access no granted', 403))
    }

    next();
});


const protectAccountOwner = catchAsync(async (req, res = response, next) => {

    const { sessionUser, user } = req;

    if (sessionUser.id !== user.id) {
        return next(new AppError('You do not own this account', 403))
    }

    next();

});


module.exports = {
    userExists,
    emailExist,
    existUserPerEmail,
    validPassword,
    isValidRole,
    protectAccountOwner,
    protectEmployee,
    protectToken
}