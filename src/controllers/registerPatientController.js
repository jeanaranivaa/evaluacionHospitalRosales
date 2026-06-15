import nodemailer from "nodemailer";
import crypto from "crypto";
import jsonwebtoken from "jsonwebtoken";
import bcryptjs from "bcryptjs"

import patientModel from "../models/patients.js"

import { config } from "../../config.js"
import { register } from "module";

const registerPatientController = {};

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
            nameEmergencyContact,
            profilePhoto,
            isVerified,
            loginAttempts,
            timeOut,
        } = req.body;

        const existsPatient = await patientModel.findOne({ email });

        if (existsPatient) {
            return res.status(400).json({ message: "Patient already exists" })
        }

        const passwordHashed = await bcryptjs.hash(password, 10)

        const randomCode = crypto.randomBytes(3).toString("hex");

        const token = jsonwebtoken.sign({
            randomCode,
            name,
            lastName,
            email,
            password: passwordHashed,
            birthDate,
            phone,
            address,
            phoneEmergencyContacts,
            nameEmergencyContact,
            isVerified,
            loginAttempts,
            timeOut,
            profilePhoto: req.file.path,
            public_id: req.file.filename
        },
            config.JWT.secret,
            { expiresIn: "15m" }
        );

        res.cookie("registrationCookie", token, {maxAge: 15*60*1000});

        const transporter = nodemailer.createTransport ({
            service: "gmail",
            auth: {
                user: config.email.user_email,
                pass: config.email.user_password,
            },
        });

    } catch (error) {

    }
}