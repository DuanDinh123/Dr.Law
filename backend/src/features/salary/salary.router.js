import express from "express";

import SalaryController from "./salary.controller";

const salaryRouter = express.Router();
salaryRouter.post("/create", SalaryController.createSalary);
salaryRouter.get("/list", SalaryController.getSalaries);
salaryRouter.get("/user/:id", SalaryController.getSalaryByUserId);
salaryRouter.get("/single/:id", SalaryController.getSalary);
salaryRouter.put("/update/:id", SalaryController.updateSalary);
salaryRouter.delete("/delete/:id", SalaryController.deleteSalary);
salaryRouter.get("/revenue", SalaryController.revenueByUser);
salaryRouter.get("/revenue-statistic", SalaryController.revenueStatistics);
salaryRouter.delete("/user/:id", SalaryController.deleteSalaryByUserId);

export default salaryRouter;
