const Member = require("../models/Member");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const axios = require("axios");
const jwt = require('jsonwebtoken');
require('dotenv').config();

//Peticiones a la api

//Obtener todos los usuarios
const getMembers = async (req, res) => {
  try {
    const members = await Member.find();
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Obtener un usuario por id
const getMemberById = async (req, res) => {
  const { id } = req.params;

  try {
    const member = await Member.findById(id);

    if (!member) {
      return res.status(404).json({ message: "Miembro no encontrado" });
    }

    res.json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Crear un usuario
const addMember = async (req, res) => {
  console.log("📥 Datos recibidos en req.body:", req.body);

  const { nombre, apellidos, nombreUser, email, password } =
    req.body;
  try {
    const existingMember = await Member.findOne({ email });
    const existingMemberUser = await Member.findOne({ nombreUser });
    if (existingMember) {
      return res
        .status(410)
        .json({ message: "El correo electrónico ya está registrado" });
    }
    if (existingMemberUser) {
      return res
        .status(412)  
        .json({ message: "El nombre de usuario ya está registrado" });

    }
    //Nuevo usuario constante
    const newMember = new Member({
      nombre,
      apellidos,
      nombreUser,
      email,
      password,
    });

    //Guardar el usuario y a su vez encriptar la contraseña
    const savedMember = await newMember.save(); //
    const memberObj = savedMember.toObject();
    delete memberObj.password; // Eliminar la contraseña del objeto de respuesta
    res.status(201).json(memberObj);
  } catch (error) {
    console.error("❌ Error en addMember:", error);
    res.status(400).json({ message: error.message });
  }
};

//Login de usuario
const loginMember = async (req, res) => {
  console.log("📥 Login recibido en backend:", req.body);

  const { email, nombreUSer, password } = req.body;

  try {
 
    if (await Member.findOne({ nombreUSer })) {
      member = await Member.findOne({ nombreUSer });
    } else if (await Member.findOne({ email })) {
      member = await Member.findOne({ email });
    }
 


    if (!member) {
      console.log("❌ Usuario no encontrado");

      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    const isMatch = await bcrypt.compare(password, member.password);
    if (!isMatch) {
      console.log("❌ Contraseña incorrecta");

      return res.status(400).json({ message: "Contraseña incorrecta" });
    }
    //console.log("✅ Login exitoso:", member.email);

    const token = jwt.sign({ userId: member._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });


    res.status(200).json({
      message: "Inicio de sesión exitoso",
      user: {
        id: member._id,
        nombre: member.nombre,
        apellidos: member.apellidos,
        email: member.email,
        nombreUSer: member.nombreUSer,
      },
      token, // Enviar el token al cliente
    });
  } catch (error) {
    console.error("🔥 Error inesperado:", error);

    res.status(500).json({ message: error.message });
  }
};


// Manda correo de restablecer contraseña 
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const token = crypto.randomBytes(32).toString("hex");
    const resetLink = `http://localhost:3001/reset-password?token=${token}`;

    console.log("📧 Antes, Intentando enviar correo a:", email);
    console.log("🔗 Enlace generado:", resetLink);
    console.log("🔐 EMAIL_FROM:", process.env.EMAIL_FROM);
    console.log(
      "🔐 EMAIL_PASS:",
      process.env.EMAIL_PASS ? "✔️ cargada" : "❌ vacía"
    );
    const user = await Member.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    user.resetToken = token;
    user.resetTokenExpires = Date.now() + 15 * 60 * 1000;  // toquen exppira en 15 minutos
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Restablecimiento de contraseña",
      html: `
            <div style="font-family: Arial, sans-serif; background-color: #f8f9fa; padding: 20px;">
              <div style="max-width: 500px; margin: auto; background-color: #fff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
                <h2 style="color: #333; text-align: center;">🔒 Restablecer tu contraseña</h2>
                <p style="font-size: 16px; color: #555;">
                  Hemos recibido una solicitud para restablecer tu contraseña. Si no fuiste tú, puedes ignorar este correo.
                </p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${resetLink}" style="background-color: #FFEB3B; color: #000; padding: 12px 20px; border-radius: 4px; text-decoration: none; font-weight: bold;">
                    Cambiar contraseña
                  </a>
                </div>
                <p style="font-size: 14px; color: #777;">
                  También puedes copiar y pegar este enlace en tu navegador:<br>
                  <a href="${resetLink}" style="color: #1a73e8;">${resetLink}</a>
                </p>
                <p style="font-size: 13px; color: #999; text-align: center; margin-top: 40px;">
                  Este enlace expirará en 15 minutos.
                </p>
              </div>
            </div>
            `,
    });

    console.log("📧 Despues, Intentando enviar correo a:", email);
    console.log("🔗 Enlace generado:", resetLink);
    console.log("🔐 EMAIL_FROM:", process.env.EMAIL_FROM);
    console.log(
      "🔐 EMAIL_PASS:",
      process.env.EMAIL_PASS ? "✔️ cargada" : "❌ vacía"
    );

    res.status(200).json({ message: "Correo enviado" });
  } catch (err) {
    console.error("❌ Error al enviar correo:", err);

    res.status(500).json({ message: "Error al enviar correo" });
  }
};


//Restablecer contraseña con token
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await Member.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Token inválido o expirado" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error("❌ Error en resetPassword:", error);
    res.status(500).json({ message: "Error al actualizar contraseña" });
  }
};

// Validacion del token de restablecimiento

const validateResetToken = async (req, res) => {
  const { token } = req.body;

  try {
    const user = await Member.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Token inválido o expirado" });
    }

    res.status(200).json({ message: "Token válido" });
  } catch (err) {
    res.status(500).json({ message: "Error al validar token" });
  }
};
module.exports = {
  getMembers,
  addMember,
  getMemberById,
  loginMember,
  forgotPassword,
  validateResetToken,
  resetPassword
};
