/*

path: api/login
*/
const { Router } = require("express");
const { check } = require("express-validator");
const { validFields} = require("../middlewares/valid-fields");
const { createUser, login, renewToken } = require("../controller/auth");
const { validarJWT } = require("../middlewares/valid-jwt");

const router = Router();

router.post("/new",[
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password debe ser de 6 caracteres').isLength({min: 6}),
    validFields

], createUser);

router.post("/",[
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password debe ser de 6 caracteres').isLength({min: 6}),
    validFields
], login);

//validarJWT
router.get("/renew", validarJWT,renewToken);

module.exports = router;
