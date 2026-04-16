import express from "express";
import { getAllSubject } from "../controllers/subject.js";

const subjectRouter = express.Router();

subjectRouter.get("/", getAllSubject);

export default subjectRouter;
