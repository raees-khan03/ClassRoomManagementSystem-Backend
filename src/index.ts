import AgentApi from "apminsight";
AgentApi.config();
import express from "express";
import subjectRouter from "./routes/subject.js";
import cors from "cors";
import securityMiddleware from "./middleware/security.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import userRouter from "./routes/users.js";
import classesRouter from "./routes/classes.js";
const app = express();

app.use(express.json());
if (!process.env.FRONT_END_URL) {
  throw new Error("FRONT_END_URL is not defined");
}
app.use(
  cors({
    origin: process.env.FRONT_END_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
// app.all("/api/auth/*splat", toNodeHandler(auth));
// app.use(securityMiddleware);
app.use("/api", subjectRouter);
app.use("/api", userRouter);
app.use("/api", classesRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the Class Management System API!");
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
