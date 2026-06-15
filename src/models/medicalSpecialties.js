/*
    Campos:
    specialtyName
    description
    isAvailable
*/ 

import { Schema, model } from "mongoose";

const medicalSpecialtiesSchema = new Schema ({
    specialtyName: {type: String},
    description: {type: String},
    isAvailable: {type: Boolean},
}, {
    timestamps: true,
    strict: false
})

export default model ("MedicalSpecialities", medicalSpecialtiesSchema)