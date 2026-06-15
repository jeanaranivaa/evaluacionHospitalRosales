import medicalSpecialtiesModel from "../models/medicalSpecialties.js";

const medicalSpecialtiesController = {}

//Select
medicalSpecialtiesController.getSpecialities = async (req, res) => {
    const specialities = await medicalSpecialtiesModel.find();
    res.json(specialities);
};

//Insert
medicalSpecialtiesController.insertSpecialities = async (req, res) => {
    const { specialtyName, description, isAvailable } = req.body;
    const newSpecialty = new medicalSpecialtiesModel({
        specialtyName,
        description,
        isAvailable
    });

    await newSpecialty.save();
    res.json({ message: "Specialty saved" })
};

//Delete
medicalSpecialtiesController.deleteSpecialities = async (req, res) => {
    await medicalSpecialtiesModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Specialty deleted" });
};

//Update
medicalSpecialtiesController.updateSpecialties = async (req, res) => {
    const { specialtyName, description, isAvailable } = req.body;
    await medicalSpecialtiesModel.findByIdAndUpdate(req.params.id,
        { specialtyName, description, isAvailable },
        { new: true },
    );

    res.json({message: "Specialty updated"})
};

export default medicalSpecialtiesController;
