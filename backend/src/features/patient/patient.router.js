import express from "express";

import { createPatientMiddleware } from "~/middleware/patient/create-patient.middleware";
import { deletePatientMiddleware } from "~/middleware/patient/delete-patient.middleware";
import { readPatientMiddleware } from "~/middleware/patient/read-patient.middleware";
import { updatePatientMiddleware } from "~/middleware/patient/update-patient.middleware";

import PatientController from "./patient.controller";

const patientRouter = express.Router();
patientRouter.post("/create", createPatientMiddleware, PatientController.createPatient);
patientRouter.get("/list", readPatientMiddleware, PatientController.getPatients);
patientRouter.get("/single/:id", readPatientMiddleware, PatientController.getPatient);
patientRouter.put("/update/:id", updatePatientMiddleware, PatientController.updatePatient);
patientRouter.delete("/delete/:id", deletePatientMiddleware, PatientController.deletePatient);
patientRouter.get("/potential", readPatientMiddleware, PatientController.getPotential);

export default patientRouter;
