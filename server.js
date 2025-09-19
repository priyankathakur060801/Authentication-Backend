import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectionDB from "./config/mongodb.js";
import authRouter from "./routes/authRoute.js";
import UserRouter from "./routes/userRoutes.js";
// import "dotenv/config";

dotenv.config();
const app = express();

app.use(cookieParser());
const allowedOrigins = [
  "http://localhost:3000", // React dev
  "http://localhost:5173", // Vite dev (if you use Vite)
  "https://authentication-xytt.vercel.app", // Vercel frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectionDB();
const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("hello world");
});
app.use("/api/auth", authRouter);
app.use("/api/user", UserRouter);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
