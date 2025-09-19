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
// const allowedOrigin = ["http://localhost:5173"];
const allowedOrigins = [
  "https://authentication-xytt-euqn3er48-priyankathakur060801s-projects.vercel.app",
  "http://localhost:3000", // keep this for local dev if needed
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(cors({ origin: allowedOrigin, credentials: true }));

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
