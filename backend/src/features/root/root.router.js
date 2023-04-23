import express from "express";

import { createRootMiddleware } from "~/middleware/root/create-root.middleware";
import { deleteRootMiddleware } from "~/middleware/root/delete-root.middleware";
import { readRootMiddleware } from "~/middleware/root/read-root.middleware";
import { updateRootMiddleware } from "~/middleware/root/update-root.middleware";

import RootController from "./root.controller";

const rootRouter = express.Router();
rootRouter.post("/create", createRootMiddleware, RootController.createRoot);
rootRouter.get("/list", readRootMiddleware, RootController.getRoots);
rootRouter.get("/single/:id", readRootMiddleware, RootController.getRoot);
rootRouter.put("/update/:id", updateRootMiddleware, RootController.updateRoot);
rootRouter.delete("/delete/:id", deleteRootMiddleware, RootController.deleteRoot);

export default rootRouter;