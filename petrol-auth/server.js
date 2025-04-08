import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./routes/userRoutes.js";
// cronTask.js or inside your main server file
import cron from "node-cron";
import fetch from "node-fetch"; // or "undici" in newer Node versions

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRouter);

// Runs at 6am, 12pm, 4pm, 8pm every day
cron.schedule("0 6,12,16,20 * * *", async () => {
  console.log("⏰ Sending scheduled petrol news...");
  try {
    const response = await fetch(
      "https://petrol-auth.vercel.app/users/send-notifications",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "🛢️ Petrol News Update",
          body: "Click to see the latest petrol updates.",
          data: { screen: "/users/news" },
        }),
      }
    );

    const result = await response.json();
    console.log("✅ Notification sent:", result);
  } catch (error) {
    console.error("❌ Failed to send scheduled notification:", error.message);
  }
});

app.get("/", (req, res) => res.send("Welcome to Splantom PetrolApp API"));

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

app.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`);
});
