import express from "express";
import medicalAppointmentsController from "../controllers/medicalAppointmentsController.js"

const router = express.Router();

router.route("/")
.get(medicalAppointmentsController.getAppointments)
.post(medicalAppointmentsController.insertAppointments)

router
.route("/:id")
.put(medicalAppointmentsController.updateAppointments)
.delete(medicalAppointmentsController.deleteAppointments);

export default router;