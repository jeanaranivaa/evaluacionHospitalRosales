/*
Campos:
    idPatient
    diagnosis
    medications[{ medicineName }]
    medicalNotes
*/

import mongoose, { Schema, model } from "mongoose";

const clinicalRecordsSchema = new Schema(
    {
        idPatient: { type: mongoose.Schema.Types.ObjectId, ref: "Patients" },
        diagnosis: { type: String },
        medications: [{
            medicineName: { type: String }
        }],
        medicalNotes: { type: String },
    }, {
    timestamps: true,
    strict: false
    }
)

export default model("clinicalRecords", clinicalRecordsSchema)