import express from "express";

// ** Middleware Imports
import UserController from "./user.controller";
import { createUserMiddleware } from "~/middleware/user/create-user.middleware";
import { deleteUserMiddleware } from "~/middleware/user/delete-user.middleware";
import { readUserMiddleware } from "~/middleware/user/read-user.middleware";
import { updateUserMiddleware } from "~/middleware/user/update-user.middleware";

const userRouter = express.Router();
userRouter.get("/list", readUserMiddleware, UserController.getUsers);
userRouter.get("/single/:id", readUserMiddleware, UserController.getUser);
userRouter.delete("/delete/:id", deleteUserMiddleware,  UserController.deleteUser);
userRouter.put("/update/:id", updateUserMiddleware, UserController.updateUser);
userRouter.post("/assign-roles-to-user/:id", createUserMiddleware,  UserController.assignRolesToUser);

export default userRouter;