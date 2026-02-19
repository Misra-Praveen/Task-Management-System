import express from "express";
import cors from "cors";
import "dotenv/config";

import authRoute from "./routes/authRoutes.js";
import taskRouter from "./routes/taskRoutes.js";

const PORT = process.env.PORT || 5051;

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoute);
app.use("/tasks", taskRouter);

app.get("/", (req, res) => {
  console.log("API is running...");
  res.send("Backend is working fine!");
});
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
