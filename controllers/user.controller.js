const { response } = require('express');

const { User } = require('../models/user.model');

const { catchAsync } = require('../helpers/catchAsync');

const getUsers = catchAsync(async (req, res = response, next) => {
    const users = await User.findAll();

    res.status(200).json({
        users,
    })
});

const getUser = catchAsync(async (req, res = response, next) => {

    const { user } = req;

    if (user) {
        res.status(200).json({
            user
        })
    }

});

const createUser = catchAsync(async (req, res = response, next) => {
    const { user } = req;

    console.log(user)

    const usr = new User(user);
    await usr.save();

    return res.json(usr)

})


const updateUser = catchAsync(async (req, res = response, next) => {
    const { name, email } = req.body;

    const { user } = req;

    await user.update({ name, email });

    res.status(201).json({
        msg: 'User updated successfully',
        user
    })

});

const deleteUser = catchAsync(async (req, res = response, next) => {

    const { user } = req;

    await user.update({ status: 'inactive' })

    res.json(user)
});

module.exports = {
    createUser,
    getUser,
    getUsers,
    updateUser,
    deleteUser
}