import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./routes/userRoutes.js";
import adsRouter from "./routes/ads.js";
import stationRouter from "./routes/station.js";
import orderRouter from "./routes/order.js";
import imageRouter from "./routes/image.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRouter);
app.use("/api/ads", adsRouter);
app.use("/api/station", stationRouter);
app.use("/api/order", orderRouter);
app.use("/api/image", imageRouter);

app.get("/", (req, res) => res.send("Welcome to Splantom PetrolApp API"));

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

app.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`);
});
