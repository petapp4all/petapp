import express from "express";
import { nanoid } from "nanoid";
import expressAsyncHandler from "express-async-handler";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const imageRouter = express.Router();

// Upload Image
imageRouter.post(
  "/upload",
  expressAsyncHandler(async (req, res) => {
    try {
      console.log("Incoming image data:", req.body.image.slice(0, 30)); // print beginning only

      const result = await cloudinary.uploader.upload(req.body.image, {
        public_id: nanoid(),
        resource_type: "image",
      });
      console.log("CLOUDINARY RESULT => ", result);
      res.json({ secure_url: result.secure_url, public_id: result.public_id });
    } catch (err) {
      console.error("Image upload failed", err);
      res
        .status(500)
        .json({ error: "Image upload failed", details: err.message });
    }
  })
);

// Update Image
imageRouter.put(
  "/update/:public_id",
  expressAsyncHandler(async (req, res) => {
    const { public_id } = req.params;
    try {
      const result = await cloudinary.uploader.upload(req.body.image, {
        public_id,
        overwrite: true, // Allow overwriting the existing image
        resource_type: "image",
      });
      res.json({ secure_url: result.secure_url });
    } catch (err) {
      console.error("Image update failed", err);
      res
        .status(500)
        .json({ error: "Image update failed", details: err.message });
    }
  })
);

// Delete Image
imageRouter.delete(
  "/delete/:public_id",
  expressAsyncHandler(async (req, res) => {
    const { public_id } = req.params;
    console.log("public_id=", public_id);
    try {
      const result = await cloudinary.uploader.destroy(public_id, {
        resource_type: "image",
      });
      if (result.result === "ok") {
        res.json({ message: "Image deleted successfully" });
      } else {
        throw new Error("Deletion failed");
      }
    } catch (err) {
      console.error("Image deletion failed", err);
      res
        .status(500)
        .json({ error: "Image deletion failed", details: err.message });
    }
  })
);

export default imageRouter;
