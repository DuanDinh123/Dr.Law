// ** Third Party Import
import express from "express";

import { createSupplierMiddleware } from "~/middleware/supplier/create-supplier.middleware";
import { deleteSupplierMiddleware } from "~/middleware/supplier/delete-supplier.middleware";
import { readSupplierMiddleware } from "~/middleware/supplier/read-supplier.middleware";
import { updateSupplierMiddleware } from "~/middleware/supplier/update-supplier.middleware";

// ** Server Imports
import SupplierController from "./supplier.controller";

const supplierRouter = express.Router();
supplierRouter.post("/create", createSupplierMiddleware, SupplierController.createSupplier);
supplierRouter.get("/list", readSupplierMiddleware, SupplierController.getSuppliers);
supplierRouter.get("/single/:id", readSupplierMiddleware, SupplierController.getSupplier);
supplierRouter.put("/update/:id", updateSupplierMiddleware, SupplierController.updateSupplier);
supplierRouter.delete("/delete/:id", deleteSupplierMiddleware, SupplierController.deleteSupplier);

export default supplierRouter;
