import express from "express";

import { createMedicalMiddleware } from "~/middleware/medical/create-medical.middleware";
import { deleteMedicalMiddleware } from "~/middleware/medical/delete-medical.middleware";
import { readMedicalMiddleware } from "~/middleware/medical/read-medical.middleware";
import { updateMedicalMiddleware } from "~/middleware/medical/update-medical.middleware";

import MedicalController from "./medical.controller";

const medicalRouter = express.Router();
medicalRouter.post("/create", createMedicalMiddleware, MedicalController.createMedical);
medicalRouter.get("/list", readMedicalMiddleware, MedicalController.getMedicals);
medicalRouter.get("/single/:id", readMedicalMiddleware, MedicalController.getMedical);
medicalRouter.put("/update/:id", updateMedicalMiddleware, MedicalController.updateMedical);
medicalRouter.delete("/delete/:id", deleteMedicalMiddleware, MedicalController.deleteMedical);
medicalRouter.post("/payment", createMedicalMiddleware, MedicalController.payment);
medicalRouter.get("/tip-by-user", readMedicalMiddleware, MedicalController.detailTipByUser);
medicalRouter.post("/create-prescription", readMedicalMiddleware, MedicalController.addPrescription);
export default medicalRouter;
