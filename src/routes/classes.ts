import express from "express";
import { getAllClasses, postClass } from "../controllers/classes.js";

const classesRouter = express.Router();

classesRouter.post("/classes", postClass);
classesRouter.get("/classes", getAllClasses);

export default classesRouter;
