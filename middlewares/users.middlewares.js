const { User } = require("../models/user.model");
const { response } = require('express');

const userExists = async (req, res = response, next) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({
                status: 'error',
                msg: 'User not found given that id', id
            });
        }

        req.user = user;
        next();

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }
}

module.exports = {
    userExists
}