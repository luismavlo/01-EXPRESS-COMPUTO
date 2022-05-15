const { Repair } = require("../models/repair.model");
const { response } = require('express');
const { User } = require("../models/user.model");
const { AppError } = require("../helpers/appError");
const { catchAsync } = require("../helpers/catchAsync");


const repairExists = catchAsync(async (req, res = response, next) => {

    const { id } = req.params;

    const repair = await Repair.findOne({ where: { id }, include: [{ model: User, attributes: { exclude: ['password'] } }] });


    if (!repair) {
        return next(new AppError('Repair not found given that id', 404))
    }

    req.repair = repair;
    next();

})

const userExist = catchAsync(async (req, res = response, next) => {

    const { userId } = req.body
    const user = await User.findByPk(userId);

    if (!user || user.status === 'inactive') {
        return next(new AppError('there is no user with that id or it is inactive', 404))
    }

    next();
});

module.exports = {
    repairExists,
    userExist
}
