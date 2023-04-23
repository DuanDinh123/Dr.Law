import express from "express";

import { createGroupSupplieMiddleware } from "~/middleware/group-supplie/create-group-supplie.middleware";
import { deleteGroupSupplieMiddleware } from "~/middleware/group-supplie/delete-group-supplie.middleware";
import { readGroupSupplieMiddleware } from "~/middleware/group-supplie/read-group-supplie.middleware";
import { updateGroupSupplieMiddleware } from "~/middleware/group-supplie/update-group-supplie.middleware";

import GroupSupplieController from "./group-supplie.controller";

const groupSupplieRouter = express.Router();
groupSupplieRouter.post("/create", createGroupSupplieMiddleware, GroupSupplieController.createGroupSupplie);
groupSupplieRouter.get("/list", readGroupSupplieMiddleware, GroupSupplieController.getGroupSupplies);
groupSupplieRouter.get("/single/:id", readGroupSupplieMiddleware, GroupSupplieController.getGroupSupplie);
groupSupplieRouter.put("/update/:id", updateGroupSupplieMiddleware, GroupSupplieController.updateGroupSupplie);
groupSupplieRouter.delete("/delete/:id", deleteGroupSupplieMiddleware, GroupSupplieController.deleteGroupSupplie);

export default groupSupplieRouter;