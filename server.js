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

app.use(cors());
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
