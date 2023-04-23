import express from "express";

import { createCategoryTipMiddleware } from "~/middleware/category-tip/create-category-tip.middleware";
import { deleteCategoryTipMiddleware } from "~/middleware/category-tip/delete-category-tip.middleware";
import { readCategoryTipMiddleware } from "~/middleware/category-tip/read-category-tip.middleware";
import { updateCategoryTipMiddleware } from "~/middleware/category-tip/update-category-tip.middleware";

import CategoryTipController from "./category-tip.controller";

const categoryTipRouter = express.Router();
categoryTipRouter.post("/create",createCategoryTipMiddleware,  CategoryTipController.createCategoryTip);
categoryTipRouter.get("/list", readCategoryTipMiddleware, CategoryTipController.getCategoryTips);
categoryTipRouter.get("/single/:id", readCategoryTipMiddleware, CategoryTipController.getCategoryTip);
categoryTipRouter.put("/update/:id", updateCategoryTipMiddleware, CategoryTipController.updateCategoryTip);
categoryTipRouter.delete("/delete/:id", deleteCategoryTipMiddleware,  CategoryTipController.deleteCategoryTip);

export default categoryTipRouter;