import patientModel from "../models/patients.js";

const patientController = {};

//Select
patientController.getPatients = async (req, res) => {
    try {
        const patients = await patientModel.find();
        return res.status(200).json(patients);
    } catch (error) {
        console.log("error"+error);
        return res.status(500).json({ message: "Internal server error" }); 
    }
};

patientController.updatePatients = async (req, res) => {
    try {
        let {name, lastName, email, password, birthDate, phone, address, isVerified} = req.body;
        name = name?.trim();
        email = name?.trim();

        if(!name || !email || !password) {
            return res.status(400).json({message: "Fields required"});
        }

        if(name.length < 3 || name.length > 15){
            return res.status(400).json({message: "Please insert valid name"});
        }

        const patientUpdated = await patientModel.findByIdAndUpdate(req.params.id,
            {
                name,
                lastName,
                email,
                password,
                birthDate,
                phone,
                address, 
                isVerified,
            },
            { new: true},
        );

        if (!patientUpdated){
            return res.status(404).json({message: "Patient not found"});
        }

        return res.status(200).json({message: "Patient updated"});
    } catch (error) {
        console.log("error"+error);
        return res.status(500).json({message: "Internal server error"})
    }
};

//Eliminar

patientController.deletePatient = async (req, res) => {
    try {
        const deletedPatient = patientModel.findByIdAndDelete(req.params.id);

        if(!deletedPatient){
            return res.status(404).json({message: "Patient not found"});
        }

        return res.status(200).json({message: "Patient deleted"})
    } catch (error) {
        console.log("error"+error);
        return res.status(500).json({message: "Internal server error"});
    }
};

export default patientController;


