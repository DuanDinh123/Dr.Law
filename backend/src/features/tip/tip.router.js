import express from "express";

import { createTipMiddleware } from "~/middleware/tip/create-tip.middleware";
import { deleteTipMiddleware } from "~/middleware/tip/delete-tip.middleware";
import { readTipMiddleware } from "~/middleware/tip/read-tip.middleware";
import { updateTipMiddleware } from "~/middleware/tip/update-tip.middleware";

import TipController from "./tip.controller";

const tipRouter = express.Router();
tipRouter.post("/create", createTipMiddleware, TipController.createTip);
tipRouter.get("/list", readTipMiddleware, TipController.getTips);
tipRouter.get("/single/:id", readTipMiddleware, TipController.getTip);
tipRouter.put("/update/:id", updateTipMiddleware, TipController.updateTip);
tipRouter.delete("/delete/:id", deleteTipMiddleware, TipController.deleteTip);

export default tipRouter;