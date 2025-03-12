import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true, trim: true },
    resetToken: { type: String, default: "" },
    image: { type: String, default: "" },
    role: {
      type: String,
      enum: ["USER", "ADMIN", "SUPER_ADMIN"],
      default: "USER",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
