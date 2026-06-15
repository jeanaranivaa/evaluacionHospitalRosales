import express from "express";
import medicalSpecialtiesController from "../controllers/medicalSpecialtiesController.js";

const router = express.Router();

router.route("/")
.get(medicalSpecialtiesController.getSpecialities)
.post(medicalSpecialtiesController.insertSpecialities)

router
.route("/:id")
.put(medicalSpecialtiesController.updateSpecialties)
.delete(medicalSpecialtiesController.deleteSpecialities);

export default router;