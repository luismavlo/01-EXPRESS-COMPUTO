const { Repair } = require("../models/repair.model");
const { response } = require('express');
const { User } = require("../models/user.model");


const repairExists = async (req, res = response, next) => {
    try {
        const { id } = req.params;

        const repair = await Repair.findByPk(id);

        if (!repair) {
            return res.status(404).json({
                status: 'error',
                msg: 'Repair not found given that id', id
            })
        }

        req.repair = repair;
        next();

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }
}

const userExist = async (req, res = response, next) => {
    try {

        const { userId } = req.body
        const user = await User.findByPk(userId);

        if (!user || user.dataValues.status === 'inactive') {
            return res.status(400).json({
                status: 'error',
                msg: 'there is no user with that id or it is inactive'
            })
        }

        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }
}

module.exports = {
    repairExists,
    userExist
}
