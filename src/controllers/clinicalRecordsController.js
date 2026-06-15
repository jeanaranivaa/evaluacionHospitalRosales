import clinicalRecordsModel from "../models/clinicalRecords.js";

const clinicalRecordsController = {};

clinicalRecordsController.getRecords = async (req, res) => {
    const records = await clinicalRecordsModel.find();
    res.json(records);
};

clinicalRecordsController.insertRecords = async (req, res) => {
    const {idPatient, diagnosis, medications, medicineName, medicalNotes} = req.body;
    const newRecord = new clinicalRecordsModel({
        idPatient,
        diagnosis,
        medications,
        medicineName,
        medicalNotes
    });
    await newRecord.save();
    res.json({message: "Record saved"})
};

clinicalRecordsController.deleteRecords = async (req, res) => {
    await clinicalRecordsModel.findByIdAndDelete(req.params.id);
    res.json({message: "Record deleted"})
};

clinicalRecordsController.updateRecords = async (req, res) => {
    const {idPatient, diagnosis, medications, medicineName, medicalNotes} = req.body;
    await clinicalRecordsModel.findByIdAndDelete(
        req.params.id,
        {idPatient, diagnosis, medications, medicineName, medicalNotes},
        {new: true},
    )

    res.json({message: "Record deleted"})
};

export default clinicalRecordsController;
