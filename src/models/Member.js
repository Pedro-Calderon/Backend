const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const MemberSchema = new mongoose.Schema({
  nombre: { 
    type: String, 
    required: true },
  apellidos: { 
    type: String,
    required: true },
  nombreUSer: {
    type: String,
    required: true, },
  email: {
     type: String, 
     required: true, 
     unique: true },
  password: {
    type: String,
    required: true,
  },
  resetToken: { 
    type: String },
  resetTokenExpires: { 
    type: Date },
});


//Encripta la contraseña antes de guardarla en la base de datos
MemberSchema.pre("save", async function (next) {
  const member = this;
  if (!member.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    member.password = await bcrypt.hash(member.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Member", MemberSchema);
