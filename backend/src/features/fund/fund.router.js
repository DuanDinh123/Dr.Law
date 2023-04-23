import express from "express";

import  FundController  from "./fund.controller";
import { createFundMiddleware } from "~/middleware/fund/create-fund.middleware";
import { deleteFundMiddleware } from "~/middleware/fund/delete-fund.middleware";
import { readFundMiddleware } from "~/middleware/fund/read-fund.middleware";
import { updateFundMiddleware } from "~/middleware/fund/update-fund.middleware";

const fundRouter = express.Router();
fundRouter.post("/create", createFundMiddleware, FundController.createFund);
fundRouter.get("/list", readFundMiddleware, FundController.getFunds);
fundRouter.get("/single/:id", readFundMiddleware, FundController.getFund);
fundRouter.put("/update/:id",updateFundMiddleware,  FundController.updateFund);
fundRouter.delete("/delete/:id", deleteFundMiddleware, FundController.deleteFund);

export default fundRouter;
