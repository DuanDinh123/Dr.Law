import express from "express";

import CategoryController from "./category.controller";

const categoryRouter = express.Router();
categoryRouter.post("/create", CategoryController.createCategory);
categoryRouter.delete("/delete/:id", CategoryController.deleteCategory);
categoryRouter.get("/single/:id", CategoryController.getCategory);
categoryRouter.get("/list", CategoryController.getCategories);
categoryRouter.put("/update/:id", CategoryController.updateCategory);
categoryRouter.put("/remove-supplies-to-category/:id", CategoryController.removeSuppliesToCategory);
categoryRouter.put("/assign-supplies-to-category/:id", CategoryController.assignSuppliesToCategory);
categoryRouter.put("/remove-supplie-to-category/:id", CategoryController.removeSupplieToCategory);
categoryRouter.put("/assign-supplie-to-category/:id", CategoryController.assignSupplieToCategory);

export default categoryRouter;