import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import patientsRoutes from "./src/routes/patients.js";
import medicalSpecialtiesRoutes from "./src/routes/medicalSpecialties.js";
import medicalAppointmentsRoutes from "./src/routes/medicalAppointments.js";
import clinicalRecordsRoutes from "./src/routes/clinicalRecords.js"
import registerPatientsRoutes from "./src/routes/registerPatient.js"
import loginPatientsRoutes from "./src/routes/loginPatient.js"
import logoutRoutes from "./src/routes/logout.js"

const app = express();

app.use(
    cors({
        origin: ["http://localhost:5173", "http://localhost:5174"],
        credentials: true,
    }),
);

app.use(cookieParser());
app.use(express.json());
app.use("/api/patients", patientsRoutes);
app.use("/api/specialities", medicalSpecialtiesRoutes);
app.use("/api/appointments", medicalAppointmentsRoutes);
app.use("/api/records", clinicalRecordsRoutes);
app.use("/api/register", registerPatientsRoutes);
app.use("/api/login", loginPatientsRoutes);
app.use("/api/logout", logoutRoutes)


export default app;