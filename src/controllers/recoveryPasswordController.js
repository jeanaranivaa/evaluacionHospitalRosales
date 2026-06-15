import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";

import HTMLRecoveryEmail from "../utils/sendMailRecovery.js";

import { config } from "../../config.js";

import patientModel from "../models/patients.js";

const recoveryPasswordController = {};

// Solicitar código
recoveryPasswordController.requestCode = async (req, res) => {
  try {
    const { email } = req.body;

    const patientFound = await patientModel.findOne({ email });

    if (!patientFound) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const randomCode = crypto.randomBytes(3).toString("hex");

    const token = jsonwebtoken.sign(
      {
        email,
        randomCode,
        userType: "patient",
        verified: false,
      },
      config.JWT.secret,
      { expiresIn: "15m" },
    );

    res.cookie("recoveryCookie", token, {
      maxAge: 15 * 60 * 1000,
    });

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
      subject: "Recuperación de contraseña",
      html: HTMLRecoveryEmail(randomCode),
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.log(error);
        return res.status(500).json({
          message: "Error sending mail",
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

// Verificar código
recoveryPasswordController.verifyCode = async (req, res) => {
  try {
    const { code } = req.body;

    const token = req.cookies.recoveryCookie;

    const decoded = jsonwebtoken.verify(
      token,
      config.JWT.secret,
    );

    if (code !== decoded.randomCode) {
      return res.status(400).json({
        message: "Invalid code",
      });
    }

    const newToken = jsonwebtoken.sign(
      {
        email: decoded.email,
        userType: "patient",
        verified: true,
      },
      config.JWT.secret,
      { expiresIn: "15m" },
    );

    res.cookie("recoveryCookie", newToken, {
      maxAge: 15 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Code verified successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Nueva contraseña
recoveryPasswordController.newPassword = async (req, res) => {
  try {
    const { newPassword, confirmNewPassword } = req.body;

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        message: "Passwords don't match",
      });
    }

    const token = req.cookies.recoveryCookie;

    const decoded = jsonwebtoken.verify(
      token,
      config.JWT.secret,
    );

    if (!decoded.verified) {
      return res.status(400).json({
        message: "Code not verified",
      });
    }

    const passwordHash = await bcrypt.hash(
      newPassword,
      10,
    );

    await patientModel.findOneAndUpdate(
      { email: decoded.email },
      { password: passwordHash },
      { new: true },
    );

    res.clearCookie("recoveryCookie");

    return res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default recoveryPasswordController;
