import express from "express";
import { getAllSubjects } from "../controllers/subject.js";

const subjectRouter = express.Router();

subjectRouter.get("/subjects", getAllSubjects);

export default subjectRouter;
