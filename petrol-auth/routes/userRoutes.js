import express from "express";
import bcrypt from "bcryptjs";
import expressAsyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import { generateToken } from "../utils.js";

const userRouter = express.Router();

//signup
userRouter.post(
  "/signup",
  expressAsyncHandler(async (req, res) => {
    console.log(req.body);
    const { fullName, email, phoneNumber, password } = req.body;
    const foundUser = await User.findOne({ email });
    if (foundUser) {
      console.log(foundUser);
      res.status(401).send({ message: `User with ${email} already exist` });
    } else {
      const newUser = new User({
        fullName,
        email,
        password: bcrypt.hashSync(password),
      });
      const user = await newUser.save();
      res.send({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        isAdmin: user.isAdmin,
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
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: "Invalid email or password" });
  })
);

export default userRouter;
