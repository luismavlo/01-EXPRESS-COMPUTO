const { Router } = require("express");
const { check } = require("express-validator");
const { createUser, updateUser, deleteUser, getUser, getUsers } = require("../controllers/user.controller");
const { userExists, emailExist } = require("../middlewares/users.middlewares");
const { validateFields } = require("../middlewares/validate-fields");
const router = Router();


router.get('/', getUsers);

router.get('/:id', userExists, getUser);

router.post(
    '/',
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio y debe tener formato correcto').isEmail(),
        check('password', 'El password debe ser mayor de 5 caracteres').isLength({ min: 6 }),
        check('role', 'El rol es obligatorio').not().isEmpty(),
        validateFields,
        emailExist
    ],
    createUser);

router.patch(
    '/:id',
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio y debe tener formato correcto').isEmail(),
        validateFields
    ],
    userExists
    ,
    updateUser)

router.delete('/:id', userExists, deleteUser)


module.exports = {
    usersRouter: router
}
