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

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://auth-frontend-app.vercel.app"
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(cookieParser());


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
