import medicalAppointmentsModel from "../models/medicalAppointments.js";

const medicalAppointmentsController = {}

medicalAppointmentsController.getAppointments = async (req, res) => {
    const appointments = await medicalAppointmentsModel.find();
    res.json(appointments);
};

medicalAppointmentsController.insertAppointments = async (req, res) => {
    const { idPatient, idSpecialty, appointmentDate, reason, status, observations } = req.body;
    const newAppointment = new medicalAppointmentsModel({
        idPatient,
        idSpecialty,
        appointmentDate,
        reason,
        status,
        observations
    });
    await newAppointment.save();
    res.json({ message: "Appointment saved" })
};

medicalAppointmentsController.deleteAppointments = async (req, res) => {
    await medicalAppointmentsModel.findByIdAndDelete(req.params.id);
    res.json({message: "Appointment deleted"})
};

medicalAppointmentsController.updateAppointments = async (req, res) => {
    const {idPatient, idSpecialty, appointmentDate, reason, status, observations} = req.body;
    await medicalAppointmentsModel.findByIdAndDelete(
        req.params.id,
        { idPatient, idSpecialty, appointmentDate, reason, status, observations},
        {new: true},
    );

    res.json({message: "Appointment updated"})
};

export default medicalAppointmentsController;