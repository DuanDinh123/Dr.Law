import express from "express";

import BankController from "./bank.controller";

const bankRouter = express.Router();
bankRouter.post("/create", BankController.createBank);
bankRouter.get("/list", BankController.getBanks);
bankRouter.delete("/delete/:id", BankController.deleteBank);
bankRouter.put("/update/:id", BankController.updateBank);
bankRouter.get("/user/:id", BankController.getBankByUserId);
bankRouter.delete("/user/:id", BankController.deleteBankByUserId);

export default bankRouter;