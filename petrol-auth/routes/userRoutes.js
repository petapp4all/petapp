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

    if (!bcrypt.compareSync(req.body.password, user.password)) {
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

// Send Notification to a single user
userRouter.post(
  "/send-notification",
  expressAsyncHandler(async (req, res) => {
    const { recipientId, title, body, data = {} } = req.body;
    console.log(recipientId, title, body);
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
    console.log("result:", result);
    // Check for Expo success status
    const pushDelivered = result?.data?.status === "ok";
    console.log("pushDelivered:", pushDelivered);
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

      // 1. Get all users with Expo push tokens
      const users = await prisma.user.findMany({
        where: {
          expoPushToken: {
            not: null,
          },
        },
        select: {
          expoPushToken: true,
        },
      });

      if (!users.length) {
        return res
          .status(404)
          .json({ message: "No users with push tokens found" });
      }

      // 2. Create messages for each user
      const messages = users.map((user) => ({
        to: user.expoPushToken,
        sound: "default",
        title,
        body,
        data,
      }));

      // 3. Split messages into batches (Expo allows max 100 per request)
      const chunkSize = 100;
      const batchedMessages = [];

      for (let i = 0; i < messages.length; i += chunkSize) {
        batchedMessages.push(messages.slice(i, i + chunkSize));
      }

      // 4. Send each batch and collect responses
      const results = [];

      for (const batch of batchedMessages) {
        try {
          const response = await fetch("https://exp.host/--/api/v2/push/send", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Accept-encoding": "gzip, deflate",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(batch),
          });

          const result = await response.json();
          console.log("result=", result);
          results.push(result);
        } catch (batchError) {
          console.error("Error sending push batch:", batchError);
          results.push({ error: "Failed to send batch", details: batchError });
        }
      }
      res.json({ success: true, totalRecipients: users.length, results });
    } catch (error) {
      console.error("Error in /send-notifications:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error", error });
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

export default userRouter;
