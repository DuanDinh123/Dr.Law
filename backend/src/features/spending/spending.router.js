import express from "express";

import SpendingController from "./spending.controller";
import { createSpendingMiddleware } from "~/middleware/spending/create-spending.middleware";
import { deleteSpendingMiddleware } from "~/middleware/spending/delete-spending.middleware";
import { readSpendingMiddleware } from "~/middleware/spending/read-spending.middleware";
import { updateSpendingMiddleware } from "~/middleware/spending/update-spending.middleware";

const spendingRouter = express.Router();
spendingRouter.post("/create", createSpendingMiddleware, SpendingController.createSpending);
spendingRouter.get("/list", readSpendingMiddleware, SpendingController.getSpendings);
spendingRouter.get("/single/:id", readSpendingMiddleware, SpendingController.getSpending);
spendingRouter.put("/update/:id", updateSpendingMiddleware, SpendingController.updateSpending);
spendingRouter.delete("/delete/:id", deleteSpendingMiddleware, SpendingController.deleteSpending);

export default spendingRouter;
