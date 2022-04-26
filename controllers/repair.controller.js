const { response } = require('express');
const { Repair } = require('../models/repair.model');


const getRepairs = async (req, res = response) => {
    try {
        const repairs = await Repair.findAll();

        const repairsFiltered = repairs.filter(repair => repair.dataValues.status === 'pending')

        res.status(200).json({
            repairsFiltered,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }
};

const getRepair = async (req, res = response) => {
    try {

        const { repair } = req;

        if (repair.dataValues.status === 'pending') {
            if (repair) {
                res.status(200).json({
                    repair
                })
            }
        } else {
            res.status(200).json({
                msg: 'the repair you seek has been completed or canceled'
            })
        }



    } catch (error) {

    }
}

const createRepair = async (req, res = response) => {
    const { body } = req;


    try {


        const repair = new Repair(body);
        await repair.save();

        res.status(200).json({
            repair
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador - controller'
        })
    }
}

const updateRepair = async (req, res = response) => {

    const { status } = req.body

    try {

        const { repair } = req;

        await repair.update({ status });

        res.status(201).json({
            msg: 'Repair updated successfully',
            repair
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }
}

const deleteRepair = async (req, res = response) => {
    try {

        const { repair } = req;

        await repair.update({ status: 'cancelled' })

        res.status(200).json({
            msg: 'Deletion done successfully',
            repair,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }
}

module.exports = {
    getRepair,
    getRepairs,
    createRepair,
    updateRepair,
    deleteRepair
}
