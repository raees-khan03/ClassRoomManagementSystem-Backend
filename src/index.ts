import express from "express";
import subjectRouter from "./routes/subject.js";
import cors from "cors";
import securityMiddleware from "./middleware/security.js";
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
app.use(securityMiddleware);
app.use("/api", subjectRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the Class Management System API!");
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
