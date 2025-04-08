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
          image: true,
          role: true,
          createdAt: true,
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

// Send Notification
userRouter.post(
  "/send-notification",
  expressAsyncHandler(async (req, res) => {
    const { recipientId, title, body, data = {} } = req.body;

    const recipient = await prisma.user.findUnique({
      where: { id: recipientId },
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

    res.json({ success: true, result });
  })
);

// Delete User
userRouter.delete(
  "/:id",
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
