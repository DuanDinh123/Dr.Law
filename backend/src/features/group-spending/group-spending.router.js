import express from "express";

import GroupSpendingController from "./group-spending.controller";

const groupSpendingRouter = express.Router();
groupSpendingRouter.post("/create", GroupSpendingController.createGroupSpending);
groupSpendingRouter.get("/list", GroupSpendingController.getGroupSpendings);
groupSpendingRouter.get("/single/:id", GroupSpendingController.getGroupSpending);
groupSpendingRouter.put("/update/:id", GroupSpendingController.updateGroupSpending);
groupSpendingRouter.delete("/delete/:id", GroupSpendingController.deleteGroupSpending);

export default groupSpendingRouter;