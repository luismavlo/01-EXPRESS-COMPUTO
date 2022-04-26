const { response } = require('express');
const { User } = require('../models/user.model');

const getUsers = async (req, res = response) => {
    try {
        const users = await User.findAll();

        res.status(200).json({
            users,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }
};

const getUser = async (req, res = response) => {
    try {

        const { user } = req;

        if (user) {
            res.status(200).json({
                user
            })
        }


    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }


}

const createUser = async (req, res = response) => {
    const { body } = req;

    try {
        const emailExists = await User.findOne({
            where: {
                email: body.email
            }
        })

        if (emailExists) {
            return res.status(400).json({
                msg: 'Ya existe un usuario con el email' + body.email
            });
        }

        const user = new User(body);
        await user.save();

        res.json(user)

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }
}


const updateUser = async (req, res = response) => {
    const { name, email } = req.body;

    try {
        const { user } = req;

        await user.update({ name, email });

        res.status(201).json({
            msg: 'User updated successfully',
            user
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }
}

const deleteUser = async (req, res = response) => {
    try {
        const { user } = req;

        await user.update({ status: 'inactive' })

        res.json(user)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }
}

module.exports = {
    createUser,
    getUser,
    getUsers,
    updateUser,
    deleteUser
}