import express from "express";
import patientController from "../controllers/patientsController.js";

const router = express.Router();

router.route("/")
.get(patientController.getPatients);

router
.route("/:id")
.put(patientController.updatePatients)
.delete(patientController.deletePatient);

export default router;