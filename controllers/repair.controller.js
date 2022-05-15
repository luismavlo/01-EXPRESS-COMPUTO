const { response } = require('express');
const { catchAsync } = require('../helpers/catchAsync');
const { Repair } = require('../models/repair.model');
const { User } = require('../models/user.model');


const getRepairs = catchAsync(async (req, res = response, next) => {
    const repairs = await Repair.findAll({ include: [{ model: User, attributes: { exclude: ['password'] } }] });

    const repairsFiltered = repairs.filter(repair => repair.status === 'pending')


    res.status(200).json({
        repairsFiltered,
    })

});

const getRepair = catchAsync(async (req, res = response, next) => {
    const { repair } = req;

    if (repair.status === 'pending') {
        res.status(200).json({
            repair,
        })
    } else if (repair.status === 'completed') {
        res.status(200).json({
            msg: 'the repair you seek has been completed'
        })
    } else if (repair.status === 'cancelled') {
        res.status(200).json({
            msg: 'the repair you seek has been cancelled'
        })
    }

});

const createRepair = catchAsync(async (req, res = response, next) => {
    const { date, userId, computerNumber, comments } = req.body;

    const repair = new Repair({ date, userId, computerNumber, comments });
    await repair.save();

    res.status(200).json({
        repair
    })

});

const updateRepair = catchAsync(async (req, res = response, next) => {

    const { status } = req.body

    const { repair } = req;



    await repair.update({ status });

    res.status(201).json({
        msg: 'Repair updated successfully',
        repair
    })

});

const deleteRepair = catchAsync(async (req, res = response, next) => {

    const { repair } = req;

    await repair.update({ status: 'cancelled' })

    res.status(200).json({
        msg: 'Deletion done successfully',
        repair,
    })

});

module.exports = {
    getRepair,
    getRepairs,
    createRepair,
    updateRepair,
    deleteRepair
}
