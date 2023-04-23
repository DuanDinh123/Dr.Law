import express from "express";

import { authMiddleware } from "~/middleware/auth.middleware";
import { createUserMiddleware } from "~/middleware/user/create-user.middleware";

import AuthController from "./auth.controller";

const authRouter = express.Router();
authRouter.post("/register", authMiddleware, createUserMiddleware, AuthController.register);
authRouter.post("/login", AuthController.login);
authRouter.post("/logout", authMiddleware, AuthController.logout);
authRouter.post("/refreshToken", authMiddleware, AuthController.refreshToken);

export default authRouter;