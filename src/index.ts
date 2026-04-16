import express from "express";
import subjectRouter from "./routes/subject.js";
import cors from "cors";
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONT_END_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use("/subjects", subjectRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the Class Management System API!");
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
