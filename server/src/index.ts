import "./types/express.js";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";

//ROUTE IMPORTS
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import matterRoutes from "./routes/matterRoute.js";
import timeTrackerRoutes from "./routes/timeTrakerRoute.js";
import activityLog from "./routes/activityLog.js";
import dashboardRoutes from "./routes/dashboard.js";
import clientRoutes from "./routes/clients.js";
import { initializeCronJobs } from "./cron/schedular.js";

const app = express();
const port = process.env.PORT ?? "8080";

// 1. Connect to Database
connectDB();

// 2. Body Parser Middleware (Required if sending JSON)
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  // Replace with your actual Next.js URL
  origin: "http://localhost:3000",

  // Required if you use Cookies or JWTs in headers
  credentials: true,

  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

//ROUTES
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/matter", matterRoutes);
app.use("/api/v1/time-tracker", timeTrackerRoutes);
app.use("/api/v1/activity", activityLog);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/client", clientRoutes);
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

initializeCronJobs();
