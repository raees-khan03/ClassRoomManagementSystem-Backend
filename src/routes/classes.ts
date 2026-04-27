import express from "express";
import getAllClasses from "../controllers/classes.js";

const classesRouter = express.Router();

classesRouter.post("/classes", getAllClasses);

export default classesRouter;
