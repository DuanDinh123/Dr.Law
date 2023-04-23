import express from "express";

import AdviceController from "./advice.controller";
import { createAdviceMiddleware } from "~/middleware/advice/create-advice.middleware";
import { deleteAdviceMiddleware } from "~/middleware/advice/delete-advice.middleware";
import { readAdviceMiddleware } from "~/middleware/advice/read-advice.middleware";
import { updateAdviceMiddleware } from "~/middleware/advice/update-advice.middleware";

const adviceRouter = express.Router();
adviceRouter.post("/create",createAdviceMiddleware, AdviceController.createAdvice);
adviceRouter.get("/list", readAdviceMiddleware, AdviceController.getAdvices);
adviceRouter.get("/single/:id", readAdviceMiddleware, AdviceController.getAdvice);
adviceRouter.put("/update/:id", updateAdviceMiddleware, AdviceController.updateAdvice);
adviceRouter.delete("/delete/:id", deleteAdviceMiddleware ,AdviceController.deleteAdvice);

export default adviceRouter;