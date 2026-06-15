import express from "express";
import clinicalRecordsController from "../controllers/clinicalRecordsController.js"

const router = express.Router();

router.route("/")
    .get(clinicalRecordsController.getRecords)
    .post(clinicalRecordsController.insertRecords)

router
    .route("/:id")
    .put(clinicalRecordsController.updateRecords)
    .delete(clinicalRecordsController.deleteRecords);

export default router;