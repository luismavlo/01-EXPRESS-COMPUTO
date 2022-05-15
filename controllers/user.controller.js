const { response } = require('express');

const { User } = require('../models/user.model');

const { catchAsync } = require('../helpers/catchAsync');
const bcryptjs = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');

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

const login = catchAsync(async (req, res = response, next) => {

    const { user } = req;

    const token = await generateJWT(user.id);

    res.json({
        status: 'success',
        token,
        user: {
            name: user.name,
            uid: user.id
        }
    })
})

const createUser = catchAsync(async (req, res = response, next) => {

    const { name, email, password, role } = req.user;

    const user = new User({ name, email, password, role });

    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);

    await user.save();

    const token = await generateJWT(user.id);

    res.status(201).json({
        status: 'success',
        uid: user.id,
        token
    })

})


const updateUser = catchAsync(async (req, res = response, next) => {
    const { name, email } = req.body;

    const { user } = req;

    await user.update({ name, email });

    res.status(201).json({
        status: 'success'
    })

});

const deleteUser = catchAsync(async (req, res = response, next) => {

    const { user } = req;

    await user.update({ status: 'inactive' })

    res.json({
        status: 'success'
    })
});

module.exports = {
    createUser,
    getUser,
    getUsers,
    updateUser,
    deleteUser,
    login
}