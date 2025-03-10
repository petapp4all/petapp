import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./routes/userRoutes.js";
import connectDB from "./connection.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/api/users", userRouter);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

app.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`);
});
