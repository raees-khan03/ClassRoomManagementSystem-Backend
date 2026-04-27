import { Request, Response } from "express";
import { db } from "../db/index.js";
import { classes } from "../db/schema/app.js";

const createClass = async (req: Request, res: Response) => {
  try {
    const {
      name,
      teacherId,
      subjectId,
      capacity,
      description,
      status,
      bannerUrl,
      bannerCldPublId,
    } = req.body;

    const [createdClass] = await db
      .insert(classes)
      .values({
        name,
        teacherId,
        subjectId,
        capacity,
        description,
        status,
        bannerUrl,
        bannerCldPublId,
        inviteCode: Math.random().toString(36).substring(2, 8),
        schedules: [],
      })
      .returning({ id: classes.id });

    if (!createdClass) throw new Error("Class creation failed");

    res
      .status(201)
      .json({ message: "Class created successfully", data: createdClass });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export default createClass;
