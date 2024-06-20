const { response } = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { generateJWT } = require("../helpers/jwt");

const createUser = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const emailExist = await User.findOne({ email });

    if (emailExist) {
      return res.status(400).json({
        ok: false,
        msg: "El correo ya esta registrado",
      });
    }

    const user = new User(req.body);
    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    await user.save();

    // Generar JWT

    const token = await generateJWT(user.id);

    res.json({
      ok: true,
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const userDB = await User.findOne({
      email,
    });

    if (!userDB) {
      return res.status(404).json({
        ok: false,
        msg: "Email no encontrado",
      });
    }

    // Validar el password
    const validPassword = bcrypt.compareSync(password, userDB.password);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "La contraseña no es válida",
      });
    }

    // Generar el JWT
    const token = await generateJWT(userDB.id);

    res.json({
      ok: true,
      user: userDB,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const renewToken = async (req, res = response) => {
  const uid = req.uid;

  // Generar un nuevo JWT y retornarlo en esta petición
  const token = await generateJWT(uid);

  // Obtener el usuario por el UID
  const user = await User.findById(uid);

  res.json({
    ok: true,
    user,
    token,
  });

};

module.exports = {
  createUser,
  login,
  renewToken
};
