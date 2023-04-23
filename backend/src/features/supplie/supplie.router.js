import express from "express";

import { createSupplieMiddleware } from "~/middleware/supplie/create-supplie.middleware";
import { deleteSupplieMiddleware } from "~/middleware/supplie/delete-supplie.middleware";
import { readSupplieMiddleware } from "~/middleware/supplie/read-supplie.middleware";
import { updateSupplieMiddleware } from "~/middleware/supplie/update-supplie.middleware";

import SupplieController from "./supplie.controller";

const supplieRouter = express.Router();
supplieRouter.post("/create", createSupplieMiddleware, SupplieController.createSupplie);
supplieRouter.delete("/delete/:id", deleteSupplieMiddleware, SupplieController.deleteSupplie);
supplieRouter.put("/update/:id", updateSupplieMiddleware, SupplieController.updateSupplie);
supplieRouter.get("/single/:id", readSupplieMiddleware,  SupplieController.getSupplie);
supplieRouter.get("/list", readSupplieMiddleware, SupplieController.getSupplies);
supplieRouter.get("/group", readSupplieMiddleware, SupplieController.getSuppliesByGroupSupplie);

export default supplieRouter;