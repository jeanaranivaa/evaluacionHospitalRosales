import nodemailer from "nodemailer";
import crypto from "crypto";
import jsonwebtoken from "jsonwebtoken";
import bcryptjs from "bcryptjs";

import patientModel from "../models/patients.js";

import { config } from "../../config.js";

const registerPatientController = {};

// REGISTRAR PACIENTE
registerPatientController.register = async (req, res) => {
  try {
    const {
      name,
      lastName,
      email,
      password,
      birthDate,
      phone,
      address,
      phoneEmergencyContacts,
      isVerified,
      loginAttempts,
      timeOut,
    } = req.body;

    // Verificar si el paciente ya existe
    const existsPatient = await patientModel.findOne({ email });

    if (existsPatient) {
      return res.status(400).json({
        message: "Patient already exists",
      });
    }

    // Encriptar contraseña
    const passwordHashed = await bcryptjs.hash(password, 10);

    // Generar código de verificación
    const randomCode = crypto.randomBytes(3).toString("hex");

    // Crear token temporal
    const token = jsonwebtoken.sign(
      {
        randomCode,
        name,
        lastName,
        email,
        password: passwordHashed,
        birthDate,
        phone,
        address,
        phoneEmergencyContacts,
        profilePhoto: req.file?.path,
        isVerified,
        loginAttempts,
        timeOut,
      },
      config.JWT.secret,
      { expiresIn: "15m" }
    );

    // Guardar token en cookie
    res.cookie("registrationCookie", token, {
      maxAge: 15 * 60 * 1000,
      httpOnly: true,
    });

    // Configuración del correo
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.email.user_email,
        pass: config.email.user_password,
      },
    });

    const mailOptions = {
      from: config.email.user_email,
      to: email,
      subject: "Verificación de cuenta",
      text: `Para verificar tu cuenta utiliza este código: ${randomCode}. Expira en 15 minutos.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);

        return res.status(500).json({
          message: "Error sending email",
        });
      }

      return res.status(200).json({
        message: "Email sent",
      });
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// VERIFICAR CÓDIGO
registerPatientController.verifyCode = async (req, res) => {
  try {
    const { verificationCodeRequest } = req.body;

    const token = req.cookies.registrationCookie;

    if (!token) {
      return res.status(400).json({
        message: "Verification token not found",
      });
    }

    const decoded = jsonwebtoken.verify(
      token,
      config.JWT.secret
    );

    const {
      randomCode: storedCode,
      name,
      lastName,
      email,
      password,
      birthDate,
      phone,
      address,
      phoneEmergencyContacts,
      profilePhoto,
      loginAttempts,
      timeOut,
    } = decoded;

    // Comparar códigos
    if (verificationCodeRequest !== storedCode) {
      return res.status(400).json({
        message: "Invalid code",
      });
    }

    // Crear paciente
    const newPatient = new patientModel({
      name,
      lastName,
      email,
      password,
      birthDate,
      phone,
      address,
      phoneEmergencyContacts,
      profilePhoto,
      isVerified: true,
      loginAttempts: loginAttempts || 0,
      timeOut,
    });

    await newPatient.save();

    // Eliminar cookie
    res.clearCookie("registrationCookie");

    return res.status(200).json({
      message: "Patient registered successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default registerPatientController;
