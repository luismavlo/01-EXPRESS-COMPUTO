const { Router } = require("express");
const { check } = require("express-validator");
const { getRepairs, getRepair, createRepair, updateRepair, deleteRepair } = require("../controllers/repair.controller");
const { repairExists, userExist } = require("../middlewares/repair.middlewares");
const { protectToken, protectEmployee } = require("../middlewares/users.middlewares");
const { validateFields } = require("../middlewares/validate-fields");
const router = Router();

router.use(protectToken)

router.get('/', protectEmployee, getRepairs);

router.get('/:id', protectEmployee, repairExists, getRepair);


router.post(
    '/',
    [
        check('date', 'The date is required').not().isEmpty(),
        check('computerNumber', 'the computer number is mandatory').not().isEmpty(),
        check('comments', 'comments are required').not().isEmpty(),
        validateFields,
        userExist,
        protectEmployee
    ],
    createRepair
)

router.patch(
    '/:id',
    [
        check('status', 'The status is mandatory').not().isEmpty(),
        validateFields,
        repairExists,
        protectEmployee
    ],
    updateRepair
)

router.delete('/:id', protectEmployee, repairExists, deleteRepair);

module.exports = {
    repairsRouter: router
}