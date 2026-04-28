import { and, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import { Request, Response } from "express";
import { db } from "../db/index.js";
import { classes } from "../db/schema/app.js";

export const postClass = async (req: Request, res: Response) => {
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

// controllers/class.controller.ts

export const getAllClasses = async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Number(req.query.limit) || 10);
    const search = req.query.search as string | undefined;
    const status = req.query.status as string | undefined;

    const conditions = [];
    if (search) conditions.push(ilike(classes.name, `%${search}%`));
    if (status) conditions.push(eq(classes.status, status));
    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(classes)
      .where(where);

    const count = result?.count ?? 0;

    const data = await db
      .select()
      .from(classes)
      .where(where)
      .orderBy(desc(classes.createdAt))
      .limit(limit)
      .offset((page - 1) * limit);

    res.json({
      data,
      pagination: {
        page,
        limit,
        total: Number(count),
        totalPages: Math.ceil(Number(count) / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
