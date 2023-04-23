import { Router } from "express";

import adviceRouter from "~/features/advice/advice.router";
import assetRouter from "~/features/asset/asset.router";
import authRouter from "~/features/auth/auth.router";
import bankRouter from "~/features/bank/bank.router";
import categoryRouter from "~/features/category/category.router";
import categoryTipRouter from "~/features/category-tip/category-tip.router";
import fundRouter from "~/features/fund/fund.router";
import groupSpendingRouter from "~/features/group-spending/group-spending.router";
import groupSupplieRouter from "~/features/group-supplie/group-supplie.router";
import medicalHistoryRouter from "~/features/medical-history/medical-history.router";
import medicalRouter from "~/features/medical-information-register/medial.router";
import patientRouter from "~/features/patient/patient.router";
import prescriptionRouter from "~/features/prescription/prescription.router";
import provinceRouter from "~/features/province/province.router";
import roleRouter from "~/features/role/role.router";
import rootRouter from "~/features/root/root.router";
import salaryRouter from "~/features/salary/salary.router";
import spendingRouter from "~/features/spending/spending.router";
import statusRouter from "~/features/status/status.router";
import supplieRouter from "~/features/supplie/supplie.router";
import supplierRouter from "~/features/supplier/supplier.router";
import tipRouter from "~/features/tip/tip.router";
import userRouter from "~/features/user/user.router";
import { authMiddleware } from "~/middleware/auth.middleware";

const router = Router();

// auth user
router.use("/auth", authRouter);

// user router
router.use("/user", authMiddleware, userRouter);

// Patient router
router.use("/patient", authMiddleware, patientRouter);

// Advice router
router.use("/advice", authMiddleware, adviceRouter);

// Prescription router
router.use("/prescription", authMiddleware, prescriptionRouter);

// Supplier tips router
router.use("/supplier", authMiddleware, supplierRouter);

// Supplies router
router.use("/supplie", authMiddleware, supplieRouter);

// Asset router
router.use("/asset", authMiddleware, assetRouter);

// Spending router
router.use("/spending", authMiddleware, spendingRouter);

// Fund router
router.use("/fund", authMiddleware, fundRouter);

// Group Spending router
router.use("/group_spending", authMiddleware, groupSpendingRouter);

// Category router
router.use("/category", authMiddleware, categoryRouter);

// Role router
router.use("/role", authMiddleware, roleRouter);

// Category tip router
router.use("/category-tip", authMiddleware, categoryTipRouter);

// Tip router
router.use("/tip", authMiddleware, tipRouter);

// medical router
router.use("/medical", authMiddleware, medicalRouter);

// status router
router.use("/status", authMiddleware, statusRouter);

// root router
router.use("/root", authMiddleware, rootRouter);

// Salary router
router.use("/salary", authMiddleware, salaryRouter);

// Group supplie router
router.use("/group-supplie", authMiddleware, groupSupplieRouter);

// Group medical history
router.use("/medical-history", authMiddleware, medicalHistoryRouter);

// Group supplie router
router.use("/province", authMiddleware, provinceRouter);

// bank router 
router.use("/bank", authMiddleware, bankRouter);
export default router;
