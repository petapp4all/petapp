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
    const { name, email, phone, image, password } = req.body;

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
    console.log("user=", user);
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
      phone: user.phoneNumber,
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

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        fullName: req.body.name || user.fullName,
        email: req.body.email || user.email,
        phoneNumber: req.body.phone || user.phoneNumber,
        image: req.body.image || user.image,
        role: req.body.role || user.role,
        password: req.body.password
          ? bcrypt.hashSync(req.body.password, 10)
          : user.password,
      },
    });

    res.json({
      id: updatedUser.id,
      name: updatedUser.fullName,
      email: updatedUser.email,
      phone: updatedUser.phoneNumber,
      image: updatedUser.image,
      role: updatedUser.role,
      token: generateToken(updatedUser),
    });
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

// // Delete User
// userRouter.delete(
//   "/:id",
//   expressAsyncHandler(async (req, res) => {
//     const user = await User.findById(req.params.id);
//     if (!user) {
//       return res.status(404).send({ message: "User not found" });
//     }
//     await User.deleteOne({ _id: req.params.id });
//     res.send({ message: "User deleted successfully" });
//   })
// );

// userRouter.post(
//   "/forget-password",
//   expressAsyncHandler(async (req, res) => {
//     const { email } = req.body;
//     const user = await User.findOne({ email });
//     if (user) {
//       const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
//         expiresIn: "3h",
//       });
//       user.resetToken = token;
//       await user.save();
//       try {
//         const reply_to = email;
//         const subject = "Reset Password";
//         const sent_from = process.env.EMAIL_USER;
//         const sent_to = `${user.name} <${user.email}>`;
//         const message = `
//         <a href="${baseUrl()}/reset-password/${token}"}>Reset Password</a>
//          <p>Please Click the following link to reset your password:</p>
//          `;
//         await sendMail(subject, message, sent_to, sent_from, reply_to);
//         (error, body) => {
//           console.log("error", error);
//         };
//         res.send({
//           message: `We sent reset password link to ${email}.`,
//           resetLink: `${baseUrl()}/reset-password/${token}`,
//         });
//       } catch (err) {
//         res.status(500).json("err from outlook", err.message);
//       }
//     } else {
//       res.status(404).send({ message: "User not found" });
//     }
//   })
// );

// userRouter.post(
//   "/reset-password",
//   expressAsyncHandler(async (req, res) => {
//     jwt.verify(req.body.token, process.env.JWT_SECRET, async (err, decode) => {
//       if (err) {
//         res.status(401).send({ message: "Invalid Token" });
//       } else {
//         const user = await User.findOne({ resetToken: req.body.token });
//         console.log("user", user);
//         if (user) {
//           if (req.body.password) {
//             user.password = bcrypt.hashSync(req.body.password, 8);
//             await user.save();
//             res.status(201).json({
//               message: "Password reseted successfully",
//             });
//             res.end("ok");
//           }
//         } else {
//           res.status(404).json({ message: "User not found" });
//         }
//       }
//     });
//   })
// );

userRouter.post(
  "/forgot-password",
  expressAsyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a token (Valid for 3 hours)
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "3h",
    });

    // Store the token in the database
    await prisma.user.update({
      where: { email },
      data: { resetToken: token },
    });

    try {
      const subject = "Password Reset Code";
      const sent_to = user.email;
      const sent_from = process.env.EMAIL_USER;
      const reply_to = email;
      const message = `Your password reset token is: ${token}. Use this token in the app to reset your password.`;

      await sendMail(subject, message, sent_to, sent_from, reply_to);

      res.json({ message: `Password reset token sent to ${user.email}.` });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Email sending failed", error: error.message });
    }
  })
);

userRouter.post(
  "/reset-password",
  expressAsyncHandler(async (req, res) => {
    const { token, password } = req.body;

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user with the reset token
      const user = await prisma.user.findUnique({
        where: { id: decoded.id, resetToken: token },
      });

      if (!user) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }

      // Hash the new password
      const hashedPassword = bcrypt.hashSync(password, 10);

      // Update user password & remove the reset token
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword, resetToken: null },
      });

      res.json({ message: "Password reset successfully" });
    } catch (error) {
      res.status(400).json({ message: "Invalid or expired token" });
    }
  })
);

export default userRouter;
