import express from "express";
import bcrypt from "bcryptjs";
import expressAsyncHandler from "express-async-handler";
import { subDays } from "date-fns";
import { deleteImageByPublicId, generateToken, sendMail } from "../utils.js";
import prisma from "../prisma/prisma.js";
import jwt from "jsonwebtoken";

const userRouter = express.Router();

//signup-initiate

userRouter.post(
  "/signup-initiate",
  expressAsyncHandler(async (req, res) => {
    try {
      const { name, email, phone, password, country } = req.body;

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }

      const verificationCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      // Delete any existing verification entries for this email
      await prisma.emailVerification.deleteMany({
        where: { email },
      });

      // Save new verification entry
      await prisma.emailVerification.create({
        data: {
          email,
          code: verificationCode,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000), // Expires in 10 mins
          name,
          phone,
          country,
          password: bcrypt.hashSync(password, 10),
        },
      });

      // Send verification email
      await sendMail(
        "Verify your email",
        `Your verification code is: ${verificationCode}`,
        email,
        process.env.EMAIL_USER,
        process.env.EMAIL_USER
      );

      return res.json({ message: "Verification code sent" });
    } catch (error) {
      console.error("Error in /signup-initiate:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  })
);

//verify-email
userRouter.post(
  "/verify-email",
  expressAsyncHandler(async (req, res) => {
    const { email, code } = req.body;

    const record = await prisma.emailVerification.findUnique({
      where: { email },
    });

    if (!record || record.code !== code || record.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        name: record.name,
        email: record.email,
        phone: record.phone,
        password: record.password,
        country: record.country,
      },
    });

    // Clean up verification record
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
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
      block: user.block,
      role: user.role,
      image: user.image,
      imageId: user.imageId,
      phone: user.phone,
      pinValidity: user.pinValidity,
      country: user.country,
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
          image: true,
          imageId: true,
          phone: true,
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
// Track User Activity - Update or Create login history
userRouter.post(
  "/track-activity",
  expressAsyncHandler(async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, block: true }, // only return what you need
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update lastActive timestamp
    await prisma.user.update({
      where: { id: userId },
      data: { lastActive: new Date() },
    });

    res.status(200).json({
      message: "Activity tracked successfully",
      isBlocked: user.block,
    });
  })
);

//summary
userRouter.get(
  "/summary",
  expressAsyncHandler(async (req, res) => {
    try {
      const now = new Date();
      const sevenDaysAgo = subDays(now, 7);

      const totalUsers = await prisma.user.count();

      const newUsers = await prisma.user.count({
        where: {
          createdAt: {
            gte: sevenDaysAgo,
          },
        },
      });

      const blockedUsers = await prisma.user.count({
        where: {
          block: true,
        },
      });

      const activeUsersCount = await prisma.user.count({
        where: {
          lastActive: {
            gte: sevenDaysAgo,
          },
        },
      });

      res.json({
        totalUsers,
        newUsers,
        blockedUsers,
        activeUsersCount,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch user summary",
        error: error.message,
      });
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

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        name: req.body.name || user.name,
        image: req.body.image || user.image,
        imageId: req.body.imageId || user.imageId,
        email: req.body.email || user.email,
        phone: req.body.phone || user.phone,
        address: req.body.address || user.address,
        role: req.body.role || user.role,
      },
    });
    res.json({
      id: updatedUser.id,
      name: updatedUser.name,
      image: updatedUser.image,
      imageId: updatedUser.imageId,
      email: updatedUser.email,
      phone: updatedUser.phone,
      address: updatedUser.address,
      role: updatedUser.role,
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
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: { imageId: true }, // only fetch what you need
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user.imageId) {
      try {
        await deleteImageByPublicId(user.imageId);
      } catch (err) {
        console.error("Failed to delete user image from Cloudinary:", err);
        // You may choose to continue or return error here depending on criticality
      }
    }

    await prisma.user.delete({ where: { id: req.params.id } });

    res.json({ message: "User and image deleted successfully" });
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

// Get User by ID
userRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    try {
      const { id } = req.params;

      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          notificationsSent: true,
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

export default userRouter;
