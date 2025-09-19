import express from "express";
import { getUserData } from "../controllers/userController.js";
import UserAuth from "../middleware/userAuth.js";

const UserRouter = express.Router();

UserRouter.get("/data",UserAuth, getUserData);

export default UserRouter;

