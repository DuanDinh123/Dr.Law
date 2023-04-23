import express from "express";

import { createMedicalHistoryMiddleware } from "~/middleware/medical-history/create-medical-history.middleware";
import { deleteMedicalHistoryMiddleware } from "~/middleware/medical-history/delete-medical-history.middleware";
import { readMedicalHistoryMiddleware } from "~/middleware/medical-history/read-medical-history.middleware";
import { updateMedicalHistoryMiddleware } from "~/middleware/medical-history/update-medical-history.middleware";

import MedicalHistoryController from "./medical-history.controller";

const medicalHistoryRouter = express.Router();
medicalHistoryRouter.post("/create", createMedicalHistoryMiddleware, MedicalHistoryController.createMedicalHistory);
medicalHistoryRouter.get("/list", readMedicalHistoryMiddleware, MedicalHistoryController.getMedicalHistoies);
medicalHistoryRouter.get("/single/:id", readMedicalHistoryMiddleware, MedicalHistoryController.getMedicalHistory);
medicalHistoryRouter.put("/update/:id", updateMedicalHistoryMiddleware, MedicalHistoryController.updateMedicalHistory);
medicalHistoryRouter.delete("/delete/:id", deleteMedicalHistoryMiddleware, MedicalHistoryController.deleteMedicalHistory);

export default medicalHistoryRouter;