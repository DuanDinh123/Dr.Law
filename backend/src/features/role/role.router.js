import express from "express";

import { createRoleMiddleware } from "~/middleware/role/create-role.middleware";
import { deleteRoleMiddleware } from "~/middleware/role/delete-role.middleware";
import { readRoleMiddleware } from "~/middleware/role/read-role.middleware";
import { updateRoleMiddleware } from "~/middleware/role/update-role.middleware";

import RoleController from "./role.controller";

const roleRouter = express.Router();
roleRouter.post("/create", createRoleMiddleware, RoleController.createRole);
roleRouter.get("/list", readRoleMiddleware, RoleController.getRoles);
roleRouter.get("/single/:id", readRoleMiddleware, RoleController.getRole);
roleRouter.put("/update/:id", updateRoleMiddleware, RoleController.updateRole);
roleRouter.delete("/delete/:id", deleteRoleMiddleware, RoleController.deleteRole);
roleRouter.get("/user/:id", readRoleMiddleware, RoleController.getRolesByUserId);

export default roleRouter;
