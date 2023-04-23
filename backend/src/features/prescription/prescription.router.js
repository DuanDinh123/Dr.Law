import express from "express";

import { createPrescriptionMiddleware } from "~/middleware/prescription/create-prescription.middleware";
import { deletePrescriptionMiddleware } from "~/middleware/prescription/delete-prescription.middleware";
import { readPrescriptionMiddleware } from "~/middleware/prescription/read-prescription.middleware";
import { updatePrescriptionMiddleware } from "~/middleware/prescription/update-prescription.middleware";

import PrescriptionController from "./prescription.controller";

const prescriptionRouter = express.Router();
prescriptionRouter.post("/create", createPrescriptionMiddleware, PrescriptionController.createPrescription);
prescriptionRouter.get("/list", readPrescriptionMiddleware, PrescriptionController.getPrescriptions);
prescriptionRouter.get("/single/:id", readPrescriptionMiddleware, PrescriptionController.getPrescription);
prescriptionRouter.put("/update/:id", updatePrescriptionMiddleware, PrescriptionController.updatePrescription);
prescriptionRouter.delete("/delete/:id", deletePrescriptionMiddleware, PrescriptionController.deletePrescription);

export default prescriptionRouter;