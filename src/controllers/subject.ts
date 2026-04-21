// controllers/subject.controller.ts
import { and, desc, eq, getTableColumns, ilike, or, sql } from "drizzle-orm";
import { Request, Response } from "express";
import { departments, subjects } from "../db/schema/app.js";
import { db } from "../db/index.js";

export const getAllSubjects = async (req: Request, res: Response) => {
  // 1️⃣ Query params lo
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Number(req.query.limit) || 10);
  const search = req.query.search as string | undefined;
  const department = req.query.department as string | undefined;
  console.log(page, limit, search, department);

  // 2️⃣ Filters banao
  const conditions = [];
  if (search) conditions.push(ilike(subjects.name, `%${search}%`));
  if (department) conditions.push(ilike(departments.name, `%${department}%`));
  const where = conditions.length > 0 ? and(...conditions) : undefined;

  // 3️⃣ Total count lo
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(subjects)
    .leftJoin(departments, eq(subjects.departmentId, departments.id))
    .where(where);

  // 4️⃣ Data lo
  const data = await db
    .select({
      ...getTableColumns(subjects),
      department: getTableColumns(departments),
    })
    .from(subjects)
    .leftJoin(departments, eq(subjects.departmentId, departments.id))
    .where(where)
    .orderBy(desc(subjects.createdAt))
    .limit(limit)
    .offset((page - 1) * limit);

  // 5️⃣ Response bhejo
  res.json({
    data,
    pagination: {
      page,
      limit,
      total: Number(count),
      totalPages: Math.ceil(Number(count) / limit),
    },
  });
};
