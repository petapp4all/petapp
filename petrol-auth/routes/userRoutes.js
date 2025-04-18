import express from "express";
import bcrypt from "bcryptjs";
import expressAsyncHandler from "express-async-handler";
import { generateToken, sendMail } from "../utils.js";
import prisma from "../prisma/prisma.js";
import jwt from "jsonwebtoken";

const userRouter = express.Router();

// Signup
userRouter.post(
  "/signup",
  expressAsyncHandler(async (req, res) => {
    console.log(req.body);
    const { name, email, phone, image, password, country } = req.body;

    // Check if user already exists
    const foundUser = await prisma.user.findUnique({ where: { email } });
    if (foundUser) {
      return res
        .status(401)
        .json({ message: `User with ${email} already exists` });
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create new user in the database
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        image,
        country,
        password: hashedPassword,
      },
    });

    // Send response with token
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      phone: user.phone,
      role: user.role,
      country: user.country,
      token: generateToken(user),
    });
  })
);

// SignIn
userRouter.post(
  "/signin",
  expressAsyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({
      where: { email: req.body.email },
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: `User with Email: ${req.body.email} does not exist` });
    }

    const isPasswordValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
      phone: user.phone,
      country: user.country,
      token: generateToken(user),
    });
  })
);

// Track User Activity - Update or Create login history
userRouter.post(
  "/track-activity",
  expressAsyncHandler(async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    // Update user's last active time
    await prisma.user.update({
      where: { id: userId },
      data: { lastActive: new Date() },
    });

    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    // Check if login already exists for today
    const existingLogin = await prisma.loginHistory.findFirst({
      where: {
        userId,
        loginAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });
    if (existingLogin) {
      // Optionally update the existing login record's timestamp
      await prisma.loginHistory.update({
        where: { id: existingLogin.id },
        data: { loginAt: now },
      });
    } else {
      // Create new login history record
      await prisma.loginHistory.create({
        data: {
          userId,
          loginAt: now,
        },
      });
    }
    res.status(200).json({ message: "Activity tracked successfully" });
  })
);

// Get All Users
userRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          status: true,
          lastActive: true,
          createdAt: true, // include if you want to show it on frontend
        },
        orderBy: {
          createdAt: "desc", // 👈 sort by newest first
        },
      });

      res.json(users);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to fetch users", error: error.message });
    }
  })
);

//summary
userRouter.get(
  "/summary",
  expressAsyncHandler(async (req, res) => {
    try {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      // Count total users
      const totalUsers = await prisma.user.count();

      // Count new users (created within the past week)
      const newUsers = await prisma.user.count({
        where: {
          createdAt: {
            gte: oneWeekAgo,
          },
        },
      });

      // Count blocked users
      const blockedUsers = await prisma.user.count({
        where: {
          block: true,
        },
      });

      // Count active users in the past week based on lastActive
      const activeUsersCount = await prisma.user.count({
        where: {
          lastActive: {
            gte: oneWeekAgo,
          },
        },
      });

      // Get all login events in the past week
      const loginEvents = await prisma.loginHistory.findMany({
        where: {
          loginAt: {
            gte: oneWeekAgo,
          },
        },
        select: {
          loginAt: true,
        },
      });

      // Build login count per weekday (Monday=0 ... Sunday=6)
      const loginsPerDay = [0, 0, 0, 0, 0, 0, 0];

      loginEvents.forEach((event) => {
        const date = new Date(event.loginAt);
        const weekday = date.getUTCDay(); // Sunday = 0
        loginsPerDay[weekday]++;
      });

      res.json({
        totalUsers,
        newUsers,
        blockedUsers,
        activeUsersCount,
        loginsPerDay, // 👈 Send accurate login activity to frontend
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch user summary",
        error: error.message,
      });
    }
  })
);

// Get Single User by ID
userRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    try {
      const { id } = req.params;

      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          notificationsSent: true, // optional: include related notification stats
        },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to fetch user", error: error.message });
    }
  })
);

// Update User
userRouter.put(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
    });
    console.log("user:", user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        name: req.body.name || user.name,
        email: req.body.email || user.email,
        phone: req.body.phone || user.phone,
        image: req.body.image || user.image,
        role: req.body.role || user.role,
        password: req.body.password
          ? bcrypt.hashSync(req.body.password, 10)
          : user.password,
      },
    });
    console.log("updatedUser=", updatedUser);
    res.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      image: updatedUser.image,
      role: updatedUser.role,
      token: generateToken(updatedUser),
    });
  })
);

// Save Expo Push Token
userRouter.post(
  "/push-token",
  expressAsyncHandler(async (req, res) => {
    const { expoPushToken, userId } = req.body;

    if (!expoPushToken) {
      return res.status(400).json({ message: "expoPushToken is required" });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { expoPushToken },
    });

    res.json({ success: true, message: "Push token saved successfully" });
  })
);

// Send Notification to a single user
userRouter.post(
  "/send-notification",
  expressAsyncHandler(async (req, res) => {
    const { recipientId, title, body, data = {} } = req.body;
    const recipient = await prisma.user.findUnique({
      where: { id: recipientId },
      include: {
        notificationsSent: true,
      },
    });

    if (!recipient || !recipient.expoPushToken) {
      return res.status(404).json({ message: "User or push token not found" });
    }

    const message = {
      to: recipient.expoPushToken,
      sound: "default",
      title,
      body,
      image: data.image,
      data,
    };

    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    const result = await response.json();
    // Check for Expo success status
    const pushDelivered = result?.data?.status === "ok";
    if (pushDelivered) {
      if (recipient.notificationsSent) {
        // Update existing record
        await prisma.notificationsSent.update({
          where: { userId: recipientId },
          data: { push: { increment: 1 } },
        });
      } else {
        // Create new record
        await prisma.notificationsSent.create({
          data: {
            userId: recipientId,
            push: 1,
          },
        });
      }
    }

    res.json({ success: true, result });
  })
);

// Send Notification to many users
userRouter.post(
  "/send-notifications",
  expressAsyncHandler(async (req, res) => {
    try {
      const { title, body, data = {} } = req.body;

      // 1. Get all users with push tokens (include user IDs)
      const users = await prisma.user.findMany({
        where: {
          expoPushToken: {
            not: null,
          },
        },
        select: {
          id: true,
          expoPushToken: true,
        },
      });

      if (!users.length) {
        return res
          .status(404)
          .json({ message: "No users with push tokens found" });
      }

      // 2. Create messages and map userId for tracking
      const messages = users.map((user) => ({
        to: user.expoPushToken,
        sound: "default",
        title,
        body,
        image: data.image,
        data,
        userId: user.id,
      }));
      const chunkSize = 100;
      const batchedMessages = [];
      for (let i = 0; i < messages.length; i += chunkSize) {
        batchedMessages.push(messages.slice(i, i + chunkSize));
      }

      const results = [];

      for (const batch of batchedMessages) {
        const expoMessages = batch.map(({ userId, ...msg }) => msg);
        const response = await fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Accept-encoding": "gzip, deflate",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(expoMessages),
        });

        const result = await response.json();
        results.push(result);
        // 3. Update notificationsSent for each user with status === "ok"
        const responses = result.data || [];
        await Promise.all(
          responses.map(async (resItem, index) => {
            if (resItem.status === "ok") {
              const userId = batch[index].userId;
              const existing = await prisma.notificationsSent.findUnique({
                where: { userId },
              });

              if (existing) {
                await prisma.notificationsSent.update({
                  where: { userId },
                  data: { push: { increment: 1 } },
                });
              } else {
                await prisma.notificationsSent.create({
                  data: { userId, push: 1 },
                });
              }
            }
          })
        );
      }

      res.json({ success: true, totalRecipients: users.length, results });
    } catch (error) {
      console.error("Error sending notifications:", error);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  })
);

// Delete User by Details
userRouter.delete(
  "/details/:id",
  expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch || user.email !== email) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    await prisma.user.delete({ where: { id: req.params.id } });

    res.json({ message: "User deleted successfully" });
  })
);

// Delete UserById
userRouter.delete(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ message: "User deleted successfully" });
  })
);

// Block a user
userRouter.put(
  "/:id/block",
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.block) {
      return res.status(400).json({ message: "User is already blocked" });
    }

    let updatedUser;

    // If blockCount is null or 0, set it to 1
    if (!user.blockCount || user.blockCount === 0) {
      updatedUser = await prisma.user.update({
        where: { id },
        data: {
          block: true,
          blockCount: 1,
        },
      });
    } else {
      // Otherwise, increment blockCount
      updatedUser = await prisma.user.update({
        where: { id },
        data: {
          block: true,
          blockCount: { increment: 1 },
        },
      });
    }

    res.json({
      message: "User blocked successfully",
      user: updatedUser,
    });
  })
);

// Unblock a user
userRouter.put(
  "/:id/unblock",
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.block) {
      return res.status(400).json({ message: "User is already unblocked" });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        block: false,
      },
    });

    res.json({
      message: "User unblocked successfully",
      user: updatedUser,
    });
  })
);

//forgot-password
userRouter.post(
  "/forgot-password",
  expressAsyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Generate a 6-digit random number
    const generatedNumber = Math.floor(100000 + Math.random() * 900000);

    // Generate a secure token (valid for 3 hours)
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "3h",
    });
    // Store the token and reset code in the database
    await prisma.user.update({
      where: { email },
      data: { resetToken: token, resetCode: generatedNumber.toString() },
    });

    try {
      const subject = "Password Reset Code";
      const sent_to = user.email;
      const sent_from = process.env.EMAIL_USER;
      const reply_to = sent_from;
      const message = `
        <p>You requested a password reset. Use the code below:</p>
        <h2>${generatedNumber}</h2>
        <p>This code is valid for 3 hours.</p>
        <p>If you did not request this, please ignore this email.</p>
      `;

      await sendMail(subject, message, sent_to, sent_from, reply_to);

      res.json({
        token: token,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Email sending failed", error: error.message });
    }
  })
);

//reset-password
userRouter.post(
  "/reset-password",
  expressAsyncHandler(async (req, res) => {
    const { token, resetCode, password } = req.body;

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Find user with matching token and reset code
      const user = await prisma.user.findFirst({
        where: { resetToken: token, resetCode },
      });

      if (!user) {
        return res
          .status(400)
          .json({ message: "Invalid or expired token/code" });
      }

      // Hash the new password
      const hashedPassword = bcrypt.hashSync(password, 10);

      // Update user password & remove reset token and code
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword, resetToken: null, resetCode: null },
      });

      res.json({ message: "Password reset successfully" });
    } catch (error) {
      res.status(400).json({ message: "Invalid or expired code" });
    }
  })
);

//send-email
userRouter.post(
  "/send-email",
  expressAsyncHandler(async (req, res) => {
    const { email, subject, message } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    try {
      const sent_to = user.email;
      const sent_from = process.env.EMAIL_USER;
      const reply_to = sent_from;

      await sendMail(subject, message, sent_to, sent_from, reply_to);

      // Update email count in NotificationsSent
      const existingRecord = await prisma.notificationsSent.findUnique({
        where: { userId: user.id },
      });

      if (existingRecord) {
        await prisma.notificationsSent.update({
          where: { userId: user.id },
          data: {
            email: { increment: 1 },
          },
        });
        console.log("Create new");
      } else {
        await prisma.notificationsSent.create({
          data: {
            userId: user.id,
            email: 1,
          },
        });
        console.log("Increase");
      }

      res.json({ message: "Email sent successfully" });
    } catch (error) {
      console.error("Failed to send email:", error);
      res
        .status(500)
        .json({ message: "Email sending failed", error: error.message });
    }
  })
);

export default userRouter;
