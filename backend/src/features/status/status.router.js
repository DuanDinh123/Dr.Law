import express from "express";

import { createStatusMiddleware } from "~/middleware/status/create-status.middleware";
import { deleteStatusMiddleware } from "~/middleware/status/delete-status.middleware";
import { readStatusMiddleware } from "~/middleware/status/read-status.middleware";
import { updateStatusMiddleware } from "~/middleware/status/update-status.middleware";

import StatusController from "./status.controller";

const statusRouter = express.Router();
statusRouter.post("/create", createStatusMiddleware, StatusController.createStatus);
statusRouter.get("/list", readStatusMiddleware, StatusController.getStatuses);
statusRouter.get("/single/:id", readStatusMiddleware,  StatusController.getStatus);
statusRouter.put("/update/:id", updateStatusMiddleware, StatusController.updateStatus);
statusRouter.delete("/delete/:id",deleteStatusMiddleware, StatusController.deleteStatus);

export default statusRouter;