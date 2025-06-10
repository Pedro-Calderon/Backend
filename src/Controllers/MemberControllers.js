const Member = require("../models/Member");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const axios = require("axios");

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

  const { nombre, apellidos, nombreUSer, email, password } =
    req.body;
  try {
    const existingMember = await Member.findOne({ email });
    if (existingMember) {
      return res
        .status(410)
        .json({ message: "El correo electrónico ya está registrado" });
    }
    //Nuevo usuario constante
    const newMember = new Member({
      nombre,
      apellidos,
      nombreUSer,
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