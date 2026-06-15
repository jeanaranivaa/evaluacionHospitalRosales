/* Campos: 
        name
        lastName
        email
        password
        birthDate
        phone
        address
        phoneEmergencyContact[{
            phone,
            nameEmergencyContact
            }]
        profilePhoto
        isVerified
        loginAttempts
        timeOut
*/ 

import { Schema, model } from "mongoose";

const patientsSchema = new Schema ({
    name: {type: String},
    lastName: {type: String},
    email: {type: String},
    password: {type: String},
    birthDate: {type: Date},
    phone: {type: String},
    address: {type: String},
    phoneEmergencyContacts: [{
        phone: {type: String},
        nameEmergencyContact: {type: String}
    }],
    profilePhoto: {type: String},
    isVerified: {type: Boolean},
    loginAttempts: {type: Number},
    timeOut: {type: Date}
}, {
    timestamps: true,
    strict: false
})

export default model ("Patient", patientsSchema)