const { Router } = require("express");
const { check } = require("express-validator");
const { createUser, updateUser, deleteUser, getUser, getUsers, login } = require("../controllers/user.controller");
const { userExists, emailExist, existUserPerEmail, isValidRole, protectAccountOwner, protectToken } = require("../middlewares/users.middlewares");
const { validateFields } = require("../middlewares/validate-fields");
const router = Router();



router.post(
    '/login',
    [
        check('email', 'the email does not have a correct format').isEmail(),
        check('password', 'The password must have at least 8 characters').isLength({ min: 8 }),
        validateFields,
        existUserPerEmail
    ], login)

router.post(
    '/',
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio y debe tener formato correcto').isEmail(),
        check('password', 'El password debe ser mayor de 5 caracteres').isLength({ min: 6 }),
        check('role', 'El rol es obligatorio').not().isEmpty(),
        validateFields,
        emailExist,
        isValidRole
    ],
    createUser);

router.use(protectToken)

router.patch(
    '/:id',
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio y debe tener formato correcto').isEmail(),
        validateFields,
        userExists,
        protectAccountOwner
    ],
    updateUser)

router.delete('/:id', userExists, protectAccountOwner, deleteUser);

router.get('/', getUsers);

router.get('/:id', userExists, getUser);


module.exports = {
    usersRouter: router
}
