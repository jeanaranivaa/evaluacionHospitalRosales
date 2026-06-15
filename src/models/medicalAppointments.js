/*
    patient_id
    specialty_id
    appointmentDate
    reason
    status
    observations
*/

import mongoose, { Schema, model } from "mongoose";

const medicalAppointmentsSchema = new Schema(
    {
        idPatient: { type:  mongoose.Schema.Types.ObjectId, ref: "Patients" },
        idSpecialty: { type: mongoose.Schema.Types.ObjectId, ref: "Specialty" },
        appointmentDate: {type: Date},
        reason: {type: String},
        status: {type: Boolean},
        observations: {type: String}
    }, {
        timestamps: true,
        strict: false
    }
)

export default model ("medicalAppointments", medicalAppointmentsSchema)