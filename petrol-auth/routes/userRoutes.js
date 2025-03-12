import express from "express";
import bcrypt from "bcryptjs";
import expressAsyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import { generateToken } from "../utils.js";

const userRouter = express.Router();

// Signup
userRouter.post(
  "/signup",
  expressAsyncHandler(async (req, res) => {
    console.log(req.body);
    const { fullName, email, phoneNumber, image, password } = req.body;
    const foundUser = await User.findOne({ email });
    if (foundUser) {
      res.status(401).send({ message: `User with ${email} already exists` });
    } else {
      const newUser = new User({
        fullName,
        phoneNumber,
        email,
        image,
        password: bcrypt.hashSync(password, 10),
      });
      const user = await newUser.save();
      res.send({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        image: user.image,
        phoneNumber: user.phoneNumber,
        role: user.role,
        token: generateToken(user),
      });
    }
  })
);

//signIn
userRouter.post(
  "/signin",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    console.log(user);
    if (!user)
      res
        .status(404)
        .send({ message: `user with Email: ${req.body.email} does not exist` });
    else {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          image: user.image,
          phoneNumber: user.phoneNumber,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: "Invalid email or password" });
  })
);

// Update User
userRouter.put(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    console.log("user=", user);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    user.fullName = req.body.fullName || user.fullName;
    user.email = req.body.email || user.email;
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
    user.image = req.body.image || user.image;
    user.role = req.body.role || user.role;
    if (req.body.password) {
      user.password = bcrypt.hashSync(req.body.password, 10);
    }

    const updatedUser = await user.save();
    res.send({
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      phoneNumber: updatedUser.phoneNumber,
      image: updatedUser.image,
      role: updatedUser.role,
      token: generateToken(updatedUser),
    });
  })
);

userRouter.delete(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch || user.email !== email) {
      return res.status(400).send({ message: "Invalid credentials" });
    }

    await User.deleteOne({ _id: req.params.id });
    res.send({ message: "User deleted successfully" });
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

export default userRouter;
