import express from "express";
import expressAsyncHandler from "express-async-handler";

import { deleteImageByPublicId, sendMail } from "../utils.js";
import prisma from "../prisma/prisma.js";

const adsRouter = express.Router();

// Create Ad
adsRouter.post(
  "/create-ad",
  expressAsyncHandler(async (req, res) => {
    const { userId, title, description, category, image, imageId, company } =
      req.body;

    if (!userId || !title || !image || !imageId || !description || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const ad = await prisma.ad.create({
      data: {
        title,
        image,
        imageId,
        description,
        category,
        company,
        userId,
      },
    });

    res.status(201).json(ad);
  })
);

// Get All Add
adsRouter.get(
  "/get-ads",
  expressAsyncHandler(async (req, res) => {
    try {
      const ads = await prisma.ad.findMany({
        orderBy: { postedAt: "desc" },
      });
      res.status(200).json(ads);
    } catch (error) {
      console.error("Error fetching ads:", error);
      res.status(500).json({ message: "Failed to fetch ads" });
    }
  })
);

// Get Single Ad by ID - WITH full user details
adsRouter.get(
  "/get-ad/:id",
  expressAsyncHandler(async (req, res) => {
    try {
      const ad = await prisma.ad.findUnique({
        where: { id: req.params.id },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              image: true,
              imageId: true,
              phone: true,
              country: true,
              image: true,
              address: true,
            },
          },
        },
      });

      if (!ad) {
        return res.status(404).json({ message: "Ad not found" });
      }

      res.status(200).json(ad);
    } catch (error) {
      console.error("Error fetching ad:", error);
      res.status(500).json({ message: "Failed to fetch ad" });
    }
  })
);

//ads-count
adsRouter.get(
  "/ads-count/:id",
  expressAsyncHandler(async (req, res) => {
    try {
      // Get all ad IDs that the user has seen
      const seenAdIds = await prisma.seenAd.findMany({
        where: { userId: req.params.id },
        select: { adId: true },
      });

      const unseenAdsCount = await prisma.ad.count({
        where: {
          id: {
            notIn: seenAdIds.map((entry) => entry.adId),
          },
        },
      });

      res.status(200).json({ count: unseenAdsCount });
    } catch (error) {
      console.error("Error getting ads count:", error);
      res.status(500).json({ message: "Failed to get ads count" });
    }
  })
);

//mark-ads-seen
adsRouter.post(
  "/mark-ads-seen/:id",
  expressAsyncHandler(async (req, res) => {
    const userId = req.params.id;

    try {
      // Get all ad IDs
      const ads = await prisma.ad.findMany({
        select: { id: true },
      });

      const allAdIds = ads.map((ad) => ad.id);

      // Find already seen ads for this user
      const seenAds = await prisma.seenAd.findMany({
        where: {
          userId,
          adId: { in: allAdIds },
        },
        select: { adId: true },
      });

      const seenAdIds = new Set(seenAds.map((entry) => entry.adId));

      // Filter only unseen ads
      const unseenEntries = allAdIds
        .filter((adId) => !seenAdIds.has(adId))
        .map((adId) => ({ adId, userId }));

      // Only create unseen ones
      if (unseenEntries.length > 0) {
        await prisma.seenAd.createMany({
          data: unseenEntries,
        });
      }

      res.status(200).json({ message: "Ads marked as seen" });
    } catch (error) {
      console.error("Error marking ads as seen:", error);
      res.status(500).json({ message: "Failed to update seen ads" });
    }
  })
);

//Delete-ad
adsRouter.delete(
  "/delete-ad/:id",
  expressAsyncHandler(async (req, res) => {
    const adId = req.params.id;

    try {
      // Fetch ad and its imageId
      const ad = await prisma.ad.findUnique({
        where: { id: adId },
        select: { imageId: true }, // only fetch imageId
      });
      console.log("ad=", ad);
      if (!ad) {
        return res.status(404).json({ message: "Ad not found" });
      }

      // If imageId exists, delete from Cloudinary
      if (ad.imageId) {
        console.log("object");
        try {
          const res = await deleteImageByPublicId(ad.imageId);
          console.log("res=", res);
        } catch (err) {
          console.error("Failed to delete ad image from Cloudinary:", err);
          // You may continue or halt here depending on criticality
        }
      }

      // Delete ad from database
      await prisma.ad.delete({
        where: { id: adId },
      });

      res.status(200).json({ message: "Ad and image deleted successfully" });
    } catch (error) {
      console.error("Error deleting ad:", error);
      res.status(500).json({ message: "Failed to delete ad" });
    }
  })
);

//Send Advert PIN
adsRouter.post(
  "/send-pin",
  expressAsyncHandler(async (req, res) => {
    const { email, pinValidity } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Generate a 6-digit random PIN
    const generatedPin = Math.floor(100000 + Math.random() * 900000);

    // Update user with PIN, token, and validity
    await prisma.user.update({
      where: { email },
      data: {
        advertPin: generatedPin.toString(),
        pinValidity,
      },
    });

    try {
      const subject = "Your Advert PIN";
      const sent_to = user.email;
      const sent_from = process.env.EMAIL_USER;
      const reply_to = sent_from;
      const message = `
        <p>You requested an advert PIN. Use the code below to continue:</p>
        <h2>${generatedPin}</h2>
        <p>If you did not request this, please ignore this email.</p>
      `;

      await sendMail(subject, message, sent_to, sent_from, reply_to);

      res.json({ message: "Email sent successfully" });
    } catch (error) {
      res.status(500).json({
        message: "Email sending failed",
        error: error.message,
      });
    }
  })
);

//confirm-pin
adsRouter.post(
  "/confirm-pin",
  expressAsyncHandler(async (req, res) => {
    const { email, advertPin } = req.body;

    try {
      const user = await prisma.user.findFirst({
        where: { email, advertPin },
      });

      if (!user) {
        return res.status(400).json({ message: "Invalid advertPin" });
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { advertPin: null },
      });

      res.json({ message: "User found" });
    } catch (error) {
      res.status(400).json({ message: "Invalid or expired code" });
    }
  })
);

// POST /api/pricing
adsRouter.post(
  "/pricing",
  expressAsyncHandler(async (req, res) => {
    const { duration, amount } = req.body;

    if (!duration || !amount) {
      return res
        .status(400)
        .json({ message: "Duration and amount are required" });
    }

    const updated = await prisma.adPricing.upsert({
      where: { duration },
      update: { amount },
      create: { duration, amount },
    });
    res.json({ message: "Successfully updated" });
  })
);

// GET /api/pricing
adsRouter.get(
  "/price/get",
  expressAsyncHandler(async (req, res) => {
    const pricing = await prisma.adPricing.findMany({
      orderBy: { amount: "asc" },
    });
    res.json(pricing);
  })
);

export default adsRouter;
