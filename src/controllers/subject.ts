import { and, desc, eq, getTableColumns, ilike, or, sql } from "drizzle-orm";

import { departments, subjects } from "../db/schema";
import { db } from "../db";

export const getAllSubject = async (req, res) => {
  try {
    const { search, department, page = 1, limit = 10 } = req.query;

    // 🔥 pagination safe conversion
    const currentPage = Math.max(1, parseInt(page));
    const limitPerPage = Math.max(1, parseInt(limit));
    const offset = (currentPage - 1) * limitPerPage;

    // 🔥 dynamic filters
    const filterCondition = [];

    if (search) {
      filterCondition.push(
        or(
          ilike(subjects.name, `%${search}%`),
          ilike(subjects.code, `%${search}%`),
        ),
      );
    }

    if (department) {
      filterCondition.push(ilike(departments.name, `%${department}%`));
    }

    const whereClause =
      filterCondition.length > 0 ? and(...filterCondition) : undefined;

    // -------------------------------
    // 📊 TOTAL COUNT QUERY
    // -------------------------------
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(subjects)
      .leftJoin(departments, eq(subjects.departmentId, departments.id))
      .where(whereClause);

    const totalCount = countResult[0]?.count ?? 0;

    // -------------------------------
    // 📦 MAIN DATA QUERY
    // -------------------------------
    const subjectList = await db
      .select({
        ...getTableColumns(subjects),
        department: { ...getTableColumns(departments) },
      })
      .from(subjects)
      .leftJoin(departments, eq(subjects.departmentId, departments.id))
      .where(whereClause)
      .orderBy(desc(subjects.createdAt))
      .limit(limitPerPage)
      .offset(offset);

    // -------------------------------
    // 📤 RESPONSE
    // -------------------------------
    res.status(200).json({
      data: subjectList,
      pagination: {
        page: currentPage,
        limit: limitPerPage,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitPerPage),
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};
