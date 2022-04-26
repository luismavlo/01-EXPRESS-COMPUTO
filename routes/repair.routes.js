const { Router } = require("express");
const { check } = require("express-validator");
const { getRepairs, getRepair, createRepair, updateRepair, deleteRepair } = require("../controllers/repair.controller");
const { repairExists, userExist } = require("../middlewares/repair.middlewares");
const { validateFields } = require("../middlewares/validate-fields");
const router = Router();

router.get('/', getRepairs);

router.get('/:id', repairExists, getRepair);


router.post(
    '/',
    [
        check('date', 'La fecha es obligatoria').not().isEmpty(),
        validateFields
    ],
    userExist,
    createRepair
)

router.patch(
    '/:id',
    [
        check('status', 'El estado es obligatorio').not().isEmpty(),
        validateFields
    ],
    repairExists,
    updateRepair
)

router.delete('/:id', repairExists, deleteRepair);

module.exports = {
    repairsRouter: router
}