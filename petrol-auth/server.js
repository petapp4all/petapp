import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import nodemailer from "nodemailer";
import userRouter from "./routes/userRoutes.js";
import { sendMail } from "./utils.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRouter);

app.get("/", (req, res) => res.send("Welcome to Splantom PetrolApp API"));

// sendMail("mathewadeyemi7654@gmail.com", "mathewadeyemi7654@gmail.com", 556677);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

app.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`);
});
