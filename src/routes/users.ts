import express from "express";
import getAllUsers from "../controllers/users.js";

const userRouter = express.Router();

userRouter.get("/users", getAllUsers);

export default userRouter;
